.PHONY: help dev build preview clean install lint format typecheck test check check-conventions check-dependencies gauntlet docker-build docker-up docker-down

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
dev: ## start dev server
	bun run dev

build: ## production build
	bun run build

preview: ## preview production build
	bun run preview

install: ## install dependencies
	bun install

clean: ## remove dist and node_modules
	bun run clean

clean-dist: ## remove dist only
	bun run clean:dist

# Quality
lint: ## run eslint
	bun run lint

lint-fix: ## run eslint with auto-fix
	bun run lint:fix

format: ## format code with prettier
	bun run format

format-check: ## check formatting
	bun run format:check

typecheck: ## run typescript type checking
	bun run typecheck

test: ## run tests
	bun run test

test-watch: ## run tests in watch mode
	bun run test:watch

test-ui: ## run tests with vitest ui
	bun run test:ui

test-coverage: ## run tests with coverage
	bun run test:coverage

check: ## run typecheck + lint + test + convention + dependency gates
	bun run check

check-conventions: ## run convention checks
	bun run check-conventions

check-dependencies: ## verify dependencies are documented
	bun run check-dependencies

gauntlet: ## run all quality gates
	bun run gauntlet

# Docker
docker-build: ## build docker image
	docker compose build

docker-up: ## start docker containers
	docker compose up -d

docker-down: ## stop docker containers
	docker compose down

docker-logs: ## tail docker logs
	docker compose logs -f

# Generators
component: ## create a new component (usage: make component name=MyComponent)
	@mkdir -p src/components/$(name)
	@echo 'import { cn } from "@/lib/utils"\n\ninterface $(name)Props {\n  className?: string\n}\n\nexport function $(name)({ className }: $(name)Props) {\n  return (\n    <div className={cn("", className)}>\n      $(name)\n    </div>\n  )\n}' > src/components/$(name)/index.tsx
	@echo "Created src/components/$(name)/index.tsx"

route: ## create a new route (usage: make route name=dashboard)
	@echo 'import { createFileRoute } from "@tanstack/react-router"\n\nexport const Route = createFileRoute("/$(name)")({ component: $(name)Page })\n\nfunction $(name)Page() {\n  return (\n    <div>\n      <h1>$(name)</h1>\n    </div>\n  )\n}' > src/routes/$(name).tsx
	@echo "Created src/routes/$(name).tsx"

hook: ## create a new hook (usage: make hook name=use-example)
	@echo 'import { useState } from "react"\n\nexport function $(name)() {\n  const [state, setState] = useState(null)\n  return { state, setState }\n}' > src/hooks/$(name).ts
	@echo "Created src/hooks/$(name).ts"
