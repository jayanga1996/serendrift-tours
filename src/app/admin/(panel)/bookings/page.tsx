import { BookingsBoard } from "@/components/admin/BookingsBoard";
import { readBookings } from "@/lib/store";

export default async function BookingsPage() {
  return <BookingsBoard initial={await readBookings()} />;
}
