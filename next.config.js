/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  // Other Next.js configuration ...
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ],
    unoptimized: true,
  },
  reactStrictMode: false,
});
// const nextConfig = {

//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "**"
//             }
//         ],
//         unoptimized: true,
//     },
//     reactStrictMode: false,
// }

// module.exports = nextConfig
