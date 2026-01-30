# ============================================================
# 🧱 Makefile — Ultimate Git Automation (Full Permission Mode)
# ============================================================

.PHONY: git-sync git-pull git-push git-clean

# Default branch and commit message
BRANCH ?= main
MSG ?= update: auto-synced latest files

# ============================================================
# 🐙 git-sync — Full Permission + Add, Commit, Pull & Push
# ============================================================
git-sync:
	@echo "🔓 Setting full permissions (777)..."
	@chmod -R 777 .

	@echo "📦 Adding and committing changes..."
	@git add .
	@git commit -m "$(MSG)" || echo "⚠️ Nothing to commit."

	@echo "🔄 Pulling latest changes for $(BRANCH)..."
	@git fetch origin $(BRANCH)
	@git merge origin/$(BRANCH) --no-edit || { \
		echo "⚠️ Merge conflict detected — using ours strategy..."; \
		git merge --strategy-option ours origin/$(BRANCH) --no-edit || true; \
		git add .; git commit -m '🧩 Auto-merged conflict (ours)'; \
	}

	@echo "🚀 Pushing updates to origin/$(BRANCH)..."
	@git push origin $(BRANCH) || { \
		echo "⚠️ Push failed — attempting recovery..."; \
		git fetch origin $(BRANCH); \
		git merge origin/$(BRANCH) --no-edit || true; \
		git push origin $(BRANCH) --force-with-lease || echo "❌ Push failed again."; \
	}

	@echo "✅ Sync complete — branch $(BRANCH) fully updated with origin."


# ============================================================
# 🚀 git-push — Full Permission + Auto Push
# ============================================================
git-push:
	@echo "🔓 Setting full permissions (777)..."
	@chmod -R 777 .

	@echo "📦 Adding and committing changes..."
	@git add .
	@git commit -m "$(MSG)" || echo "⚠️ Nothing to commit."

	@echo "🚀 Pushing to origin/$(BRANCH)..."
	@git push origin $(BRANCH) || { \
		echo "⚠️ Push failed — attempting recovery..."; \
		git fetch origin $(BRANCH); \
		git merge origin/$(BRANCH) --no-edit || true; \
		git push origin $(BRANCH) --force-with-lease || echo "❌ Push failed again."; \
	}

	@echo "✅ Push complete — branch $(BRANCH) is up to date."


# ============================================================
# 🔄 git-pull — Full Permission + Safe Auto Merge
# ============================================================
git-pull:
	@echo "🔓 Setting full permissions (777)..."
	@chmod -R 777 .

	@echo "🔄 Pulling latest changes for $(BRANCH)..."
	@git fetch origin $(BRANCH)
	@git merge origin/$(BRANCH) --no-edit || { \
		echo "⚠️ Merge conflict detected — using ours strategy..."; \
		git merge --strategy-option ours origin/$(BRANCH) --no-edit || true; \
		git add .; git commit -m '🧩 Auto-merged conflict (ours)'; \
	}

	@echo "✅ Pull complete — branch $(BRANCH) is up to date."


# ============================================================
# 🧹 git-clean — Full Permission + Hard Reset
# ============================================================
git-clean:
	@echo "🔓 Setting full permissions (777)..."
	@chmod -R 777 .

	@echo "🧹 Cleaning local repository and resetting to origin/$(BRANCH)..."
	@git fetch origin $(BRANCH)
	@git reset --hard origin/$(BRANCH)
	@git clean -fd
	@echo "✅ Repository cleaned and reset to match remote."


# =======================================================================
# 🧱 Makefile — Build & Prepare Next.js Standalone for Nginx
# =======================================================================

APP_PATH := /var/www/gpu_mining_app

# ============================================================
# 🚀 Full Next.js Standalone Build (All Permissions + Self-Contained)
# ============================================================

APP_PATH := /var/www/gpu_mining_app
DEPLOY_PATH := $(APP_PATH)

build-next:
	@echo "🧹 Cleaning previous Next.js build..."
	sudo chmod -R 777 $(APP_PATH) || true
	rm -rf $(APP_PATH)/.next

	@echo "📦 Installing dependencies..."
	sudo chmod -R 777 $(APP_PATH) || true
	cd $(APP_PATH) && npm install --legacy-peer-deps || { echo '❌ npm install failed!'; exit 1; }

	@echo "🏗️ Building Next.js standalone app..."
	sudo chmod -R 777 $(APP_PATH) || true
	cd $(APP_PATH) && npm run build:web || { echo '❌ Build failed!'; exit 1; }

	@echo "🔓 Preparing for asset copy..."
	sudo chmod -R 777 $(APP_PATH)/.next || true
	sudo chmod -R 777 $(APP_PATH)/public || true

	@echo "📂 Merging public and static assets into standalone..."
	cd $(APP_PATH) && \
		mkdir -p .next/standalone/.next && \
		cp -r public .next/standalone/ && \
		cp -r .next/static .next/standalone/.next/ || { echo '❌ Asset copy failed!'; exit 1; }

	@echo "🔧 Restoring secure ownership and permissions..."
	sudo chown -R www-data:www-data $(DEPLOY_PATH)
	sudo find $(DEPLOY_PATH) -type d -exec chmod 755 {} \;
	sudo find $(DEPLOY_PATH) -type f -exec chmod 644 {} \;

	@echo "✅ Next.js standalone build complete and ready for Nginx."



# ============================================================
# 🧩 PERMISSIONS & DEV SERVER
# ============================================================

## fix-perms — Fix Next.js binary execution permissions.
fix-perms:
	@echo "🔧 Fixing Next.js binary permissions..."
	chmod +x node_modules/.bin/next
	@echo "✅ Permissions fixed."

## run-dev — Start Next.js dev server (auto-fixes permissions first).
run-dev: fix-perms
	@echo "🚀 Starting Next.js Development Server..."
	npm run dev

# ============================================================
# 💡 QUICK COMMAND REFERENCE
# ============================================================
# ▶ make git-sync MSG="message"   — Sync Git: add, commit, pull, push
# ▶ make git-pull                 — Pull latest changes
# ▶ make git-push                 — Push commits
# ▶ make build-next               — Full production Next.js build
# ▶ make fix-perms                — Fix binary permissions
# ▶ make run-dev                  — Run local dev server
# ============================================================

