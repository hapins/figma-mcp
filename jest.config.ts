import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  clearMocks: true,
  collectCoverage: process.env.NODE_ENV !== 'test',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  silent: true,
};

export default config;
