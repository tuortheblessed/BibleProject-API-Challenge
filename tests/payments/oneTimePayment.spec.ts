import { test, expect } from '@playwright/test'
import {
  START_ONE_TIME_PAYMENT_MUTATION,
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  ME_DONATION_HISTORY_QUERY,
} from '../../utils/graphqlQueries'
import { faker } from '@faker-js/faker'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_API_KEY)

test.describe('validate donation history', async () => {
  test('one time payment with minimum required variables and ', async ({
    request,
  }) => {
    const givenName = faker.person.firstName()
    const surname = faker.person.lastName()
    const email = faker.internet.email()
    const password = faker.internet.password()

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
    const clientSecret =
      startOneTimePaymentJson.data.startOneTimePayment.clientSecret
    const paymentIntentId = clientSecret.slice(0, 27)

    const paymentIntentResponse = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: 'pm_card_visa',
        return_url: faker.internet.url(),
      },
    )

    expect(
      paymentIntentResponse.status,
      "Stripe Payment Intent should be 'succeeded'",
    ).toBe('succeeded')

    // TODO: move register and login requests into utils folder for easy re-use in other tests
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
    const authToken = loginJSON.data.login.authorization.token

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
    // TODO: assert on donation history once I figure out why it is not currently populating
  })
})
