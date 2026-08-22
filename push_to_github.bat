@echo off
echo =======================================================
echo Pushing SkillPulse Blockchain Module to GitHub
echo Repo: https://github.com/VorugantiRahul/xyz.git
echo =======================================================

cd /d "C:\Users\YASHWANTH\.gemini\antigravity\scratch\skillpulse"

git init
git remote remove origin 2>nul
git remote add origin https://github.com/VorugantiRahul/xyz.git

echo Pulling remote main...
git pull origin main --allow-unrelated-histories

echo Adding files...
git add contracts/ docs/ .gitignore

echo Committing...
git commit -m "feat(blockchain): add SkillPulse smart contracts, tests, ABI, and Monad documentation"

echo Pushing to GitHub...
git push -u origin main

echo =======================================================
echo Done!
pause