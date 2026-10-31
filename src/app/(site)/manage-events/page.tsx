"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventCard } from "@/components/events/event-card";
import { EventForm } from "@/components/events/event-form";
import { PrivateRoute } from "@/components/auth/private-route";
import { getMyEvents, updateEvent, deleteEvent } from "@/lib/api";
import type { MeraEvent } from "@/types";
import type { EventFormValues } from "@/lib/validations";

function ManageSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<MeraEvent[] | null>(null);
  const [editing, setEditing] = useState<MeraEvent | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reload = async () => {
    try {
      const list = await getMyEvents();
      setEvents(list);
    } catch {
      setEvents([]);
      toast.error("Could not load your events.");
    }
  };

  useEffect(() => {
    let active = true;
    getMyEvents()
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch(() => {
        if (active) {
          setEvents([]);
          toast.error("Could not load your events.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleUpdate = async (values: EventFormValues) => {
    if (!editing) return;
    setUpdating(true);
    try {
      await updateEvent(editing._id, values);
      toast.success("Event updated.");
      setEditing(null);
      await reload();
    } catch {
      toast.error("Could not update the event.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteEvent(id);
      toast.success("Event deleted.");
      await reload();
    } catch {
      toast.error("Could not delete the event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PrivateRoute>
      <section className="py-12 md:py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Manage events"
              title="Your events."
              subtitle="Edit details or remove events you created. Only you can see these."
            />
            <Button
              render={<Link href="/create-event" />}
              nativeButton={false}
              className="shrink-0 rounded-full"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create new
            </Button>
          </div>

          <div className="mt-10">
            {events === null ? (
              <ManageSkeleton />
            ) : events.length === 0 ? (
              <EmptyState
                title="You haven't created any events yet."
                description="Create your first event and it will show up here for editing."
                action={
                  <Button
                    render={<Link href="/create-event" />}
                    nativeButton={false}
                    className="rounded-full"
                  >
                    Create an event
                  </Button>
                }
              />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event._id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{event.eventType}</TableCell>
                          <TableCell className="text-muted-foreground">{event.location}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog
                                open={editing?._id === event._id}
                                onOpenChange={(open) => {
                                  if (!open) setEditing(null);
                                }}
                              >
                                <DialogTrigger
                                  render={
                                    <Button variant="outline" size="sm" className="rounded-lg" />
                                  }
                                  onClick={() => setEditing(event)}
                                >
                                  <Pencil className="size-3.5" aria-hidden="true" />
                                  Update
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Update event</DialogTitle>
                                    <DialogDescription>
                                      Edit the details below. Changes are saved immediately.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editing?._id === event._id ? (
                                    <EventForm
                                      defaultValues={{
                                        title: editing.title,
                                        description: editing.description,
                                        eventType: editing.eventType,
                                        thumbnail: editing.thumbnail,
                                        location: editing.location,
                                        eventDate: editing.eventDate,
                                      }}
                                      submitLabel="Save changes"
                                      isSubmitting={updating}
                                      onSubmit={handleUpdate}
                                    />
                                  ) : null}
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger
                                  render={<Button variant="destructive" size="sm" className="rounded-lg" />}
                                  >
                                  {deletingId === event._id ? (
                                    <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                                  ) : (
                                    <Trash2 className="size-3.5" aria-hidden="true" />
                                  )}
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      &ldquo;{event.title}&rdquo; will be removed permanently. This cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(event._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile cards */}
                <div className="grid gap-4 md:hidden">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </PrivateRoute>
  );
}
