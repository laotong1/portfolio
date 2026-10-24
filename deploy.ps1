# 一键发布：同时更新 GitHub Pages 和 Cloudflare Pages
# 用法：右键「使用 PowerShell 运行」，或在终端执行 .\deploy.ps1 "这次改了什么"

param([string]$msg = "")

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not $msg) { $msg = "update " + (Get-Date -Format "yyyy-MM-dd HH:mm") }

Write-Host "`n[1/2] 推送到 GitHub Pages ..." -ForegroundColor Cyan
git add -A
git -c user.name="laotong1" -c user.email="3142775683@qq.com" commit -m $msg
$env:GIT_TERMINAL_PROMPT = "0"
git push

Write-Host "`n[2/2] 部署到 Cloudflare Pages ..." -ForegroundColor Cyan
npx -y wrangler@latest pages deploy . --project-name=tongziyi-portfolio --branch=master --commit-dirty=true

Write-Host "`n完成：" -ForegroundColor Green
Write-Host "  主站  https://laotong1.github.io/portfolio/"
Write-Host "  备用  https://tongziyi-portfolio.pages.dev/"
Write-Host "  手机  https://laotong1.github.io/portfolio/m/"
