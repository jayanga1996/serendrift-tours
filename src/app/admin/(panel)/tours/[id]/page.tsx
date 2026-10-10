import { TourEditor } from "@/components/admin/TourEditor";
import { readContent } from "@/lib/store";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TourEditor content={await readContent()} tourId={id === "new" ? "" : id} />;
}
