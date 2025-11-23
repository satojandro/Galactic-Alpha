import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 uses webpack 5 by default - no need for future flag
  // Turbopack config to silence webpack config warning
  turbopack: {},

  webpack: (config, { isServer }) => {
    // Exclude problematic optional dependencies from WalletConnect/MetaMask
    config.resolve.alias = {
      ...config.resolve.alias,
      'why-is-node-running': false,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Ignore test files and problematic modules
    if (config.module?.rules) {
      config.module.rules.push(
        {
          test: /\.test\.(js|ts|tsx|mjs)$/,
          use: 'ignore-loader',
        },
        // Ignore problematic files from thread-stream
        {
          test: /thread-stream\/.*\.(test|spec)\.(js|ts|mjs)$/,
          use: 'ignore-loader',
        }
      );
    }

    return config;
  },
};

export default nextConfig;
