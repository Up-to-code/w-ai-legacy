import { getTags } from "@/app/actions/tags";
import { getTemplates } from "@/app/actions/templates";
import { getContactCount } from "@/app/actions/contacts";
import { CampaignForm } from "../components/campaign-form";

export default async function NewCampaignPage() {
    const [tagsResult, templatesResult, countResult] = await Promise.all([
        getTags(),
        getTemplates(),
        getContactCount()
    ]);

    const tags = tagsResult.success ? tagsResult.data || [] : [];
    const templates = templatesResult.success ? templatesResult.data || [] : [];
    const initialContactCount = countResult.success ? countResult.count || 0 : 0;

    return (
        <CampaignForm
            tags={tags}
            templates={templates}
            initialContactCount={initialContactCount}
        />
    );
}
