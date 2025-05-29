
# Testing Infrastructure

This directory contains the comprehensive testing setup for the HR-GPT application.

## Structure

```
src/test/
├── components/          # Component unit tests
├── hooks/              # Hook unit tests
├── integration/        # Integration tests
├── utils/              # Testing utilities and helpers
├── deployment/         # Build and deployment validation tests
├── security/           # Security audit tests
├── setup.ts           # Test environment setup
└── README.md          # This file
```

## Running Tests

Since package.json is read-only, you'll need to add these scripts manually:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "deploy:check": "npm run test:run && npm run build"
  }
}
```

## Test Commands

- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:run` - Run tests once and exit
- `npm run deploy:check` - Run full deployment validation

## Testing Utilities

### Test Utils (`utils/test-utils.tsx`)
Provides a custom render function with all necessary providers:
- React Query Client
- Router Provider
- Authentication Context (mocked)

### Auth Helpers (`utils/auth-helpers.ts`)
Mock users and authentication states for testing:
- `mockUser` - Standard employee user
- `mockAdminUser` - Admin user
- `mockManagerUser` - Manager user
- `createMockAuthContext` - Mock auth context factory

### Performance Helpers (`utils/performance-helpers.ts`)
Tools for performance testing:
- `measureRenderTime` - Measure component render time
- `expectFastRender` - Assert render time is under threshold
- `checkBundleSize` - Validate bundle size

## Test Categories

### Unit Tests
- Component rendering and behavior
- Hook functionality
- Utility function logic

### Integration Tests
- Authentication flows
- API interactions
- Component integration

### Deployment Tests
- Build validation
- Environment configuration
- Import/export validation

### Security Tests
- Input sanitization
- Authentication enforcement
- Sensitive data protection

## Next Steps

1. Add the test scripts to package.json manually
2. Run `npm run test` to start the test suite
3. Add more specific tests for critical application features
4. Set up CI/CD pipeline integration
5. Configure coverage thresholds

## Coverage Goals

- Unit Tests: >80% coverage
- Integration Tests: Critical user flows
- Security Tests: All authentication and input handling
- Performance Tests: Core components under threshold
