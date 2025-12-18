import { getCampaign } from "@/app/actions/campaigns";
import { getTags } from "@/app/actions/tags";
import { getTemplates } from "@/app/actions/templates";
import { getContactCount } from "@/app/actions/contacts";
import { CampaignForm } from "../../components/campaign-form";
import { redirect } from "next/navigation";

export default async function EditCampaignPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const [campaignResult, tagsResult, templatesResult, countResult] = await Promise.all([
        getCampaign(id),
        getTags(),
        getTemplates(),
        getContactCount()
    ]);

    if (!campaignResult.success || !campaignResult.data) {
        redirect("/dashboard/campaigns");
    }

    const campaign = campaignResult.data;

    // Prevent editing active/completed campaigns
    if (campaign.status !== "draft" && campaign.status !== "scheduled") {
        redirect(`/dashboard/campaigns/${id}`);
    }

    const tags = tagsResult.success ? tagsResult.data || [] : [];
    const templates = templatesResult.success ? templatesResult.data || [] : [];
    const initialContactCount = countResult.success ? countResult.count || 0 : 0;

    return (
        <CampaignForm
            initialData={campaign}
            tags={tags}
            templates={templates}
            initialContactCount={initialContactCount}
        />
    );
}
