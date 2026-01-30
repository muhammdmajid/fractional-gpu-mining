############################################################
# ⚙️ Makefile — PM2 + Next.js Standalone App Management
# ----------------------------------------------------------
# Usage:
#   make help        → Show all available commands
#   make setup       → Install PM2 globally & configure startup
#   make start       → Start Next.js standalone app
#   make stop        → Stop the app
#   make restart     → Restart app after updates
#   make status      → Show PM2 process status
#   make logs        → View live app logs
#   make startup     → Auto-start app on reboot
#   make test-site   → Test site availability (HTTP 200 check)
#   make clean       → Remove PM2 process
############################################################

# === Variables ===
APP_NAME       := gpu_mining_app
APP_DIR        := /var/www/gpu_mining_app
NODE_ENV       := production
USER           := www-data
PORT           := 3000
HOSTNAME       := 0.0.0.0
DOMAIN         := http://localhost:3000
SERVER_FILE    := $(APP_DIR)/.next/standalone/server.js

GREEN  := \033[1;32m
RED    := \033[1;31m
YELLOW := \033[1;33m
CYAN   := \033[1;36m
RESET  := \033[0m

############################################################
# 🆘 Help — Display all available commands
############################################################
help:
	@echo ""
	@echo "$(CYAN)📘 Available Make Commands$(RESET)"
	@echo "---------------------------------------------"
	@echo "$(YELLOW)setup        $(RESET)- Install PM2 globally and verify"
	@echo "$(YELLOW)start        $(RESET)- Start Next.js standalone app"
	@echo "$(YELLOW)stop         $(RESET)- Stop PM2 process"
	@echo "$(YELLOW)restart      $(RESET)- Restart the app via PM2"
	@echo "$(YELLOW)status       $(RESET)- Show PM2 process list"
	@echo "$(YELLOW)logs         $(RESET)- View live logs (Ctrl+C to exit)"
	@echo "$(YELLOW)startup      $(RESET)- Enable PM2 startup at boot"
	@echo "$(YELLOW)test-site    $(RESET)- Check if production site is online"
	@echo "$(YELLOW)clean        $(RESET)- Remove PM2 process and save"
	@echo ""
	@echo "$(CYAN)💡 Example:$(RESET) make restart"
	@echo ""

############################################################
# 1️⃣ Install & Setup PM2
############################################################
setup:
	@echo "$(YELLOW)⚙️ Installing PM2 globally...$(RESET)"
	@sudo npm install -g pm2
	@pm2 -v || { echo "$(RED)❌ PM2 installation failed!$(RESET)"; exit 1; }
	@echo "$(GREEN)✅ PM2 installed successfully.$(RESET)"

############################################################
# 2️⃣ Start the Next.js Standalone App
############################################################
start:
	@echo "$(YELLOW)🚀 Starting $(APP_NAME) via PM2 (standalone)...$(RESET)"
	cd $(APP_DIR) && \
	sudo chmod -R 755 $(APP_DIR) && \
	sudo chmod -R 777 .next && \
	pm2 start node --name "$(APP_NAME)" -- \
	$(SERVER_FILE) \
	--env $(NODE_ENV) \
	HOSTNAME=$(HOSTNAME) \
	PORT=$(PORT)
	@pm2 save
	@echo "$(GREEN)✅ App $(APP_NAME) started on $(HOSTNAME):$(PORT)!$(RESET)"

############################################################
# 3️⃣ Stop & Restart Commands
############################################################
stop:
	@echo "$(YELLOW)🛑 Stopping $(APP_NAME)...$(RESET)"
	@pm2 stop $(APP_NAME) || echo "$(RED)⚠️ App not running.$(RESET)"

restart:
	@echo "$(YELLOW)🔁 Restarting $(APP_NAME)...$(RESET)"
	@pm2 restart $(APP_NAME) || $(MAKE) start
	@pm2 save
	@echo "$(GREEN)✅ Restarted successfully.$(RESET)"

############################################################
# 4️⃣ Status & Logs
############################################################
status:
	@echo "$(YELLOW)📊 PM2 Process List$(RESET)"
	@pm2 list

logs:
	@echo "$(YELLOW)🪵 Viewing logs for $(APP_NAME)... (Ctrl+C to exit)$(RESET)"
	@pm2 logs $(APP_NAME)

############################################################
# 5️⃣ Enable Auto-start on Boot
############################################################
startup:
	@echo "$(YELLOW)🔄 Enabling PM2 startup service...$(RESET)"
	@sudo pm2 startup systemd -u $(USER) --hp /home/$(USER)
	@pm2 save
	@sudo systemctl enable pm2-$(USER)
	@sudo systemctl start pm2-$(USER)
	@echo "$(GREEN)✅ PM2 auto-start enabled.$(RESET)"

############################################################
# 6️⃣ Test Site Availability
############################################################
test-site:
	@echo "$(YELLOW)🌐 Testing site availability at $(DOMAIN)...$(RESET)"
	@if curl -s -o /dev/null -w "%{http_code}" $(DOMAIN) | grep -q "200"; then \
		echo "$(GREEN)✅ Site is UP and responding correctly.$(RESET)"; \
	else \
		echo "$(RED)❌ Site is DOWN or not returning 200 OK.$(RESET)"; \
	fi

############################################################
# 7️⃣ Clean PM2 Process
############################################################
clean:
	@echo "$(YELLOW)🧹 Removing $(APP_NAME) from PM2...$(RESET)"
	@pm2 delete $(APP_NAME) || true
	@pm2 save
	@echo "$(GREEN)✅ PM2 process cleaned.$(RESET)"
