import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "jovial-caribou-138.convex.cloud"
            }
        ]
    }
};

export default nextConfig;
 