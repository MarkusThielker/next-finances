/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push(
            '@node-rs/argon2',
            '@node-rs/bcrypt',
        );
        return config;
    },
    output: 'standalone',
    env: {
        appVersion: process.env.npm_package_version,
    },
};

export default nextConfig;
