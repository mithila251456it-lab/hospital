@echo off
echo ===================================================
echo Starting HospitaLink B2B Prototype...
echo Serving at: http://localhost:8080
echo ===================================================
start "" "http://localhost:8080"
python -m http.server 8080
pause
