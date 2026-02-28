@echo off
echo 📤 Pushing changes to GitHub...
echo.

echo [1/4] Checking git status...
git status

echo.
echo [2/4] Adding all changes...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "feat: comprehensive seed data system and deployment improvements - Fixed wallet service architecture (transactions only, balances in user service) - Updated database schemas to match actual implementations - Enhanced deployment scripts with better error handling - Created automated testing and verification tools - Added comprehensive deployment documentation - Improved seed data with 15+ markets and 5 demo users - Added troubleshooting guides and reset procedures"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ✅ Push complete!
echo 🌐 Repository: https://github.com/rpolepalli/bhavishyam.git