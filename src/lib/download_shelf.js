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
