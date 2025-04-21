/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint 检查不会导致构建失败
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
