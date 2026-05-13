import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "biogardensheki.az" },
      { protocol: "https", hostname: "azerbaijan.travel" },
      { protocol: "https", hostname: "meysariwines.az" },
      { protocol: "https", hostname: "dynamic-media-cdn.tripadvisor.com" },
      { protocol: "https", hostname: "cdn.touryup.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "lookaside.instagram.com" },
      { protocol: "https", hostname: "scontent.fgyd4-2.fna.fbcdn.net" },
      { protocol: "https", hostname: "scontent.fgyd21-1.fna.fbcdn.net" },
      { protocol: "https", hostname: "*.fna.fbcdn.net" },
    ],
  },
};

export default nextConfig;
