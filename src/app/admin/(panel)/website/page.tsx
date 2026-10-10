import { WebsiteEditor } from "@/components/admin/WebsiteEditor";
import { readContent } from "@/lib/store";

export default async function WebsiteAdminPage() {
  return <WebsiteEditor initial={await readContent()} />;
}
