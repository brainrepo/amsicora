/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  fakeTimers: {
    enableGlobally: true,
    now: new Date('2022-01-01T00:00:00.000Z').getTime(),
  },
}
