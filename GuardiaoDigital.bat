@echo off
setlocal
title Guardiao Digital

cd /d "%~dp0"

echo ==========================================
echo        GUARDIAO DIGITAL
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node.js antes de executar.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm nao encontrado. Reinstale o Node.js antes de executar.
  pause
  exit /b 1
)

if not exist "backend\node_modules" (
  echo Instalando dependencias do backend...
  cd backend
  call npm.cmd install
  cd ..
)

if not exist "frontend\node_modules" (
  echo Instalando dependencias do frontend...
  cd frontend
  call npm.cmd install
  cd ..
)

if not exist "frontend\dist\index.html" (
  echo Gerando build do frontend...
  cd frontend
  call npm.cmd run build
  cd ..
)

echo.
echo Aplicando migrations do banco...
cd backend
call npx.cmd prisma migrate dev
if errorlevel 1 (
  echo.
  echo Nao foi possivel conectar ao PostgreSQL.
  echo Confira backend\.env e se o banco guardiao_digital existe.
  pause
  exit /b 1
)

echo.
echo Carregando dados iniciais...
call npm.cmd run seed

echo.
echo Abrindo sistema em http://localhost:3333
start "" http://localhost:3333
echo.
echo Servidor iniciado. Feche esta janela para encerrar.
echo.
call npm.cmd start
