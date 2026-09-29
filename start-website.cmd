@echo off
setlocal
REM ============================================================
REM  Auto-Start Website "Pijat Nusantara" (localStorage MVP)
REM  Menyalakan server Vite otomatis lalu membuka browser.
REM ------------------------------------------------------------
set "PROJECT=C:\Users\komin\Documents\Default Project\pijat-traditional"
set "URL=http://localhost:5173"
set "OUTLOG=%PROJECT%\dev_autostart.out.log"
set "ERRLOG=%PROJECT%\dev_autostart.err.log"

REM --- Perbarui PATH agar Node.js (winget) dikenali di sesi login --
for /f "usebackq tokens=*" %%p in (`powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable('Path','Machine')+';'+[Environment]::GetEnvironmentVariable('Path','User')"`) do set "MERGED=%%p"
set "PATH=%MERGED%"

REM --- Cek apakah server sudah berjalan di port 5173 -------------
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%URL%' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {} ; exit 1"
if errorlevel 1 goto START_SERVER
goto OPEN_BROWSER

:START_SERVER
REM Barbagi proses server di latar (window kecil "PijatNusantara Dev")
echo Memulai server website...
powershell -NoProfile -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm.cmd run dev' -WorkingDirectory '%PROJECT%' -WindowStyle Minimized -RedirectStandardOutput '%OUTLOG%' -RedirectStandardError '%ERRLOG%'"

:OPEN_BROWSER
REM --- Tunggu server siap (maks 60 detik) lalu buka browser -------
powershell -NoProfile -Command "$u='%URL%'; for ($i=0; $i -lt 60; $i++) { try { $r = Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 2; if ($r.StatusCode -eq 200) { Start-Process $u; exit 0 } } catch {} ; Start-Sleep -Seconds 1 } ; exit 1"
endlocal