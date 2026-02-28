# Bhavishyam - Push to GitHub Script
Write-Host "📤 Pushing changes to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git for Windows." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[1/5] Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "[2/5] Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "[3/5] Checking what will be committed..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "[4/5] Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
feat: comprehensive seed data system and deployment improvements

- Fixed wallet service architecture (transactions only, balances in user service)
- Updated database schemas to match actual implementations
- Enhanced deployment scripts with better error handling
- Created automated testing and verification tools
- Added comprehensive deployment documentation
- Improved seed data with 15+ markets and 5 demo users
- Added troubleshooting guides and reset procedures
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Push complete!" -ForegroundColor Green
Write-Host "🌐 Repository: https://github.com/rpolepalli/bhavishyam" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary of changes:" -ForegroundColor Yellow
Write-Host "  • Fixed wallet service architecture"
Write-Host "  • Enhanced deployment scripts"
Write-Host "  • Added comprehensive documentation"
Write-Host "  • Created testing and verification tools"