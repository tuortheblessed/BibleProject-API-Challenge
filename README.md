# BibleProject API Code Challenge

A test automation solution demonstrating making a payment and validating that it shows
up in the user's donation history for BibleProject's API.

## Challenge Overview

This project implements automated tests to verify the following user journey:
1. Initiate a one-time donation
2. Process payment via Stripe
3. Create a user account
4. Verify the donation appears in the user's donation history

## Further Test Strategy
### Include a brief summary (a few bullet points is fine) of how you’d automate these tests or if you would automate them at all.
#### a. For example, if you had access to Stripe and Salesforce would you write a test that runs through this whole workflow?

It depends on the type of testing we are targeting. If we are looking to have a suite of tests where we hit each endpoint, I would not be including this kind of test flow.
We would have cases where each endpoint is hit and ensuring the contracts for each endpoint remains the same, that proper errors are returned, that edge cases are handled, etc.

If we were doing more of an integration test where we are making sure the flow of calls between multiple systems work as expected, that suite would be less thorough on each endpoint's specific details, but making sure that contracts are being honered and act in the expected ways.
For example, unless I was specifically testing the Stripe integration, I would not usually be making those calls out to a third party, instead they would get mocked and we may need to make some development changes to accomodate that kind of thing in lower environments.

### Next Steps

Areas for potential enhancement:
- Add after hook to clean up created test data
- Extract common operations to utility functions
- Add schema validations for endpoints
- Add support for multiple environments
- Add error case scenarios
- Add CICD
- Add more comprehensive test cases

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
