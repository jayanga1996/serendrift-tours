import { whatsappLink } from "@/lib/format";

export function WhatsAppButton({ phone }: { phone: string }) {
  return (
    <a
      href={whatsappLink(phone, "Hello Serendrift, I would like to plan a Sri Lanka journey.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-36 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#1f8a4c] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 md:bottom-6 md:right-6"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-xs">W</span>
      Message us
    </a>
  );
}
