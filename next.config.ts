const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dpavjxpr6/image/upload/**", 
      },
    ],
  },
};

module.exports = nextConfig;
