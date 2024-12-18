import { test, expect } from '@playwright/test'
import {
  START_ONE_TIME_PAYMENT_MUTATION,
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  ME_DONATION_HISTORY_QUERY,
  ACCOUNT_DELETION_MUTATION,
} from '../../utils/graphqlQueries'
import { faker } from '@faker-js/faker'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_API_KEY)

test.describe('validate donation history', async () => {
  const givenName = faker.person.firstName()
  const surname = faker.person.lastName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  let authToken: string

  test('one time payment with minimum required variables and ', async ({
    request,
  }) => {
    const startOneTimePaymentResponse = await request.post('', {
      data: {
        query: START_ONE_TIME_PAYMENT_MUTATION,
        variables: {
          input: {
            languageSource: 'eng',
            amount: 100000,
            givenName: givenName,
            surname: surname,
            email: email,
          },
        },
      },
    })

    expect(
      startOneTimePaymentResponse.status(),
      'Payment should be started',
    ).toBe(200)
    const startOneTimePaymentJson = await startOneTimePaymentResponse.json()
    expect(
      startOneTimePaymentJson.errors,
      'User One Time Payment returns no errors',
    ).toBeFalsy()

    const clientSecret =
      startOneTimePaymentJson.data.startOneTimePayment.clientSecret
    const paymentIntentId = clientSecret.slice(0, 27)
    const paymentIntentResponse = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        use_stripe_sdk: true,
        payment_method: 'pm_card_visa',
        return_url: faker.internet.url(),
      },
    )

    expect(
      paymentIntentResponse.status,
      "Stripe Payment Intent should be 'succeeded'",
    ).toBe('succeeded')

    const registerResponse = await request.post('', {
      data: {
        query: REGISTER_MUTATION,
        variables: {
          input: {
            givenName: givenName,
            surname: surname,
            email: email,
            password: password,
          },
        },
      },
    })

    expect(registerResponse.status(), 'User should be registered').toBe(200)
    const registerJSON = await registerResponse.json()
    expect(
      registerJSON.errors,
      'User Registration returns no errors',
    ).toBeFalsy()

    const loginResponse = await request.post('', {
      data: {
        query: LOGIN_MUTATION,
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      },
    })

    expect(loginResponse.status(), 'User should be logged in').toBe(200)

    const loginJSON = await loginResponse.json()
    authToken = loginJSON.data.login.authorization.token
    const donationHistoryResponse = await request.post('', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        query: ME_DONATION_HISTORY_QUERY,
        variables: {},
      },
    })

    expect(
      donationHistoryResponse.status(),
      'Donation history should be returned',
    ).toBe(200)
    const donationHistoryJSON = await donationHistoryResponse.json()
    expect(
      donationHistoryJSON.errors,
      'User Donation History returns no errors',
    ).toBeFalsy()
  })

  test.afterEach('Status check', async ({ request }) => {
    const accountDeletionResponse = await request.post('', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        query: ACCOUNT_DELETION_MUTATION,
        variables: {},
      },
    })
  })
})
