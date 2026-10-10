"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/types";

export async function saveContent(content: SiteContent) {
  const response = await fetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "The changes could not be saved.");
  }
}

export function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {textarea ? (
        <textarea className="field min-h-28" value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    setUploading(false);
    if (!response.ok || !data?.url) {
      setError(data?.error || "Upload failed.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      {value ? <img src={value} alt="" className="h-36 w-full rounded-2xl object-cover" /> : null}
      <input className="field" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image address" />
      <label className="btn btn-ghost cursor-pointer">
        {uploading ? "Uploading…" : "Upload a new image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>
      {error ? <p className="text-coral">{error}</p> : null}
    </div>
  );
}

export function SaveBar({
  saving,
  message,
  onSave,
}: {
  saving: boolean;
  message: string;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-full bg-deep px-4 py-3 text-foam shadow-xl">
      <button className="btn btn-gold" type="button" onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </button>
      {message ? <p className="text-sm text-foam/80">{message}</p> : null}
    </div>
  );
}
