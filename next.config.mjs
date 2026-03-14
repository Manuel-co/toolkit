/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Turbopack config (top-level in Next.js 16)
  turbopack: {
    resolveAlias: {
      fs: { browser: false },
      path: { browser: false },
      crypto: { browser: false },
    },
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.ico$/,
      type: 'asset/resource',
    });

    // Fallbacks for @imgly/background-removal on client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
}

export default nextConfig
