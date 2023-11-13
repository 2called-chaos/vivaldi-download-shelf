// Vivaldi Download Shelf Mod
//  -- version: 0.1
//  --  author: 2called-chaos

// constants
DOWNLOAD_SHELF_TEMPLATE = `<div id="download-shelf" class="toolbar toolbar-statusbar toolbar-medium" style="display: none; z-index: 6">
  <div id="download-shelf-downloads" class="button-toolbar"></div>

  <template id="download-shelf-entry-template">
    <button name="fileHandle" draggable="true" type="button" class="download-shelf-entry working">
      <div class="entry-icon-outer">
        <div class="entry-spinner" style="--value: 0"></div>
        <img class="entry-icon" src="">
      </div>
      <div class="entry-info-panel">
        <div class="entry-name">?</div>
        <div class="entry-csize" style="display: none"></div>
        <div class="entry-tsize" style="display: none"></div>
        <div class="entry-status">Starting...</div>
      </div>
      <div class="entry-actions button-toolbar">
        <a draggable="false" type="button" class="entry-actions-toggle ToolbarButton-Button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
        </a>
      </div>
      <div class="divider"></div>
    </button>
  </template>

  <div class="shelf-actions button-toolbar panel-clickoutside-ignore">
    <button name="downloadShelfShowAll" draggable="false" title="Show all" type="button" class="ToolbarButton-Button">
      <span class="button-textonly">Show all</span>
    </button>
    <button name="downloadShelfClearAll" draggable="false" title="Close" type="button" class="ToolbarButton-Button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
        <path d="m12.5 5-1.4-1.4-3.1 3-3.1-3L3.5 5l3.1 3.1-3 2.9 1.5 1.4L8 9.5l2.9 2.9 1.5-1.4-3-2.9"></path>
      </svg>
    </button>
  </div>
</div>`;
DOWNLOAD_SHELF_STYLES = `#download-shelf {
  background-color: var(--colorWindowBg);
}

#download-shelf .shelf-actions {
  margin-left: auto;
  margin-right: 0.5rem;
}

#download-shelf .shelf-actions button {
  padding: 0.5rem !important;
  height: auto !important;
  flex: none !important;
  min-width: 0 !important;
  margin-left: 0.5rem;
  border-radius: 4px !important;
}
#download-shelf .shelf-actions button:hover {
  background-color: var(--colorHighlightBgAlpha);
}

#download-shelf .shelf-actions button svg {
  width: 16px !important;
  height: 16px !important;
}

#download-shelf .shelf-actions [name="downloadShelfShowAll"] {
  padding: 0.5rem 0.75rem !important;
  border: 1px solid var(--colorAccentBorderDark) !important;
}


#download-shelf-downloads {

}

#download-shelf-downloads .download-shelf-entry {
  display: flex !important;
  align-items: center;
  padding: 0.66rem 0.5rem 0.66rem 0.75rem !important;
  position: relative;
  height: 100% !important;
  transition: background-color 250ms linear;
}

#download-shelf-downloads .download-shelf-entry:hover {
  background-color: var(--colorHighlightBgAlpha);
}

#download-shelf-downloads .download-shelf-entry .entry-status,
#download-shelf-downloads .download-shelf-entry .entry-name {
  width: 180px;
  max-width: 180px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#download-shelf-downloads .download-shelf-entry .entry-status {
  margin-top: 0.2rem;
  font-size: 0.6rem;
}

#download-shelf-downloads .download-shelf-entry.error .entry-status {
  color: var(--colorErrorBg);
}

#download-shelf-downloads .download-shelf-entry .entry-info-panel {
  padding: 0 0.25rem 0 0.5rem;
}

#download-shelf-downloads .download-shelf-entry .entry-actions a {
  padding: 0.5rem;
  border-radius: 4px;
}
#download-shelf-downloads .download-shelf-entry .entry-actions a:hover {
  background-color: var(--colorBgFaded);
}

#download-shelf-downloads .download-shelf-entry .divider {
  border-right: 1px solid var(--colorAccentFgFaded);
  position: absolute;
  top: 10%;
  bottom: 10%;
  right: 0;
}

@keyframes progress {
  0% { --percentage: 0; }
  100% { --percentage: var(--value); }
}

@keyframes dl-finished {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

@keyframes rotate {
  100%   { transform: rotate(360deg) }
}

@property --percentage {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

#download-shelf-downloads .download-shelf-entry .entry-icon-outer {
  position: relative;
}

#download-shelf-downloads .download-shelf-entry .entry-icon {
  position: absolute;
  /*top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);*/
  left: 8px;
  top: 8px;
  width: 55%;
}

#download-shelf-downloads .download-shelf-entry .entry-spinner {
  --percentage: var(--value);
  --size: 36px;
  animation: progress 2s 0.5s forwards;
  width: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
}

#download-shelf-downloads .download-shelf-entry.working .entry-spinner {
  --value: 30 !important;
  animation: rotate 1s linear infinite;
}

#download-shelf-downloads .download-shelf-entry.error .entry-spinner,
#download-shelf-downloads .download-shelf-entry.complete .entry-spinner {
  animation: dl-finished 2s 0.5s forwards;
}

#download-shelf-downloads .download-shelf-entry.complete .entry-spinner::before {
  background: conic-gradient(var(--colorSuccessBg) 100%, var(--colorAccentBgDarker) 0);
}

#download-shelf-downloads .download-shelf-entry.error .entry-spinner::before {
  background: conic-gradient(var(--colorErrorBg) 100%, var(--colorAccentBgDarker) 0);
}

#download-shelf-downloads .download-shelf-entry .entry-spinner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: conic-gradient(var(--colorHighlightBg) calc(var(--percentage) * 1%), var(--colorAccentBgDarker) 0);
  mask: radial-gradient(white 55%, transparent 0);
  mask-mode: alpha;
  -webkit-mask: radial-gradient(#0000 55%, #000 0);
  -webkit-mask-mode: alpha;
}`;
class DownloadShelf {
  constructor(opts = {}) {
    this.items = {}

    document.addEventListener("DOMContentLoaded", _ => {
      this.findFooter().then(_ => {
        this.buildDOM()
        this.registerEvents()
      })
    })
  }

  registerEvents() {
    chrome.downloads.onCreated.addListener(item => {
      this.getOrCreate(item)
      this.startPollingProgress()
    })

    chrome.downloads.onChanged.addListener(delta => {
      this.items[delta.id]?.onChanged?.(delta)
    })

    chrome.downloads.onErased.addListener(id => {
      this.items[id]?.onErased?.()
    })

    this.btnShowAll.addEventListener("click", ev => {
      this.destroyAllItems()
      window.open("vivaldi://downloads")
      return false
    })

    this.btnClearAll.addEventListener("click", ev => {
      this.destroyAllItems()
      return false
    })
  }

  getOrCreate(item) {
    if(!this.items[item.id]) {
      this.items[item.id] = new DownloadShelfItem(this, item)
      this.autoVisibility()
    }
    return this.items[item.id]
  }

  destroyAllItems() {
    Object.entries(this.items).forEach(([id, item]) => { item.destroy() })
  }

  autoVisibility() {
    this.shelfContainer.style.display = Object.keys(this.items).length ? "flex" : "none"
  }

  findFooter() {
    if(!this.footerPromise) {
      this.foundFooter = false
      this.waitedForFooter = 0
      this.footerPromise = new Promise((resolve, reject) => {
        this.waitForFooter(resolve)
      })
    }

    return this.footerPromise
  }

  waitForFooter(callback) {
    if(!this.foundFooter && document.querySelector("footer")) {
      this.foundFooter = document.querySelector("footer")
      console.log("found footer after", this.waitedForFooter)
    }

    if(this.foundFooter) {
      callback?.()
      return this.foundFooter
    }

    this.waitedForFooter += 50
    setTimeout(_ => { this.waitForFooter(callback) }, 50)
  }

  buildDOM() {
    document.querySelector("footer").insertAdjacentHTML('beforebegin', `<style type="text/css">${DOWNLOAD_SHELF_STYLES}</style>`)
    document.querySelector("footer").insertAdjacentHTML('beforebegin', DOWNLOAD_SHELF_TEMPLATE)
    this.shelfContainer = document.querySelector("#download-shelf")
    this.itemContainer = this.shelfContainer.querySelector("#download-shelf-downloads")
    this.btnShowAll = this.shelfContainer.querySelector(`button[name="downloadShelfShowAll"]`)
    this.btnClearAll = this.shelfContainer.querySelector(`button[name="downloadShelfClearAll"]`)
  }

  startPollingProgress() {
    if (!this.poll_tid) {
      this.poll_tid = setTimeout(_ => this.pollProgress(), 200)
    }
  }

  pollProgress() {
    this.poll_tid = 0
    chrome.downloads.search({ state: 'in_progress', paused: false }, (results) => {
      if (!results.length) return;
      results.forEach((result) => {
        const item = this.getOrCreate(result)
        for (var prop in result) {
          item.assign(prop, result[prop])
        }
        item.render()
        if ((item.item.state == 'in_progress') && !item.item.paused) {
          this.startPollingProgress()
        }
      })
    })
  }
};
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
if(!window.downloadShelf) {
  window.downloadShelf = new DownloadShelf({
    debug: true,
  })
};
