export const START_ONE_TIME_PAYMENT_MUTATION = `
  mutation StartOneTimePayment($input: OneTimePaymentInput!) {
    startOneTimePayment(input: $input) {
      clientSecret
    }
  }`;

export const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      authorization {
        token
      }
    }
  }`;

export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      authorization {
        token
      }
    }
  }`;

export const ME_DONATION_HISTORY_QUERY = `
  query Me {
    me {
      donationHistory {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          cursor
          node {
            amount
            closeDate
            currency
            feedbackComment
            frequency
            id
            last4
            paymentMethod
            paymentTransactionStatus
            type
          }
        }
      }
      totalDonationAmount
      email
      publicUserId
      subscriptions {
        amount
        frequency
        currency
      }
    }
  }`;
