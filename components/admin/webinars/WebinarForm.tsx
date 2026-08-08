"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/useAction";
import { createWebinar } from "@/actions/admin/webinars/create-webinar.action";
import { updateWebinar } from "@/actions/admin/webinars/update-webinar.action";

export interface WebinarFormValues {
  id?: string;
  title: string;
  description: string;
  hostName: string;
  platform: "YOUTUBE_LIVE" | "ZOOM" | "OTHER";
  joinUrl: string;
  startsAt: string; // datetime-local value
  durationMinutes: string;
  capacity: string;
}

const EMPTY: WebinarFormValues = {
  title: "",
  description: "",
  hostName: "",
  platform: "YOUTUBE_LIVE",
  joinUrl: "",
  startsAt: "",
  durationMinutes: "",
  capacity: "",
};

export function WebinarForm({
  initial,
  onSaved,
}: {
  initial?: WebinarFormValues;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<WebinarFormValues>(initial ?? EMPTY);
  const isEdit = !!initial?.id;

  const { execute: create, isLoading: isCreating } = useAction(createWebinar, {
    onSuccess: () => {
      toast.success("Webinar created.");
      setValues(EMPTY);
      onSaved?.();
    },
    onError: (error) => toast.error(error),
  });

  const { execute: update, isLoading: isUpdating } = useAction(updateWebinar, {
    onSuccess: () => {
      toast.success("Webinar updated.");
      onSaved?.();
    },
    onError: (error) => toast.error(error),
  });

  const isLoading = isCreating || isUpdating;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      hostName: values.hostName.trim() || undefined,
      platform: values.platform,
      joinUrl: values.joinUrl.trim(),
      startsAt: new Date(values.startsAt).toISOString(),
      durationMinutes: values.durationMinutes ? Number(values.durationMinutes) : undefined,
      capacity: values.capacity ? Number(values.capacity) : undefined,
    };

    if (isEdit && initial?.id) {
      update({ id: initial.id, ...payload });
    } else {
      create(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <Label htmlFor="w-title">Title</Label>
        <Input
          id="w-title"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="w-description">Description</Label>
        <Textarea
          id="w-description"
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="w-host">Host name</Label>
          <Input
            id="w-host"
            value={values.hostName}
            onChange={(e) => setValues((v) => ({ ...v, hostName: e.target.value }))}
          />
        </div>
        <div>
          <Label>Platform</Label>
          <Select
            value={values.platform}
            onValueChange={(next) => setValues((v) => ({ ...v, platform: next as WebinarFormValues["platform"] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YOUTUBE_LIVE">YouTube Live</SelectItem>
              <SelectItem value="ZOOM">Zoom</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="w-join-url">Join URL (not shown publicly until registration)</Label>
        <Input
          id="w-join-url"
          type="url"
          value={values.joinUrl}
          onChange={(e) => setValues((v) => ({ ...v, joinUrl: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="w-starts-at">Starts at</Label>
          <Input
            id="w-starts-at"
            type="datetime-local"
            value={values.startsAt}
            onChange={(e) => setValues((v) => ({ ...v, startsAt: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="w-duration">Duration (minutes)</Label>
          <Input
            id="w-duration"
            type="number"
            min={1}
            value={values.durationMinutes}
            onChange={(e) => setValues((v) => ({ ...v, durationMinutes: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="w-capacity">Capacity (display only)</Label>
          <Input
            id="w-capacity"
            type="number"
            min={1}
            value={values.capacity}
            onChange={(e) => setValues((v) => ({ ...v, capacity: e.target.value }))}
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isEdit ? "Save changes" : "Create webinar"}
      </Button>
    </form>
  );
}
