import { DestinationsEditor } from "@/components/admin/CollectionEditors";
import { readContent } from "@/lib/store";

export default async function DestinationsAdminPage() {
  return <DestinationsEditor content={await readContent()} />;
}
