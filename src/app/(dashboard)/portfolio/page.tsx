"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/lib/user-store";
import PortfolioSlugPage from "./[slug]/page";

export default function MyPortfolioPage() {
  const { user } = useAuth();
  const slug = user?.studentProfile?.portfolioUrl || user?.id || "me";

  return <PortfolioSlugPage params={Promise.resolve({ slug })} />;
}
