$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$oldPath = Join-Path $root "version-vieja"
$newPath = Join-Path $root "version-nueva"

function Start-StaticServer {
  param(
    [string]$Path,
    [int]$Port
  )

  $existing = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "Puerto $Port ya está en uso. Revisá si la versión ya está abierta."
    return
  }

  Start-Process -FilePath python -ArgumentList @("-m", "http.server", "$Port") -WorkingDirectory $Path -WindowStyle Hidden
  Write-Host "Servidor iniciado en http://127.0.0.1:$Port/index.html"
}

Start-StaticServer -Path $oldPath -Port 4180
Start-StaticServer -Path $newPath -Port 4181

Write-Host ""
Write-Host "Versión vieja: http://127.0.0.1:4180/index.html"
Write-Host "Versión nueva: http://127.0.0.1:4181/index.html"
