interface User {
  id: string;
  email: string;
}

const seedUser: User[] = [
  { id: 'seed-user1', email: 'test1@test.com' },
  { id: 'seed-user2', email: 'test2@test.com' },
  { id: 'seed-user3', email: 'test3@test.com' },
  { id: 'seed-user4', email: 'test4@test.com' },
  { id: 'seed-user5', email: 'test5@test.com' }
];

const balance = [100, 200, 1000, 2000, 500];

export const seedData = [
  {
    user: seedUser[0],
    type: 'Wallet',
    balance: balance[0],
    accounDetails: {
      fullName: 'John Doe',
      streetAddress: '123 street',
      address2: null,
      city: 'dallas',
      state: 'tx',
      postCode: '75252'
    },
    test: true
  },
  {
    user: seedUser[1],
    type: 'Wallet',
    balance: balance[1],
    accounDetails: {
      fullName: 'John Doe',
      streetAddress: '123 street',
      address2: null,
      city: 'dallas',
      state: 'tx',
      postCode: '75252'
    },
    test: true
  },
  {
    user: seedUser[2],
    type: 'Wallet',
    balance: balance[2],
    accounDetails: {
      fullName: 'John Doe',
      streetAddress: '123 street',
      address2: null,
      city: 'dallas',
      state: 'tx',
      postCode: '75252'
    },
    test: true
  },
  {
    user: seedUser[3],
    type: 'Wallet',
    balance: balance[3],
    accounDetails: {
      fullName: 'John Doe',
      streetAddress: '123 street',
      address2: null,
      city: 'dallas',
      state: 'tx',
      postCode: '75252'
    },
    test: true
  },
  {
    user: seedUser[4],
    type: 'Wallet',
    balance: balance[4],
    accounDetails: {
      fullName: 'John Doe',
      streetAddress: '123 street',
      address2: null,
      city: 'dallas',
      state: 'tx',
      postCode: '75252'
    },
    test: true
  }
];
