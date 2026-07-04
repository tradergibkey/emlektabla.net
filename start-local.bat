@echo off
cd /d "%~dp0"
title Emlektabla.net lokalis szerver

if not exist local-server.py (
  echo.
  echo HIBA: local-server.py nem talalhato ebben a mappaban.
  echo Valoszinuleg a zip-bol futtattad - elobb csomagold ki a teljes zip-et,
  echo majd a kicsomagolt mappaban inditsd ujra ezt a fajlt.
  echo.
  pause
  exit /b 1
)

set PY=
where python >nul 2>nul && set PY=python
if not defined PY where py >nul 2>nul && set PY=py

if not defined PY (
  echo.
  echo HIBA: Python nem talalhato a gepen.
  echo Telepitsd innen: https://www.python.org/downloads/
  echo Telepiteskor pipald be: "Add python.exe to PATH"
  echo.
  pause
  exit /b 1
)

echo Szerver indul: http://localhost:8000
echo Leallitas: Ctrl+C vagy az ablak bezarasa
start "" /min cmd /c "timeout /t 2 >nul & start http://localhost:8000"
%PY% local-server.py
pause
