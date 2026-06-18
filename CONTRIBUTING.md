# Contributing

Thank you for your interest in contributing to `@krizad/thai-financial-holiday`!

## Development Setup

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and add your `BOT_API_AUTH` key (only needed for the sync script)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package with tsup (CJS + ESM + dts) |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run sync` | Sync holiday data from BOT API |

## Making Changes

1. Create a feature branch from `main`
2. Make your changes and add/update tests
3. Ensure `npm run build` and `npm test` pass
4. Open a pull request

## Reporting Issues

Please use [GitHub Issues](https://github.com/KriZad/thai-financial-holiday/issues) to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.