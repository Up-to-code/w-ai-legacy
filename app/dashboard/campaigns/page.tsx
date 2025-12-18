import { getCampaigns } from "@/app/actions/campaigns";
import { CampaignFilters } from "./components/campaign-filters";
import { CampaignListView } from "./components/campaign-list-view";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { CampaignStatus } from "@/types/campaign";

export default async function CampaignsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const { search, status, page } = await searchParams;

  const result = await getCampaigns({
    search: search || "",
    status: (status as CampaignStatus) || undefined,
    page: page ? parseInt(page) : 1,
    limit: 50,
  });

  const campaigns = result.success ? result.data || [] : [];

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">الحملات التسويقية</h1>
          <p className="text-gray-500">إدارة وإرسال حملات الواتساب لعملائك.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> حملة جديدة
        </Link>
      </div>

      <CampaignFilters />

      <CampaignListView
        campaigns={campaigns}
        searchQuery={search}
        statusFilter={status}
      />
    </>
  );
}
