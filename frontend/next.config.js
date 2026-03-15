/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@stacks/transactions",
    "@stacks/connect",
    "@stacks/connect-react",
  ],
};

module.exports = nextConfig;
