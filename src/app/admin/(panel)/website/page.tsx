import { WebsiteEditor } from "@/components/admin/WebsiteEditor";
import { readContent } from "@/lib/store";

export default function WebsiteAdminPage() {
  return <WebsiteEditor initial={readContent()} />;
}
