# Nous Local Tunnel Setup

Current local deployment:

- Public hostname: `https://nous.questory.dpdns.org`
- Local origin: `http://127.0.0.1:3000`
- Tunnel: existing Cloudflare Tunnel `2b9bd7e4-c7cb-4227-bc66-99f9f108ef65`
- Tunnel config: `C:\Users\dlrsh\.cloudflared\config.yml`
- Startup script: `start-nous-local.ps1`
- Startup task: `Nous Local Web + Cloudflare Tunnel`

The scheduled task starts the local production server and Cloudflare Tunnel when the Windows user logs in. The computer must remain powered on and connected to the internet for the public site to remain available.

The Windows system-service installation was not used because it requires administrator permissions. The per-user scheduled task is sufficient for the current personal/small-class setup.
