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

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Ignore onnxruntime-web/webgpu — it's a dynamic runtime-only import
    // Tell webpack to treat it as an empty module at build time
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-web/webgpu': false,
    }

    return config;
  },
}

export default nextConfig
