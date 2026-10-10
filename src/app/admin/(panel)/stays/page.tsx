import { StaysEditor } from "@/components/admin/CollectionEditors";
import { readContent } from "@/lib/store";

export default function StaysAdminPage() {
  return <StaysEditor content={readContent()} />;
}
