class DownloadShelfItem {
  constructor(shelf, item) {
    this.shelf = shelf
    this.item = {}
    for (var prop in item) {
      this.assign(prop, item[prop])
    }

    if (this.item.canResume == undefined) { this.canResumeHack = true }

    this.buildDOM()
    this.registerEvents()
  }

  updateData(kv, skip = []) {
    Object.entries(kv).forEach(([key, value]) => {
      if(skip.includes(key)) return
      this.assign(key, value.current)
    })
  }

  assign(key, value) {
    if (["estimatedEndTime", "endTime", "startTime"].includes(key)) {
      this.item[key] = new Date(value)
    } else if (key == "filename") {
      this.item[key] = value
      this.item.basename = value.substring(Math.max(value.lastIndexOf('\\'), value.lastIndexOf('/')) + 1)
    } else {
      this.item[key] = value
    }
  }

  registerEvents() {
    this.node.addEventListener("dragstart", ev => {
      if(this.item.state != "complete") { return false }
      const url = `file://${this.item.filename}`
      ev.dataTransfer.setData("image/png", url);
      ev.dataTransfer.setData("application/x-moz-file", url);
      ev.dataTransfer.setData("text/uri-list", url);
      ev.dataTransfer.setData("text/plain", url);
    })

    this.node.addEventListener("click", ev => {
      if(ev.altKey) {
        this.show()
      } else if (this.item.state == 'complete') {
        this.open()
      } else if (this.item.state == 'in_progress') {
        if (ev.ctrlKey || ev.metaKey) {
          this.cancel()
        } else if (ev.shiftKey) {
          if(this.item.paused) {
            this.resume()
          } else {
            this.pause()
          }
        } else {
          this.openWhenComplete = !this.openWhenComplete
          this.render()
        }
      } else if (this.item.state == 'interrupted') {
      }
      return false
    })

    this.btn_actionToggle.addEventListener("click", ev => {
      ev.stopPropagation()
      return false
    })
  }

  onChanged(delta) {
    this.updateData(delta, ["id"])
    this.render()
    if ((this.item.state == 'in_progress') && !this.item.paused) {
      this.shelf.startPollingProgress()
    }
  }

  onErased() {
    this.destroy()
  }

  cancel() {
    chrome.downloads.cancel(this.item.id, _ => { this.render() })
  }

  resume() {
    chrome.downloads.resume(this.item.id, _ => { this.render() })
  }

  removeFile() {
    chrome.downloads.removeFile(this.item.id, _ => { this.destroy() })
  }

  pause() {
    chrome.downloads.pause(this.item.id, _ => { this.render() })
  }

  show() {
    chrome.downloads.show(this.item.id)
  }

  retry() {

  }

  open() {
    if (this.item.state == 'complete') {
      this.destroy()
      return chrome.downloads.open(this.item.id)
    } else {
      this.openWhenComplete = true
    }
  }

  destroy() {
    this.node.remove()
    delete this.shelf.items[this.item.id]
    this.shelf.autoVisibility()
  }

  buildDOM() {
    const clone = document.querySelector("#download-shelf-entry-template").content.cloneNode(true)
    clone.children[0].id = "shelf-item-" + this.item.id
    this.shelf.itemContainer.insertBefore(clone, this.shelf.itemContainer.childNodes[0])
    this.node = document.querySelector(`#shelf-item-${this.item.id}`)
    this.i_name = this.node.querySelector(".entry-name")
    this.i_icon = this.node.querySelector(".entry-icon")
    this.i_status = this.node.querySelector(".entry-status")
    this.i_spinner = this.node.querySelector(".entry-spinner")
    this.i_csize = this.node.querySelector(".entry-csize")
    this.i_tsize = this.node.querySelector(".entry-tsize")
    this.btn_actionToggle = this.node.querySelector(".entry-actions-toggle")
    this.render()
  }

  formatBytes(n) {
    if (n < 1024) { return n + 'B' }
    var prefixes = 'KMGTPEZY'
    var mul = 1024
    for (var i = 0; i < prefixes.length; ++i) {
      if (n < (1024 * mul)) {
        return (parseInt(n / mul) + '.' + parseInt(10 * ((n / mul) % 1)) + "&thinsp;" + prefixes[i] + 'B')
      }
      mul *= 1024
    }
    return '!!!'
  }

  timeRemaining(ms, sprog = "") {
    const owc = this.openWhenComplete
    if (ms < 1000) {
      return owc ? "Opening in just a moment" : "finishing..."
    }
    const fmt = this.formatTimeleft(ms)
    return owc ? `Opening in ${fmt}` : `${sprog}, ${fmt} left`
  }

  formatTimeleft(ms) {
    if (ms < 1000) { return `${ms}ms` }
    var days = parseInt(ms / (24 * 60 * 60 * 1000));
    var hours = parseInt(ms / (60 * 60 * 1000)) % 24;
    if (days) { return `${days}d ${hours}h` }
    var minutes = parseInt(ms / (60 * 1000)) % 60;
    if (hours) { `${hours}h ${minutes}m` }
    var seconds = parseInt(ms / 1000) % 60;
    if (minutes) { return `${minutes}m ${seconds}s` }
    return `${seconds}s`
  }


  render() {
    const item = this.item
    // console.log("render", item.state, item)
    let in_progress = (item.state == 'in_progress')
    let openable = (item.state != 'interrupted') && item.exists && !item.deleted
    let canResume = this.canResumeHack
    if (this.canResumeHack) {
      item.canResume = in_progress && item.paused
    }

    if (item.filename && !item.icon_url) {
      chrome.downloads.getFileIcon(
        item.id,
        {'size': 32},
        (icon_url) => {
          if (icon_url) {
            item.icon_url = icon_url
            this.i_icon.src = icon_url
          }
        }
      )
    }

    this.i_name.innerText = item.basename
    const f_csize = this.formatBytes(item.bytesReceived)
    const f_tsize = this.formatBytes(item.totalBytes)
    let status = this.i_status.innerHTML = f_csize + '&thinsp;/&thinsp;' + f_tsize
    this.node.classList.toggle("working", !item.totalBytes)
    this.node.classList.toggle("paused", !!item.paused)
    this.node.classList.toggle("error", !!item.error)

    if (item.error) {
      status = item.error
    } else if (item.totalBytes && (item.state != 'complete')) {
      this.i_spinner.style.setProperty('--value', parseInt( 100 * item.bytesReceived / item.totalBytes))
      if (this.item.paused) {
        status += ", Paused"
      } else if (item.estimatedEndTime) {
        status = this.timeRemaining(item.estimatedEndTime.getTime() - Date.now(), status)
        if(item.currentSpeed) {
          status += " @ " + this.formatBytes(item.currentSpeed) + "/s"
        }
      }
    } else if (item.state == 'complete') {
      status = f_tsize
      if (item.endTime) {
        status += " in " + this.formatTimeleft(item.endTime.getTime() - item.startTime.getTime())
      }
      this.i_spinner.style.setProperty('--value', 100)
      this.node.classList.remove("working")
      this.node.classList.add("complete")
      if(this.openWhenComplete) { this.open() }
    }

    this.i_status.innerHTML = status
  }
};
