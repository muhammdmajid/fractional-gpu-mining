############################################################
# 🧱 Makefile — PostgreSQL + pgAdmin Automation
# ----------------------------------------------------------
# Usage:
#   make install-pg         → Install PostgreSQL
#   make install-pgadmin    → Install pgAdmin
#   make update-all         → Update both PostgreSQL & pgAdmin
#   make restart-all        → Restart both services
#   make test-db            → Test PostgreSQL connection
#   make clean              → Remove everything
############################################################

SHELL := /bin/bash

# ==========================================================
# ⚙️ CONFIGURATION
# ==========================================================
DB_USER = gpuuserdb
DB_PASS = Imr@n786
DB_NAME = gpuminingdb
DB_PORT = 5432
PGADMIN_PORT = 5050

SERVER_IP := $(shell curl -s ifconfig.me || echo "localhost")
ENCODED_PASS := $(shell python3 -c "import urllib.parse; print(urllib.parse.quote('$(DB_PASS)'))")

DATABASE_URL = postgresql://$(DB_USER):$(ENCODED_PASS)@$(SERVER_IP):$(DB_PORT)/$(DB_NAME)?sslmode=disable

# ==========================================================
# 📦 INSTALL TARGETS
# ==========================================================
install-pg:
	@echo "🚀 Installing PostgreSQL via db.sh..."
	@chmod +x db.sh
	@sudo ./db.sh
	@echo "✅ PostgreSQL installation completed!"
	@echo "🔗 DATABASE_URL: $(DATABASE_URL)"

install-pgadmin:
	@echo "🚀 Installing pgAdmin via pgadmin.sh..."
	@chmod +x pgadmin.sh
	@sudo ./pgadmin.sh
	@echo "✅ pgAdmin installation completed!"
	@echo "🌍 Access: http://$(SERVER_IP):$(PGADMIN_PORT)"

setup-all: install-pg install-pgadmin
	@echo "✅ Full setup completed (PostgreSQL + pgAdmin)!"

# ==========================================================
# 🔄 UPDATE TARGETS
# ==========================================================
update-pg:
	@echo "🔄 Updating PostgreSQL packages..."
	@sudo apt update -y
	@sudo apt install -y postgresql postgresql-contrib
	@sudo systemctl restart postgresql
	@sudo systemctl status postgresql --no-pager
	@echo "✅ PostgreSQL update complete!"

update-pgadmin:
	@echo "🔄 Updating pgAdmin (via pip)..."
	@if [ -d "/opt/pgadmin4" ]; then \
		cd /opt/pgadmin4 && source venv/bin/activate && pip install --upgrade pgadmin4; \
		sudo systemctl restart pgadmin; \
		sudo systemctl status pgadmin --no-pager; \
	else \
		echo "⚠️ pgAdmin not found at /opt/pgadmin4. Try: make install-pgadmin"; \
	fi
	@echo "✅ pgAdmin update complete!"

update-all: update-pg update-pgadmin
	@echo "✅ All updates applied successfully!"

# ==========================================================
# 🔁 RESTART TARGETS
# ==========================================================
restart-pg:
	@echo "🔁 Restarting PostgreSQL..."
	@sudo systemctl restart postgresql
	@sudo systemctl status postgresql --no-pager
	@echo "✅ PostgreSQL restarted successfully!"

restart-pgadmin:
	@echo "🔁 Restarting pgAdmin..."
	@sudo systemctl restart pgadmin || echo "⚠️ pgAdmin service not found."
	@sudo systemctl status pgadmin --no-pager || true
	@echo "✅ pgAdmin restart attempted!"

restart-all: restart-pg restart-pgadmin
	@echo "✅ Both PostgreSQL and pgAdmin restarted successfully!"

# ==========================================================
# 🧪 TEST TARGETS
# ==========================================================
test-db:
	@echo "🧪 Testing PostgreSQL connection..."
	@if PGPASSWORD="$(DB_PASS)" psql -h "$(SERVER_IP)" -U "$(DB_USER)" -d "$(DB_NAME)" -p "$(DB_PORT)" -c "SELECT version();" >/dev/null 2>&1; then \
		echo "✅ Connection successful!"; \
		echo "🔗 URL: $(DATABASE_URL)"; \
	else \
		echo "❌ Connection failed. Check credentials or firewall."; \
	fi

test-pgadmin:
	@echo "🧪 Testing pgAdmin web service..."
	@STATUS_CODE=$$(curl -s -o /tmp/pgadmin_test.html -w "%{http_code}" http://$(SERVER_IP):$(PGADMIN_PORT)); \
	if [ "$$STATUS_CODE" -eq 200 ] || [ "$$STATUS_CODE" -eq 302 ] || grep -qi "pgadmin" /tmp/pgadmin_test.html; then \
		echo "✅ pgAdmin is running and reachable at: http://$(SERVER_IP):$(PGADMIN_PORT)"; \
	else \
		echo "❌ pgAdmin not responding (HTTP $$STATUS_CODE)."; \
		echo "⚠️ Try checking service logs:"; \
		echo "   sudo journalctl -u pgadmin -n 20 --no-pager"; \
	fi; \
	rm -f /tmp/pgadmin_test.html



test-all: test-db test-pgadmin
	@echo "✅ All tests completed!"

# ==========================================================
# 🧹 CLEANUP
# ==========================================================
clean:
	@echo "🧹 Removing PostgreSQL and pgAdmin..."
	@sudo systemctl stop pgadmin postgresql || true
	@sudo systemctl disable pgadmin postgresql || true
	@sudo apt purge -y postgresql postgresql-contrib || true
	@sudo apt autoremove -y
	@sudo rm -rf /var/lib/postgresql /etc/postgresql /opt/pgadmin4 /var/lib/pgadmin /var/log/pgadmin /etc/systemd/system/pgadmin.service || true
	@sudo systemctl daemon-reload
	@echo "✅ Cleanup completed."

# ==========================================================
# 🧭 HELP
# ==========================================================
help:
	@echo "============================================================"
	@echo "🧭 PostgreSQL + pgAdmin Makefile Commands"
	@echo "------------------------------------------------------------"
	@echo "🔹 make install-pg         → Install PostgreSQL via db.sh"
	@echo "🔹 make install-pgadmin    → Install pgAdmin via pgadmin.sh"
	@echo "🔹 make setup-all          → Install both PostgreSQL + pgAdmin"
	@echo "------------------------------------------------------------"
	@echo "🔹 make update-pg          → Update PostgreSQL"
	@echo "🔹 make update-pgadmin     → Update pgAdmin"
	@echo "🔹 make update-all         → Update both"
	@echo "------------------------------------------------------------"
	@echo "🔹 make restart-pg         → Restart PostgreSQL"
	@echo "🔹 make restart-pgadmin    → Restart pgAdmin"
	@echo "🔹 make restart-all        → Restart both services"
	@echo "------------------------------------------------------------"
	@echo "🔹 make test-db            → Test PostgreSQL connection"
	@echo "🔹 make test-pgadmin       → Test pgAdmin web status"
	@echo "🔹 make test-all           → Test both"
	@echo "------------------------------------------------------------"
	@echo "🔹 make clean              → Uninstall all components"
	@echo "------------------------------------------------------------"
	@echo "📡 Server IP: $(SERVER_IP)"
	@echo "🔗 DATABASE_URL: $(DATABASE_URL)"
	@echo "============================================================"
