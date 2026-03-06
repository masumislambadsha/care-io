# Testing Guide for Care.xyz

This document provides comprehensive testing instructions for the Care.xyz platform.

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## 📋 Test Coverage

### Current Test Files

1. **Price Calculation Tests** (`src/__tests__/utils/priceCalculation.test.ts`)
   - Tests booking price calculations
   - Validates platform fee calculations
   - Tests edge cases (zero hours, decimal hours)
   - Verifies caregiver payout calculations

2. **StatusBadge Component Tests** (`src/__tests__/components/StatusBadge.test.tsx`)
   - Tests rendering of different booking statuses
   - Validates CSS class application
   - Tests all status types (PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED)

3. **BookingForm Validation Tests** (`src/__tests__/components/BookingForm.test.tsx`)
   - Tests form validation with Zod schema
   - Validates required fields
   - Tests minimum length validations
   - Tests successful form submission

## 🎯 Test Strategy

### Unit Tests

- Utility functions (price calculations, date formatting)
- Individual components (buttons, badges, cards)
- Validation schemas (Zod schemas)

### Integration Tests

- Form submissions with validation
- API route handlers
- Authentication flows

### Component Tests

- User interactions (clicks, form inputs)
- Conditional rendering
- Props validation

## 📝 Writing New Tests

### Example: Testing a Component

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    render(<MyComponent />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("Updated Text")).toBeInTheDocument();
  });
});
```

### Example: Testing a Utility Function

```typescript
import { describe, it, expect } from "@jest/globals";
import { myUtilityFunction } from "@/lib/utils";

describe("myUtilityFunction", () => {
  it("returns expected result", () => {
    const result = myUtilityFunction(input);
    expect(result).toBe(expectedOutput);
  });

  it("handles edge cases", () => {
    expect(myUtilityFunction(null)).toBe(defaultValue);
  });
});
```

## 🔍 What to Test

### Priority 1 (Critical)

- [ ] Authentication flows
- [ ] Booking creation and payment
- [ ] Price calculations
- [ ] Form validations
- [ ] Protected route access

### Priority 2 (Important)

- [ ] User profile updates
- [ ] Review submissions
- [ ] Notification system
- [ ] Search and filter functionality
- [ ] Status updates

### Priority 3 (Nice to Have)

- [ ] UI component rendering
- [ ] Animation triggers
- [ ] Theme switching
- [ ] Responsive behavior

## 🐛 Debugging Tests

### Common Issues

1. **Module not found errors**
   - Check `moduleNameMapper` in `jest.config.js`
   - Verify import paths use `@/` alias

2. **Async test failures**
   - Use `waitFor` from `@testing-library/react`
   - Ensure promises are properly awaited

3. **Mock issues**
   - Check `jest.setup.js` for global mocks
   - Use `jest.mock()` for specific modules

### Debug Mode

Run tests with Node debugger:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📊 Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🚀 CI/CD Integration

Tests should run automatically on:

- Pull requests
- Commits to main branch
- Pre-deployment

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Test Checklist

Before deploying:

- [ ] All tests pass
- [ ] Coverage meets minimum thresholds
- [ ] No console errors or warnings
- [ ] Edge cases are covered
- [ ] Integration tests pass
- [ ] Manual testing completed
