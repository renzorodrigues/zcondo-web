@echo off

echo Cleaning the .next directory...
if exist .next rmdir /s /q .next

echo Installing dependencies...
call npm install

echo Running the build...
call npm run build

if %ERRORLEVEL% EQU 0 (
  echo Build successful!
) else (
  echo Build failed!
) 