<#
Run both servers (backend + frontend) from project root.
Usage:
  powershell -ExecutionPolicy Bypass -File .\run-servers.ps1

This script will:
- check for `node_modules` in `backend` and `frontend` and run `npm install` if missing
- open two new PowerShell windows and run the backend (`node server.js`) and frontend (`npm run dev`)

Note: If your system blocks script execution, run the `powershell -ExecutionPolicy Bypass -File` command above.
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

function Ensure-NodeModules($dir) {
    $nm = Join-Path $dir 'node_modules'
    if (-not (Test-Path $nm)) {
        Write-Host "Installing dependencies in: $dir"
        Push-Location $dir
        npm install
        Pop-Location
    }
    else {
        Write-Host "Dependencies already installed in: $dir"
    }
}

# Install if missing
Ensure-NodeModules $backend
Ensure-NodeModules $frontend

# Launch backend in a new PowerShell window
$backendCmd = "cd '$backend'; node server.js"
Start-Process powershell -ArgumentList "-NoExit","-Command","$backendCmd" -WorkingDirectory $backend

# Launch frontend in a new PowerShell window
$frontendCmd = "cd '$frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit","-Command","$frontendCmd" -WorkingDirectory $frontend

Write-Host "Started backend and frontend in new PowerShell windows."