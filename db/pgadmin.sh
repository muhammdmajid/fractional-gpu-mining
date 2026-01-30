#!/bin/bash
# ============================================================
# 🐘 pgAdmin 4 Standalone Installer (No Apache)
# ============================================================

set -e

# ============================================================
# ⚙️ Configuration
# ============================================================
PGADMIN_EMAIL="admin@fgpumining.site"
PGADMIN_PASSWORD="Imr@n786"
PGADMIN_PORT="5050"
PGADMIN_HOME="/opt/pgadmin4"
PGADMIN_DATA="/var/lib/pgadmin"
PGADMIN_LOG="/var/log/pgadmin"
SERVER_IP=$(curl -s ifconfig.me || echo "localhost")

# ============================================================
# 📦 Install dependencies
# ============================================================
echo "🔹 Installing dependencies..."
sudo apt update -y && sudo apt install -y python3 python3-pip python3-venv curl

# ============================================================
# 🧩 Install pgAdmin 4 (standalone mode)
# ============================================================
echo "🔹 Setting up pgAdmin 4..."
sudo mkdir -p ${PGADMIN_HOME} ${PGADMIN_DATA} ${PGADMIN_LOG}
cd ${PGADMIN_HOME}

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install pgadmin4

# ============================================================
# ⚙️ Configure pgAdmin
# ============================================================
cat > ${PGADMIN_HOME}/config_local.py <<EOF
import os
DATA_DIR = "${PGADMIN_DATA}"
LOG_FILE = "${PGADMIN_LOG}/pgadmin4.log"
SQLITE_PATH = os.path.join(DATA_DIR, "pgadmin4.db")
STORAGE_DIR = os.path.join(DATA_DIR, "storage")
SERVER_MODE = True
DEFAULT_SERVER = '0.0.0.0'
DEFAULT_SERVER_PORT = ${PGADMIN_PORT}
MASTER_PASSWORD_REQUIRED = False
CSRF_SESSION_KEY = os.urandom(24).hex()
SECRET_KEY = os.urandom(24).hex()
EOF

sudo chown -R $USER:$USER ${PGADMIN_DATA} ${PGADMIN_LOG}

# ============================================================
# 👤 Create Admin User
# ============================================================
echo "🔹 Creating pgAdmin admin user..."
PGADMIN_SETUP_EMAIL="${PGADMIN_EMAIL}"
PGADMIN_SETUP_PASSWORD="${PGADMIN_PASSWORD}"

# Initialize configuration DB and create admin user
${PGADMIN_HOME}/venv/bin/python3 -m pgadmin4.pgAdmin4 \
  --setup-email "${PGADMIN_SETUP_EMAIL}" \
  --setup-password "${PGADMIN_SETUP_PASSWORD}" \
  --data-dir "${PGADMIN_DATA}" || true

# ============================================================
# 🧱 Systemd service
# ============================================================
echo "🔹 Creating systemd service..."
sudo tee /etc/systemd/system/pgadmin.service > /dev/null <<EOF
[Unit]
Description=pgAdmin 4 Standalone Service
After=network.target

[Service]
User=${USER}
WorkingDirectory=${PGADMIN_HOME}
ExecStart=${PGADMIN_HOME}/venv/bin/python3 -m pgadmin4
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable pgadmin.service
sudo systemctl restart pgadmin.service

# ============================================================
# 🔐 Firewall
# ============================================================
sudo ufw allow ${PGADMIN_PORT}/tcp || true
sudo ufw reload || true

# ============================================================
# 🧪 Test pgAdmin
# ============================================================
sleep 5
if curl -s "http://${SERVER_IP}:${PGADMIN_PORT}" | grep -qi "pgAdmin"; then
  TEST_RESULT="✅ pgAdmin is running and reachable!"
else
  TEST_RESULT="⚠️ pgAdmin service started, check logs below."
fi

# ============================================================
# ✅ Summary
# ============================================================
echo "============================================================"
echo "✅ pgAdmin 4 Standalone Installation Complete!"
echo "🌍 URL: http://${SERVER_IP}:${PGADMIN_PORT}"
echo "👤 Email: ${PGADMIN_EMAIL}"
echo "🔑 Password: ${PGADMIN_PASSWORD}"
echo "📁 Data Dir: ${PGADMIN_DATA}"
echo "🧾 Logs: ${PGADMIN_LOG}/pgadmin4.log"
echo "------------------------------------------------------------"
echo "🧪 Status: ${TEST_RESULT}"
echo "------------------------------------------------------------"
echo "💡 To check logs: sudo journalctl -u pgadmin -f"
echo "💡 To restart:   sudo systemctl restart pgadmin"
echo "============================================================"
