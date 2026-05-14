@echo off
setlocal
cd /d "%~dp0"

title Configurar Banco - Guardiao Digital

echo ==========================================
echo        CONFIGURAR BANCO POSTGRESQL
echo ==========================================
echo.
echo Informe os dados do seu PostgreSQL local.
echo Se voce instalou pelo instalador oficial, o usuario costuma ser postgres.
echo.

set /p PGUSER_INPUT=Usuario PostgreSQL [postgres]: 
if "%PGUSER_INPUT%"=="" set PGUSER_INPUT=postgres

set /p PGPASSWORD_INPUT=Senha do usuario %PGUSER_INPUT%: 
if "%PGPASSWORD_INPUT%"=="" (
  echo.
  echo Senha vazia informada. Tente novamente com a senha definida na instalacao do PostgreSQL.
  pause
  exit /b 1
)

set /p PGPORT_INPUT=Porta PostgreSQL [5432]: 
if "%PGPORT_INPUT%"=="" set PGPORT_INPUT=5432

set /p PGDATABASE_INPUT=Nome do banco [guardiao_digital]: 
if "%PGDATABASE_INPUT%"=="" set PGDATABASE_INPUT=guardiao_digital

set "PSQL_EXE=psql"
where psql >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" set "PSQL_EXE=C:\Program Files\PostgreSQL\18\bin\psql.exe"
)

echo.
echo Testando conexao...
set "PGPASSWORD=%PGPASSWORD_INPUT%"
"%PSQL_EXE%" -h localhost -p %PGPORT_INPUT% -U %PGUSER_INPUT% -d postgres -c "SELECT 1;" >nul 2>nul
if errorlevel 1 (
  echo.
  echo Nao foi possivel autenticar com esses dados.
  echo Confira usuario, senha e porta do PostgreSQL.
  pause
  exit /b 1
)

echo Criando banco, se ainda nao existir...
"%PSQL_EXE%" -h localhost -p %PGPORT_INPUT% -U %PGUSER_INPUT% -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '%PGDATABASE_INPUT%';" | findstr /C:"1" >nul
if errorlevel 1 (
  "%PSQL_EXE%" -h localhost -p %PGPORT_INPUT% -U %PGUSER_INPUT% -d postgres -c "CREATE DATABASE %PGDATABASE_INPUT%;"
)

echo Atualizando backend\.env...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$user='%PGUSER_INPUT%'; $pass='%PGPASSWORD_INPUT%'; $port='%PGPORT_INPUT%'; $db='%PGDATABASE_INPUT%'; $enc=[uri]::EscapeDataString($pass); $url='DATABASE_URL=\"postgresql://' + $user + ':' + $enc + '@localhost:' + $port + '/' + $db + '?schema=public\"'; $envPath='backend\.env'; $lines=Get-Content $envPath; $lines=$lines | ForEach-Object { if ($_ -like 'DATABASE_URL=*') { $url } else { $_ } }; Set-Content -Path $envPath -Value $lines"

echo.
echo Aplicando migrations...
cd backend
call npx.cmd prisma migrate dev
if errorlevel 1 (
  echo.
  echo A conexao funcionou, mas a migration falhou. Veja a mensagem acima.
  pause
  exit /b 1
)

echo.
echo Carregando dados iniciais...
call npm.cmd run seed

echo.
echo Banco configurado com sucesso.
echo Agora voce pode abrir GuardiaoDigital.exe ou GuardiaoDigital.bat.
pause
