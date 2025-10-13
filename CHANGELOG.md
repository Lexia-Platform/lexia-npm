# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-01-14

### Added
- Error logging to Lexia backend via `/api/internal/v1/logs` endpoint
- Enhanced `sendError()` method with optional `trace` and `exception` parameters for detailed error logging
- Automatic extraction and truncation of stack traces for error logs
- Support for error level, location tracking, and additional metadata in error logs

### Fixed
- Fixed Centrifugo client to send actual error message instead of hardcoded text
- Fixed dev mode error streaming to match normal response flow (delta + complete)
- Improved error message visibility in both dev and production modes

## [1.0.1] - 2024-10-13

### Fixed
- Minor bug fixes and improvements

## [1.0.0] - 2024-10-12

### Added
- Initial release of @lexia/sdk npm package (first version)
- LexiaHandler for unified Lexia platform communication
- ChatMessage and ChatResponse models
- Variables helper class for easy variable access
- MemoryHelper class for user memory handling
- APIClient for HTTP communication
- CentrifugoClient for real-time messaging
- DevStreamClient for local development streaming
- Express integration with createLexiaApp and addStandardEndpoints
- Support for dev mode and production mode
- Dynamic Centrifugo configuration
- Header forwarding support
- Comprehensive documentation and examples

### Features
- Real-time streaming via Centrifugo
- In-memory streaming for development
- Backend API communication
- Response formatting
- Error handling
- Optional Express framework integration
- TypeScript definitions (coming soon)

## [Unreleased]

### Planned
- TypeScript full migration
- WebSocket support
- Enhanced error handling
- Performance optimizations
- Additional helper utilities

