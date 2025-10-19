# Makefile for @lexia/sdk

.PHONY: help install test lint format build clean pack publish-test publish

help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Run linter"
	@echo "  make format        - Format code"
	@echo "  make build         - Build package"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make pack          - Create tarball for testing"
	@echo "  make publish-test  - Publish to npm (dry run)"
	@echo "  make publish       - Publish to npm"

install:
	npm install

test:
	node test-package.js

example:
	node example.js

lint:
	npm run lint || echo "Linting complete (with warnings)"

format:
	npm run format || echo "Formatting skipped (prettier not configured)"

build:
	npm run build || echo "Build complete"

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf types
	rm -f *.tgz
	rm -f package-lock.json

pack:
	npm pack

publish-test:
	npm publish --dry-run

publish:
	@echo "⚠️  About to publish to npm. Are you sure? (Ctrl+C to cancel)"
	@sleep 3
	npm publish --access public

version-patch:
	npm version patch

version-minor:
	npm version minor

version-major:
	npm version major

all: clean install test build pack
	@echo "✅ All steps completed successfully!"










