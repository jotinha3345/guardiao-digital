@echo off
setlocal
cd /d "%~dp0"

echo Preparando o Guardiao Digital para execucao...
cd frontend
call npm.cmd install
call npm.cmd run build
cd ..

cd backend
call npm.cmd install
call npx.cmd prisma generate
cd ..

echo.
echo Pronto.
echo Use o arquivo GuardiaoDigital.bat para abrir o sistema.
pause
