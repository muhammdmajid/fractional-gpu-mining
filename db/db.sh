#!/bin/bash
# ============================================================
# 🐘 PostgreSQL Full Setup Script with Auto Connection Test
# ============================================================
# Usage: sudo bash db.sh
# ============================================================

set -e  # Exit immediately if a command exits with a non-zero status

# ============================================================
# 🔧 Configuration
# ============================================================
DB_USER="gpuuserdb"
DB_PASSWORD="Imr@n786"
DB_NAME="gpuminingdb"
DB_PORT="5432"
DB_LOCALE="en_US.UTF-8"
DB_TIMEZONE="UTC"
BACKUP_DIR="/var/backups/postgres"

SERVER_IP=$(curl -s ifconfig.me || echo "localhost")
ENCODED_PASS=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''${DB_PASSWORD}'''))")

# ============================================================
# 🧩 Install PostgreSQL
# ============================================================
echo "🔹 Updating system..."
sudo apt update -y && sudo apt upgrade -y

echo "🔹 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib curl python3

sudo systemctl enable postgresql
sudo systemctl start postgresql

# ============================================================
# 🧑‍💻 Create User & Database
# ============================================================
echo "🔹 Creating PostgreSQL user and database..."

# Create user if not exists
sudo -i -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
sudo -i -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"

# Create database if not exists
sudo -i -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
sudo -i -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER} ENCODING 'UTF8' LC_COLLATE='${DB_LOCALE}' LC_CTYPE='${DB_LOCALE}' TEMPLATE template0;"

# Set timezone and privileges
sudo -i -u postgres psql -c "ALTER ROLE ${DB_USER} SET timezone TO '${DB_TIMEZONE}';"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# ============================================================
# 🌍 Enable Remote Access
# ============================================================
echo "🔹 Enabling remote access..."
CONF_PATH=$(sudo find /etc/postgresql -name postgresql.conf | head -n 1)
CONF_DIR=$(dirname "$CONF_PATH")

sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$CONF_PATH"
sudo sed -i "s/^#port = .*/port = ${DB_PORT}/" "$CONF_PATH"

echo "host all all 0.0.0.0/0 md5" | sudo tee -a "$CONF_DIR/pg_hba.conf" > /dev/null

sudo systemctl restart postgresql

# ============================================================
# 🔐 Firewall
# ============================================================
echo "🔹 Configuring UFW firewall..."
sudo ufw allow ${DB_PORT}/tcp || true
sudo ufw reload || true

# ============================================================
# 💾 Auto Backup Setup
# ============================================================
echo "🔹 Setting up daily backups..."
sudo mkdir -p ${BACKUP_DIR}
sudo chown -R postgres:postgres ${BACKUP_DIR}

BACKUP_SCRIPT="/usr/local/bin/pg_backup.sh"
sudo tee ${BACKUP_SCRIPT} > /dev/null <<EOF
#!/bin/bash
TIMESTAMP=\$(date +"%Y%m%d_%H%M%S")
sudo -u postgres pg_dump ${DB_NAME} > ${BACKUP_DIR}/${DB_NAME}_\${TIMESTAMP}.sql
find ${BACKUP_DIR} -type f -name "*.sql" -mtime +7 -delete
EOF

sudo chmod +x ${BACKUP_SCRIPT}
(crontab -l 2>/dev/null; echo "0 2 * * * ${BACKUP_SCRIPT} >/dev/null 2>&1") | sudo crontab -

# ============================================================
# 🌐 Connection URL
# ============================================================
DATABASE_URL="postgresql://${DB_USER}:${ENCODED_PASS}@${SERVER_IP}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# ============================================================
# 🧪 Test Connection
# ============================================================
echo "🔹 Testing PostgreSQL connection..."
if PGPASSWORD="${DB_PASSWORD}" psql -h "${SERVER_IP}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT NOW();" >/dev/null 2>&1; then
  TEST_RESULT="✅ Connection successful!"
else
  TEST_RESULT="❌ Connection failed — check firewall or PostgreSQL settings."
fi

# ============================================================
# ✅ Summary
# ============================================================
echo "============================================================"
echo "✅ PostgreSQL installation and setup complete!"
echo "📦 Database Name : ${DB_NAME}"
echo "👤 Username       : ${DB_USER}"
echo "🔑 Password       : ${DB_PASSWORD}"
echo "🌐 Server IP      : ${SERVER_IP}"
echo "🕒 Timezone       : ${DB_TIMEZONE}"
echo "💾 Backup Folder  : ${BACKUP_DIR}"
echo "------------------------------------------------------------"
echo "🔗 DATABASE_URL:"
echo "DATABASE_URL=\"${DATABASE_URL}\""
echo "------------------------------------------------------------"
echo "🧪 Test Result: ${TEST_RESULT}"
echo "------------------------------------------------------------"
echo "🔹 To connect manually:"
echo "    psql -h ${SERVER_IP} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}"
echo "============================================================"
