import { BookingsBoard } from "@/components/admin/BookingsBoard";
import { readBookings } from "@/lib/store";

export default function BookingsPage() {
  return <BookingsBoard initial={readBookings()} />;
}
