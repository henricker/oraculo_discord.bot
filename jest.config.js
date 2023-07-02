module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  roots: ['<rootDir>/__tests__'],
  collectCoverageFrom: ['!<rootDir>/__tests__/**'],
  moduleNameMapper: {
    '@tests/(.*)': '<rootDir>/__tests__/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@usecases/(.*)': '<rootDir>/src/usecases/$1',
    '@factories/(.*)': '<rootDir>/src/factories/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
  },
}
