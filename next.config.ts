import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify는 Next.js를 완전 지원하므로 정적 export 불필요
  images: {
    domains: [], // 외부 이미지 도메인이 있다면 여기에 추가
  },
};

export default nextConfig;
