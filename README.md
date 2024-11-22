# BibleProject API Code Challenge

A test automation solution demonstrating making a payment and validating that it shows
up in the user's donation history for BibleProject's API.

## Challenge Overview

This project implements automated tests to verify the following user journey:
1. Initiate a one-time donation
2. Process payment via Stripe
3. Create a user account
4. Verify the donation appears in the user's donation history

## Technical Implementation

The solution uses:
- Playwright Test for API automation
- Stripe API for payment processing
- Faker.js for test data generation
- GraphQL for API interactions

## Test Flow

The main test case (`oneTimePayment.spec.ts`) demonstrates:

1. Starting a one-time payment:
   - Generates random user information
   - Initiates payment with the API
   - Receives Stripe client secret

2. Processing payment:
   - Confirms payment with Stripe using test card
   - Verifies successful payment status

3. User account creation:
   - Registers new user with same information used for donation
   - Verifies successful registration

4. Account verification:
   - Logs in with created credentials
   - Retrieves donation history
   - Verifies donation record

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
STRIPE_API_KEY=<your-stripe-test-key>
MONO_STAGE=<bibleproject-api-mono-stage-url>
```

## Running the Test

Execute the test suite:
```bash
npx playwright test
```

Execute the test suite by project:
```bash
npx playwright test --project=payments
```

## Project Structure

```
├── tests/
│   └── payments/
│       └── oneTimePayment.spec.ts    # Main test implementation
├── utils/
│   └── graphqlQueries.ts            # GraphQL queries
├── playwright.config.ts             # Test configuration
└── tsconfig.json                    # TypeScript configuration
```

## GraphQL Operations

The solution implements the following GraphQL operations:
- `startOneTimePayment`: Initiates donation process
- `register`: Creates user account
- `login`: Authenticates user
- `me`: Retrieves user profile with donation history

## Next Steps

Areas for potential enhancement:
- Add after hook to clean up created test data
- Move functions such as register and login to reusable locations for new tests
- Add schema validations for endpoints
- Add support for multiple environments
- Add error case scenarios
- Extract common operations to utility functions
- Add more comprehensive test cases
- Add CICD
