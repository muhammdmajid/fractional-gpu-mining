############################################################ 
# 🌐 Makefile — Nginx + Next.js Standalone Deployment
# ---------------------------------------------------------
# Author: Zahid Khan
# Version: 2.1
############################################################


# ==========================================================
# 🔧 VARIABLES
# ==========================================================
DOMAIN             := fgpumining.site
APP_DIR            := /var/www/gpu_mining_app
NGINX_SITE_DIR     := /etc/nginx/sites-available
NGINX_ENABLED_DIR  := /etc/nginx/sites-enabled
CONFIG_FILE        := $(NGINX_SITE_DIR)/$(DOMAIN)
LOCAL_CONF_PATH    := $(APP_DIR)/nginx/fgpumining.site.conf
DEFAULT_CONF       := /etc/nginx/sites-available/default
HEADERS_CONF_LOCAL := $(APP_DIR)/nginx/headers.conf
HEADERS_CONF_DEST  := /etc/nginx/conf.d/headers.conf

# === ANSI COLORS ===
GREEN   := \033[1;32m
RED     := \033[1;31m
YELLOW  := \033[1;33m
CYAN    := \033[1;36m
BLUE    := \033[1;34m
RESET   := \033[0m

# ==========================================================
# 🧭 HELP MENU
# ==========================================================
help:
	@echo ""
	@echo "$(CYAN)🌍 Nginx + Next.js Deployment Helper$(RESET)"
	@echo "==============================================================="
	@echo "$(YELLOW)Usage:$(RESET) make <target>"
	@echo ""
	@echo "$(YELLOW)Available Commands:$(RESET)"
	@echo "  $(GREEN)deploy-all        $(RESET)→ Full automated setup pipeline"
	@echo "  $(GREEN)install           $(RESET)→ Install and enable Nginx"
	@echo "  $(GREEN)setup-dir         $(RESET)→ Create app directory structure"
	@echo "  $(GREEN)copy-config       $(RESET)→ Deploy Nginx config file"
	@echo "  $(GREEN)test              $(RESET)→ Validate Nginx configuration"
	@echo "  $(GREEN)start             $(RESET)→ Start Nginx service"
	@echo "  $(GREEN)stop              $(RESET)→ Stop Nginx service"
	@echo "  $(GREEN)restart           $(RESET)→ Restart Nginx service"
	@echo "  $(GREEN)reload            $(RESET)→ Reload configuration live"
	@echo "  $(GREEN)restart-clean     $(RESET)→ Stop → Free Ports → Start fresh"
	@echo "  $(GREEN)free-ports        $(RESET)→ Release ports 80/443 manually"
	@echo "  $(GREEN)enable-ssl        $(RESET)→ Configure SSL with Certbot"
	@echo "  $(GREEN)test-site         $(RESET)→ Check HTTP & HTTPS responses"
	@echo "  $(GREEN)rollback-config   $(RESET)→ Restore default Nginx config"
	@echo "  $(GREEN)clean             $(RESET)→ Remove site configuration"
	@echo "==============================================================="
	@echo "$(CYAN)💡 Tip: Run 'make deploy-all' for a complete setup.$(RESET)"
	@echo ""


# ==========================================================
# 🚀 FULL DEPLOYMENT PIPELINE
# ==========================================================
# ==========================================================
# 🚀 FULL DEPLOYMENT PIPELINE
# ==========================================================
deploy-all:
	@echo "$(YELLOW)🚀 Starting full deployment for $(DOMAIN)...$(RESET)"
	@$(MAKE) setup-dir
	@$(MAKE) copy-config
	@$(MAKE) stop
	@$(MAKE) free-ports
	@$(MAKE) start
	@$(MAKE) reload
	@$(MAKE) test

	@echo "$(CYAN)🔒 Enabling SSL for $(DOMAIN)...$(RESET)"
	@$(MAKE) enable-ssl

	@echo "$(YELLOW)🌍 Verifying site accessibility...$(RESET)"
	@$(MAKE) test-site

	@echo ""
	@echo "$(GREEN)🎉 Deployment complete!$(RESET)"
	@echo "$(CYAN)➡️  Visit your site:$(RESET) https://$(DOMAIN)"
	@echo "$(CYAN)➡️  Nginx config path:$(RESET) $(CONFIG_FILE)"
	@echo "$(CYAN)➡️  App directory:$(RESET) $(APP_DIR)"
	@echo ""


# ==========================================================
# 1️⃣ INSTALL & ENABLE NGINX
# ==========================================================
install:
	@echo "$(YELLOW)📦 Installing Nginx...$(RESET)"
	@if ! command -v nginx >/dev/null 2>&1; then \
		sudo apt update -y && sudo apt install -y nginx; \
	else echo "$(GREEN)✅ Nginx already installed.$(RESET)"; fi
	@sudo systemctl enable nginx --now
	@sudo ufw allow 'Nginx Full' >/dev/null 2>&1 || true
	@sudo systemctl status nginx --no-pager | grep -E "Active|Loaded" || true


# ==========================================================
# 2️⃣ DIRECTORY SETUP
# ==========================================================
setup-dir:
	@echo "$(YELLOW)📁 Setting up application directory...$(RESET)"
	@sudo mkdir -p $(APP_DIR)
	@sudo chown -R www-data:www-data $(APP_DIR)
	@sudo chmod -R 755 $(APP_DIR)
	@echo "$(GREEN)✅ Directory structure ready.$(RESET)"


# ==========================================================
# 3️⃣ DEPLOY NGINX CONFIGURATION
# ==========================================================
copy-config:
	@echo "$(YELLOW)⚙️ Deploying Nginx configuration for $(DOMAIN)...$(RESET)"

	@echo "$(YELLOW)📋 Copying headers configuration...$(RESET)"
	@if [ ! -f "$(HEADERS_CONF_LOCAL)" ]; then \
		echo "$(RED)❌ Missing headers file: $(HEADERS_CONF_LOCAL)$(RESET)"; exit 1; \
	fi
	@sudo cp $(HEADERS_CONF_LOCAL) $(HEADERS_CONF_DEST)
	@echo "$(GREEN)✅ Headers configuration copied to $(HEADERS_CONF_DEST).$(RESET)"

	@echo "$(YELLOW)🧾 Copying site configuration...$(RESET)"
	@if [ ! -f "$(LOCAL_CONF_PATH)" ]; then \
		echo "$(RED)❌ Missing site config: $(LOCAL_CONF_PATH)$(RESET)"; exit 1; \
	fi
	@sudo cp $(LOCAL_CONF_PATH) $(CONFIG_FILE)
	@sudo ln -sf $(CONFIG_FILE) $(NGINX_ENABLED_DIR)/$(DOMAIN)
	@echo "$(GREEN)✅ Site configuration deployed.$(RESET)"

	@echo "$(CYAN)🔍 Validating Nginx configuration...$(RESET)"
	@sudo nginx -t || (echo "$(RED)❌ Nginx config test failed!$(RESET)" && exit 1)
	@echo "$(GREEN)✅ Nginx configuration is valid.$(RESET)"

# ==========================================================
# 4️⃣ VALIDATE NGINX CONFIGURATION
# ==========================================================
test:
	@echo "$(YELLOW)🧪 Validating Nginx syntax...$(RESET)"
	@if sudo nginx -t; then \
		echo "$(GREEN)✅ Configuration syntax valid.$(RESET)"; \
	else \
		echo "$(RED)❌ Syntax test failed!$(RESET)"; \
		$(MAKE) rollback-config; \
		exit 1; \
	fi


# ==========================================================
# 5️⃣ CONTROL NGINX SERVICE
# ==========================================================
start:
	@echo "$(YELLOW)▶️ Starting Nginx service...$(RESET)"
	@sudo ufw allow 80/tcp >/dev/null 2>&1 || true
	@sudo ufw allow 443/tcp >/dev/null 2>&1 || true
	@sudo ufw allow 'Nginx Full' >/dev/null 2>&1 || true
	@if systemctl is-active --quiet nginx; then \
		echo "$(GREEN)✅ Nginx already running.$(RESET)"; \
	else \
		sudo systemctl enable nginx >/dev/null 2>&1 || true; \
		if sudo systemctl start nginx >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Nginx started successfully.$(RESET)"; \
		else \
			echo "$(RED)❌ Failed to start Nginx.$(RESET)"; \
			sudo journalctl -u nginx -n 10 --no-pager; \
			exit 1; \
		fi; \
	fi
	@sleep 1
	@echo "$(BLUE)🔍 Verifying service status...$(RESET)"
	@if systemctl is-active --quiet nginx; then \
		echo "$(GREEN)✅ Active and running.$(RESET)"; \
	else \
		echo "$(RED)❌ Nginx is not running after start attempt.$(RESET)"; \
	fi


# ==========================================================
# 🛑 STOP NGINX (Safe + Clean)
# ==========================================================
stop:
	@echo "$(YELLOW)⏹️  Stopping Nginx service and freeing resources...$(RESET)"

	@echo "$(CYAN)🔧 Attempting graceful stop...$(RESET)"
	@if sudo systemctl stop nginx >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Nginx stopped successfully via systemctl.$(RESET)"; \
	else \
		echo "$(RED)⚠️ systemctl stop failed — killing processes manually.$(RESET)"; \
	fi

	@echo "$(CYAN)🔫 Terminating remaining nginx worker/master processes...$(RESET)"
	@sudo pkill -f nginx 2>/dev/null || true

	@echo "$(CYAN)🧹 Releasing occupied ports (80 & 443)...$(RESET)"
	@sudo lsof -ti :80 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@sudo lsof -ti :443 -sTCP:LISTEN | xargs -r sudo kill -9 || true

	@echo "$(CYAN)🔍 Checking for any residual Nginx listeners...$(RESET)"
	@if sudo lsof -i :80 -sTCP:LISTEN | grep -q nginx || \
		sudo lsof -i :443 -sTCP:LISTEN | grep -q nginx; then \
		echo "$(RED)⚠️ Some Nginx processes still active!$(RESET)"; \
	else \
		echo "$(GREEN)✅ All Nginx processes stopped and ports freed.$(RESET)"; \
	fi



restart:
	@echo "$(YELLOW)🔄 Restarting Nginx...$(RESET)"
	@sudo systemctl restart nginx && echo "$(GREEN)✅ Restarted successfully.$(RESET)" || echo "$(RED)❌ Restart failed.$(RESET)"


reload:
	@echo "$(YELLOW)🔁 Reloading Nginx configuration...$(RESET)"
	@sudo systemctl reload nginx && echo "$(GREEN)✅ Reloaded.$(RESET)" || echo "$(RED)❌ Reload failed.$(RESET)"


restart-clean:
	@echo "$(YELLOW)🔄 Performing clean restart...$(RESET)"
	@$(MAKE) stop
	@$(MAKE) free-ports
	@$(MAKE) start
	@echo "$(GREEN)✅ Clean restart completed.$(RESET)"


free-ports:
	@echo "$(YELLOW)🧹 Releasing ports 80 & 443...$(RESET)"
	@sudo lsof -ti :80 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@sudo lsof -ti :443 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@echo "$(GREEN)✅ Ports released.$(RESET)"


# ==========================================================
# 6️⃣ SSL CONFIGURATION (LETSENCRYPT / SELF-SIGNED)
# ==========================================================
enable-ssl:
	@echo "$(YELLOW)🔒 Configuring SSL for $(DOMAIN)...$(RESET)"
	@sudo apt install -y certbot python3-certbot-nginx
	@if sudo certbot --nginx -d $(DOMAIN) -d www.$(DOMAIN); then \
		echo "$(GREEN)✅ SSL installed successfully.$(RESET)"; \
	else \
		echo "$(RED)⚠️ Certbot failed — generating self-signed certificate.$(RESET)"; \
		sudo mkdir -p /etc/nginx/ssl; \
		sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout /etc/nginx/ssl/selfsigned.key \
			-out /etc/nginx/ssl/selfsigned.crt \
			-subj "/CN=$(DOMAIN)"; \
	fi
	@sudo certbot renew --dry-run || true


# ==========================================================
# 7️⃣ TEST LIVE SITE RESPONSE
# ==========================================================
test-site:
	@echo "$(YELLOW)🌍 Checking site availability...$(RESET)"
	@curl -s --max-time 5 http://$(DOMAIN) | grep -qi "html" && echo "$(GREEN)✅ HTTP OK$(RESET)" || echo "$(RED)❌ HTTP failed$(RESET)"
	@curl -s -k --max-time 5 https://$(DOMAIN) | grep -qi "html" && echo "$(GREEN)✅ HTTPS OK$(RESET)" || echo "$(RED)❌ HTTPS failed$(RESET)"


# ==========================================================
# 8️⃣ ROLLBACK & FULL CLEANUP
# ==========================================================
rollback-config:
	@echo "$(YELLOW)⏪ Restoring default configuration...$(RESET)"
	@if [ -f "$(DEFAULT_CONF)" ]; then \
		sudo ln -sf $(DEFAULT_CONF) $(NGINX_ENABLED_DIR)/default; \
		sudo rm -f $(CONFIG_FILE); \
		echo "$(GREEN)✅ Default configuration restored.$(RESET)"; \
	else \
		echo "$(RED)⚠️ Default config not found.$(RESET)"; \
	fi
	@sudo systemctl restart nginx || true


clean:
	@echo "$(YELLOW)🧹 Performing full cleanup for $(DOMAIN)...$(RESET)"
	@echo "$(CYAN)⏹️  Stopping Nginx service...$(RESET)"
	@sudo systemctl stop nginx >/dev/null 2>&1 || true
	@sudo pkill -f nginx >/dev/null 2>&1 || true

	@echo "$(CYAN)🧹  Releasing occupied ports (80/443)...$(RESET)"
	@sudo lsof -ti :80 -sTCP:LISTEN | xargs -r sudo kill -9 || true
	@sudo lsof -ti :443 -sTCP:LISTEN | xargs -r sudo kill -9 || true

	@echo "$(CYAN)🗑️  Removing Nginx configs and symlinks...$(RESET)"
	@sudo rm -f $(CONFIG_FILE) $(NGINX_ENABLED_DIR)/$(DOMAIN) || true
	@sudo rm -f $(NGINX_ENABLED_DIR)/default || true

	@echo "$(CYAN)🧽  Cleaning temporary Nginx cache/logs...$(RESET)"
	@sudo rm -rf /var/cache/nginx/* /var/log/nginx/* || true

	@echo "$(CYAN)🔒  Removing expired or self-signed certificates (optional)...$(RESET)"
	@sudo rm -rf /etc/letsencrypt/live/$(DOMAIN) \
		/etc/letsencrypt/archive/$(DOMAIN) \
		/etc/nginx/ssl/selfsigned.* 2>/dev/null || true

	@echo "$(CYAN)🔍  Verifying cleanup status...$(RESET)"
	@if sudo lsof -i :80 -sTCP:LISTEN | grep -q nginx || \
		sudo lsof -i :443 -sTCP:LISTEN | grep -q nginx; then \
		echo "$(RED)⚠️ Some Nginx processes still hold ports.$(RESET)"; \
	else \
		echo "$(GREEN)✅ All Nginx resources released successfully.$(RESET)"; \
	fi

	@echo "$(GREEN)🎯 Cleanup complete. System is now Nginx-free.$(RESET)"
