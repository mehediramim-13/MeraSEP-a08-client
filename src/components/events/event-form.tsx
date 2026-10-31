"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, ImageIcon, LoaderCircle } from "lucide-react";
import { useWatch, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES } from "@/types";
import { eventSchema, type EventFormValues } from "@/lib/validations";
import { calendarDateToIso, toCalendarDate } from "@/lib/format";

export interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function EventForm({ defaultValues, onSubmit, submitLabel, isSubmitting }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      eventType: defaultValues?.eventType ?? "Cleanup",
      thumbnail: defaultValues?.thumbnail ?? "",
      location: defaultValues?.location ?? "",
      eventDate: defaultValues?.eventDate ?? "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const thumbnailValue = useWatch({ control, name: "thumbnail" });
  const eventDateValue = useWatch({ control, name: "eventDate" });

  const thumbnailPreview = thumbnailValue?.trim() ?? "";

  const selectedDate = toCalendarDate(eventDateValue);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setValue("eventDate", calendarDateToIso(date), { shouldValidate: true, shouldDirty: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please fix the highlighted fields.");
      })}
      className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"
      noValidate
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="event-title">Title</Label>
          <Input
            id="event-title"
            placeholder="Winter Clothes Distribution — Mirpur 10"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.title.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="event-description">Description</Label>
          <Textarea
            id="event-description"
            rows={5}
            placeholder="What will volunteers do? Who will benefit? What should they bring?"
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          {errors.description ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="event-type">Event type</Label>
            <Select
              defaultValue={defaultValues?.eventType ?? "Cleanup"}
              onValueChange={(value) =>
                setValue("eventType", value as EventFormValues["eventType"], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="event-type" aria-invalid={!!errors.eventType}>
                <SelectValue placeholder="Choose a type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType ? (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.eventType.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              placeholder="Mirpur 10 Roundabout, Dhaka"
              aria-invalid={!!errors.location}
              {...register("location")}
            />
            {errors.location ? (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.location.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Event date</Label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start rounded-xl font-normal"
                />
              }
            >
              <CalendarIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              {selectedDate ? (
                <span className="font-medium">
                  {format(selectedDate, "EEEE, d MMMM yyyy")} · 10:00 AM
                </span>
              ) : (
                <span className="text-muted-foreground">Pick a future date</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" {...register("eventDate")} />
          {errors.eventDate ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.eventDate.message}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Past dates are disabled. Events start at 10:00 AM by default.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="event-thumbnail">Thumbnail URL</Label>
          <Input
            id="event-thumbnail"
            placeholder="https://images.unsplash.com/..."
            aria-invalid={!!errors.thumbnail}
            {...register("thumbnail")}
          />
          {errors.thumbnail ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.thumbnail.message}
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
          <div className="aspect-[16/10] w-full">
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/logo/merasep-logo.svg";
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="size-8" aria-hidden="true" />
                <span className="text-xs">Thumbnail preview</span>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl font-semibold shadow-lg shadow-primary/15"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
