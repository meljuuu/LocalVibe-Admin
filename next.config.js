/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
        ],
        domains: ['res.cloudinary.com'], // Add Cloudinary domain here
    },
};

module.exports = nextConfig;
