# Railguard

**Track, Analyze, and Resolve Issues with Precision**

Railguard is a comprehensive, self-hosted solution for monitoring errors, crashes, and performance in your applications. It empowers developers to proactively identify, diagnose, and resolve issues, ensuring a seamless user experience.

## Key Features

*   **Crash Reporting:** Capture detailed crash reports with stack traces to pinpoint the exact cause of failures.
*   **Error Monitoring:** Track and analyze errors in real-time, with customizable alerting to stay ahead of critical issues.
*   **Performance Insights:** Gain visibility into your application's performance, identify bottlenecks, and optimize user experience.
*   **Self-Hosted:** Maintain full control over your data and infrastructure, ensuring privacy and security.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20 or later)
*   [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/zaplytic/railguard.git
    cd railguard
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

## Development

This repository is a monorepo using Yarn Workspaces. The following scripts are available at the root level:

| Command                       | Description                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| `yarn test:[api/web/mobile]`  | Run tests for the api/web/mobile application.                  |
| `yarn dev:[api/web/mobile]`   | Start the api/web/mobile application in development mode.      |
| `yarn build:[libname]`        | Build the library called `libname` in `libs` folder.           |
| `yarn build:libs`             | Build all libraries in `libs` folder.                          |
| `yarn build`                  | Build all workspaces.                                          |
| `yarn test`                   | Run tests for all workspaces.                                  |
| `yarn lint`                   | Lint all workspaces.                                           |
| `yarn type-check`             | Run TypeScript type-checking for all workspaces.               |
| `yarn clean`                  | Remove all `node_modules`                                      |
| `yarn clean:cache`            | Remove all `node_modules`, and cache files.                    |
| `yarn clean:all`              | Remove all `node_modules`, `yarn.lock` files and cache files.  |
| `yarn reset`                  | Clean all `node_modules`, caches and reinstall dependencies.   |
| `yarn hard-reset`             | Clean everything and reinstall dependencies.                   |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. See our [Code of Conduct](CODE_OF_CONDUCT.md).
