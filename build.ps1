# Set current directory to the script's directory
Set-Location $PSScriptRoot

# Create or overwrite the download-shelf.js file in the dist directory
@"
// Vivaldi Download Shelf Mod
//  -- version: $((Get-Content ./VERSION -Raw).Trim())
//  --  author: 2called-chaos

// constants
DOWNLOAD_SHELF_TEMPLATE = ``$((Get-Content ./src/shelf.html -Raw).Trim())``;
DOWNLOAD_SHELF_STYLES = ``$((Get-Content ./src/main.css -Raw).Trim())``;
"@ | Out-File -FilePath ./dist/download-shelf.js -Force

# Append the content of all .js files in the lib directory to download-shelf.js
Get-Content ./src/lib/*.js | Out-File -Append -FilePath ./dist/download-shelf.js -Force

# Append the content of main.js to download-shelf.js
Get-Content ./src/main.js | Out-File -Append -FilePath ./dist/download-shelf.js -Force
