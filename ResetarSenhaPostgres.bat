@echo off
setlocal
cd /d "%~dp0"

title Resetar Senha PostgreSQL - Guardiao Digital

net session >nul 2>nul
if errorlevel 1 (
  echo Este utilitario precisa ser executado como Administrador.
  echo.
  echo Clique com o botao direito em ResetarSenhaPostgres.bat
  echo e escolha "Executar como administrador".
  pause
  exit /b 1
)

set "PG_BIN=C:\Program Files\PostgreSQL\18\bin"
set "PG_DATA=C:\Program Files\PostgreSQL\18\data"
set "PG_HBA=%PG_DATA%\pg_hba.conf"
set "PG_SERVICE=postgresql-x64-18"
set "NEW_PASSWORD=guardiao123"

if not exist "%PG_BIN%\psql.exe" (
  echo Nao encontrei o psql em %PG_BIN%.
  echo Ajuste o caminho PG_BIN dentro deste arquivo se sua instalacao for diferente.
  pause
  exit /b 1
)

if not exist "%PG_HBA%" (
  echo Nao encontrei o arquivo %PG_HBA%.
  echo Ajuste o caminho PG_DATA dentro deste arquivo se sua instalacao for diferente.
  pause
  exit /b 1
)

echo ==========================================
echo      RESETAR SENHA DO POSTGRESQL
echo ==========================================
echo.
echo Usuario que sera usado: postgres
echo Nova senha que sera definida: %NEW_PASSWORD%
echo.
echo Este processo vai:
echo 1. Fazer backup do pg_hba.conf
echo 2. Liberar login local temporariamente
echo 3. Reiniciar o servico PostgreSQL
echo 4. Definir nova senha
echo 5. Restaurar a configuracao original
echo.
pause

copy "%PG_HBA%" "%PG_HBA%.guardiao-backup" >nul
if errorlevel 1 (
  echo Nao foi possivel criar backup do pg_hba.conf.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$path='%PG_HBA%'; $original=Get-Content $path; $rules=@('# GUARDIAO_DIGITAL_TEMP_START','host all all 127.0.0.1/32 trust','host all all ::1/128 trust','# GUARDIAO_DIGITAL_TEMP_END'); Set-Content -Path $path -Value ($rules + $original)"

echo.
echo Reiniciando PostgreSQL com login temporario...
net stop "%PG_SERVICE%"
net start "%PG_SERVICE%"
if errorlevel 1 (
  echo Nao foi possivel reiniciar o servico %PG_SERVICE%.
  copy "%PG_HBA%.guardiao-backup" "%PG_HBA%" >nul
  pause
  exit /b 1
)

echo.
echo Definindo nova senha do usuario postgres...
"%PG_BIN%\psql.exe" -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '%NEW_PASSWORD%';"
if errorlevel 1 (
  echo Falha ao alterar a senha.
  copy "%PG_HBA%.guardiao-backup" "%PG_HBA%" >nul
  net stop "%PG_SERVICE%"
  net start "%PG_SERVICE%"
  pause
  exit /b 1
)

echo.
echo Restaurando seguranca original do PostgreSQL...
copy "%PG_HBA%.guardiao-backup" "%PG_HBA%" >nul
net stop "%PG_SERVICE%"
net start "%PG_SERVICE%"

echo.
echo Atualizando backend\.env para usar a nova senha...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$envPath='backend\.env'; $url='DATABASE_URL=\"postgresql://postgres:%NEW_PASSWORD%@localhost:5432/guardiao_digital?schema=public\"'; $lines=Get-Content $envPath; $lines=$lines | ForEach-Object { if ($_ -like 'DATABASE_URL=*') { $url } else { $_ } }; Set-Content -Path $envPath -Value $lines"

echo.
echo Criando banco guardiao_digital se ainda nao existir...
set "PGPASSWORD=%NEW_PASSWORD%"
"%PG_BIN%\psql.exe" -h localhost -p 5432 -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'guardiao_digital';" | findstr /C:"1" >nul
if errorlevel 1 (
  "%PG_BIN%\psql.exe" -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE guardiao_digital;"
)

echo.
echo Aplicando migrations e seed...
cd backend
call npx.cmd prisma migrate dev
call npm.cmd run seed

echo.
echo Pronto. Nova conexao:
echo usuario: postgres
echo senha: %NEW_PASSWORD%
echo banco: guardiao_digital
echo.
echo Agora abra GuardiaoDigital.exe.
pause
