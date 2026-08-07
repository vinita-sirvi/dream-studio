"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export type MeasurementProfile = {
  _id: string;
  label?: string;
  profileName?: string;
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
  sleeve?: string;
  armhole?: string;
  length?: string;
  notes?: string;
};

/** The measurements recorded per profile, in the order a tailor takes them. */
const FIELDS = [
  { key: "height", label: "Height" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve length" },
  { key: "armhole", label: "Armhole" },
  { key: "length", label: "Garment length" },
] as const;

type FormState = Record<string, string>;

const EMPTY: FormState = {
  label: "",
  profileName: "",
  height: "",
  bust: "",
  waist: "",
  hip: "",
  shoulder: "",
  sleeve: "",
  armhole: "",
  length: "",
  notes: "",
};

/**
 * Measurement profiles.
 *
 * Made-to-measure is the core of this business, and these were the one thing a
 * customer could not record for themselves: the `Measurement` model existed with
 * only an admin route attached. Values stay strings rather than numbers because
 * tailors record them in mixed units and fractions ("38½", "5'4\"") and rounding
 * them into numbers would lose that.
 */
export function MeasurementManager({
  profiles,
}: {
  profiles: MeasurementProfile[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(profiles.length === 0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(profile: MeasurementProfile) {
    setEditingId(profile._id);
    setForm({
      label: profile.label ?? "",
      profileName: profile.profileName ?? "",
      height: profile.height ?? "",
      bust: profile.bust ?? "",
      waist: profile.waist ?? "",
      hip: profile.hip ?? "",
      shoulder: profile.shoulder ?? "",
      sleeve: profile.sleeve ?? "",
      armhole: profile.armhole ?? "",
      length: profile.length ?? "",
      notes: profile.notes ?? "",
    });
    setOpen(true);
    setStatus("idle");
    setFeedback("");
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
    setStatus("idle");
    setFeedback("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    // Blank measurements are omitted rather than sent as "" — a partial profile is
    // normal, and an empty string would read as a recorded value of nothing.
    const payload: Record<string, string> = {
      label: form.label || form.profileName,
      profileName: form.profileName || form.label,
    };
    for (const field of FIELDS) {
      if (form[field.key]?.trim()) payload[field.key] = form[field.key].trim();
    }
    if (form.notes?.trim()) payload.notes = form.notes.trim();

    try {
      const response = await fetch(
        editingId ? `/api/measurements/${editingId}` : "/api/measurements",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(body?.message ?? "Could not save that profile.");
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    }
  }

  async function remove(profile: MeasurementProfile) {
    setBusyId(profile._id);

    try {
      const response = await fetch(`/api/measurements/${profile._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setStatus("error");
        setFeedback("Could not remove that profile.");
        return;
      }
      if (editingId === profile._id) reset();
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-10 grid gap-8">
      {profiles.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {profiles.map((profile) => {
            const recorded = FIELDS.filter(
              (field) => profile[field.key as keyof MeasurementProfile],
            );

            return (
              <li
                key={profile._id}
                className={cn(
                  "rounded-card border border-line bg-surface p-5 transition-opacity",
                  busyId === profile._id && "opacity-60",
                )}
              >
                <p className="font-display text-lg text-ink">
                  {profile.label || profile.profileName || "Profile"}
                </p>

                {recorded.length ? (
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {recorded.map((field) => (
                      <div key={field.key} className="flex justify-between gap-2">
                        <dt className="text-ink-soft">{field.label}</dt>
                        <dd className="text-ink">
                          {profile[field.key as keyof MeasurementProfile] as string}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm text-ink-soft">
                    No measurements recorded yet.
                  </p>
                )}

                {profile.notes ? (
                  <p className="mt-4 text-xs leading-6 text-ink-soft">
                    {profile.notes}
                  </p>
                ) : null}

                <div className="mt-5 flex gap-4 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => startEdit(profile)}
                    className="text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-brass-ink"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(profile)}
                    disabled={busyId === profile._id}
                    className="text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-danger disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {open ? (
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-card border border-line bg-surface p-6 md:p-7"
        >
          <h2 className="font-display text-lg text-ink">
            {editingId ? "Edit profile" : "Add a profile"}
          </h2>

          <Field
            label="Profile name"
            htmlFor="measurement-name"
            hint="Whose measurements these are — your own, or someone you order for."
            required
          >
            <Input
              id="measurement-name"
              value={form.profileName}
              onChange={(event) => update("profileName", event.target.value)}
              required
              minLength={2}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FIELDS.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                htmlFor={`measurement-${field.key}`}
              >
                <Input
                  id={`measurement-${field.key}`}
                  value={form[field.key] ?? ""}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder="in / cm"
                />
              </Field>
            ))}
          </div>

          <Field
            label="Notes"
            htmlFor="measurement-notes"
            hint="Anything a tailor should know — posture, preferred ease, past alterations."
          >
            <Textarea
              id="measurement-notes"
              rows={3}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading"
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Save profile"}
              <Icon name="check" className="h-4 w-4" />
            </Button>

            {profiles.length ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            ) : null}

            <FormStatus
              status={status === "error" ? "error" : status === "loading" ? "loading" : "idle"}
              message={feedback}
            />
          </div>
        </form>
      ) : (
        <div>
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Add another profile
          </Button>
        </div>
      )}
    </div>
  );
}
