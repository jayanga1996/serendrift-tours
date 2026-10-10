import { StaysEditor } from "@/components/admin/CollectionEditors";
import { readContent } from "@/lib/store";

export default async function StaysAdminPage() {
  return <StaysEditor content={await readContent()} />;
}
