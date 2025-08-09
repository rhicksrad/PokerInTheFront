param(
  [string]$RepoName = "PokerInTheFront",
  [switch]$SkipGitPush
)
$ErrorActionPreference = "Stop"

function Ensure-FileDir {
  param([string]$Path)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  if (-not (Test-Path $Path)) { New-Item -ItemType File -Path $Path | Out-Null }
}

if (-not (Test-Path ".git")) { throw "Run this from your git repo root." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw "npm not found in PATH." }

$viteCfg = @"
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/$RepoName/',
  build: { outDir: 'docs' }
});
"@
Set-Content -Path "vite.config.ts" -Value $viteCfg -Encoding UTF8

Ensure-FileDir "src\main.ts"
Ensure-FileDir "styles\app.css"

if ((Get-Item "styles\app.css").Length -eq 0) {
  @"
:root { --bg:#0b0f14; --fg:#e6e6e6; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
html,body,#app{height:100%} body{margin:0;background:var(--bg);color:var(--fg)}
"@ | Set-Content "styles\app.css" -Encoding UTF8
}

$mainTs = Get-Content "src\main.ts" -Raw
if ($mainTs -notmatch "(?m)^\s*import\s+['""]\./styles/app\.css['""];?") {
  $mainTs = "import './styles/app.css';`r`n" + $mainTs
  Set-Content "src\main.ts" -Value $mainTs -Encoding UTF8
}

if (Test-Path "index.html") {
  Copy-Item "index.html" "index.html.bak" -Force
  $html = Get-Content "index.html" -Raw
  $html = $html -replace '(?is)<link[^>]+href\s*=\s*["'']/styles/app\.css["''][^>]*>\s*', ''
  $html = $html -replace '(?is)<link[^>]+href\s*=\s*["'']\.\/styles/app\.css["''][^>]*>\s*', ''
  if ($html -notmatch '(?is)<script[^>]+type=["'"]module["'"][^>]+src=["'"]/src/main\.ts["'"]') {
    $entry = '<script type="module" src="/src/main.ts"></script>'
    if ($html -match '</body>') { $html = $html -replace '(?is)</body>', "$entry`r`n</body>" }
    else { $html += "`r`n$entry`r`n" }
  }
  Set-Content "index.html" -Value $html -Encoding UTF8
} else {
  throw "index.html not found at repo root."
}

npm install
npm run build

if (Test-Path "docs\index.html") {
  Copy-Item "docs\index.html" "docs\404.html" -Force
} else {
  throw "Build did not produce docs/index.html. Check Vite output."
}

if (-not $SkipGitPush) {
  git add -A
  git commit -m "fix(pages): set Vite base, bundle to /docs, CSS import, SPA 404"
  git push
}

Write-Host "Done. In GitHub  Settings  Pages: set Source: main, Folder: /docs"
Write-Host "Open: https://rhicksrad.github.io/$RepoName/"
