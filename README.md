# Download Shelf Mod for Vivaldi Browser

This is a download shelf mod (inspired by the old Chrome download shelf) for the [Vivaldi Browser](https://vivaldi.com).

** This is an early release, use with caution! **

## Missing features

* No handling of the "safe" flag, clicking an item **will run it!**
* No i18n support (english only)
* drag and drop (I want it though)
* contextmenu (i guess no native?)
* retry (I guess https://developer.chrome.com/docs/extensions/reference/downloads/#method-download)

## Features

* should somewhat use theme colors
* Files in shelf:
  * click = open (or when in progress toggles open when complete)
  * alt+click = show in folder
  * shift+click = pause/resume (when in progress)
  * ctrl/meta+click = cancel (when in progress)


## Installation

1. The whole modification is in `dist/download-shelf.js`, [download it](https://github.com/2called-chaos/vivaldi-download-shelf/blob/master/dist/download-shelf.js)
2. Install the modification according to [these instructions](https://forum.vivaldi.net/topic/10549/modding-vivaldi) **but** we recommend [using a mod folder with an install script](https://forum.vivaldi.net/topic/10592/patching-vivaldi-with-batch-scripts)
3. Restart Vivaldi. It is recommended to disable `Display Downloads Automatically` in Vivaldi's options.
4. Download a file :)

## Updating

Maybe make it a habit to update it whenever you update Vivaldi. You will notice because all mods stop working and need a reinject.
All you need to do is to do the installation steps again. That is download the file, place it into your mod folder and run your install script.
Don't forget to restart Vivaldi!

## Development

* Edit files in src/ and run `build.sh` (bash script) or `build.ps1` (powershell) to create the "release" in dist/
* Copy or symlink `dist/download-shelf.js` to your mod folder and run `install.sh`

Your setup should either inject all your mods or a concatenated version of it into your Vivaldi installation.
For reference, here is my [install script for my Vivaldi mod folder](https://gist.github.com/2called-chaos/4572efe488d05799f6c2ec3a7d65ef8c)


## Contributing

1. Fork it ( http://github.com/2called-chaos/vivaldi-download-shelf/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
6. Pat yourself on the shoulder, thank you!
