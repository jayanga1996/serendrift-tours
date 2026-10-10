import { DestinationsEditor } from "@/components/admin/CollectionEditors";
import { readContent } from "@/lib/store";

export default function DestinationsAdminPage() {
  return <DestinationsEditor content={readContent()} />;
}
