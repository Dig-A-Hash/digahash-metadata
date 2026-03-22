import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 45_000,
    expect: {
        timeout: 10_000
    },
    reporter: 'list',
    use: {
        headless: true,
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'vanilla',
            testMatch: /demo-vanilla\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:4173'
            }
        },
        {
            name: 'angular',
            testMatch: /demo-angular\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:4200'
            }
        },
        {
            name: 'react',
            testMatch: /demo-react\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:4175'
            }
        },
        {
            name: 'vue',
            testMatch: /demo-vue\.spec\.ts/,
            use: {
                baseURL: 'http://127.0.0.1:4174'
            }
        }
    ],
    webServer: [
        {
            command: 'pnpm --filter demo-vanilla dev',
            url: 'http://127.0.0.1:4173',
            timeout: 180_000,
            reuseExistingServer: true
        },
        {
            command: 'pnpm --filter demo-angular exec ng serve --host 127.0.0.1 --no-hmr',
            url: 'http://127.0.0.1:4200',
            timeout: 180_000,
            reuseExistingServer: true
        },
        {
            command: 'pnpm --filter demo-react dev',
            url: 'http://127.0.0.1:4175',
            timeout: 180_000,
            reuseExistingServer: true
        },
        {
            command: 'pnpm --filter demo-vue dev',
            url: 'http://127.0.0.1:4174',
            timeout: 180_000,
            reuseExistingServer: true
        }
    ]
});
