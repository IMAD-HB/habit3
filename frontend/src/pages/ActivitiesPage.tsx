import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import ActivitiesEmptyState from "../components/activities/ActivitiesEmptyState";
import ActivitiesError from "../components/activities/ActivitiesError";
import ActivitiesHeader from "../components/activities/ActivitiesHeader";
import ActivitiesSkeleton from "../components/activities/ActivitiesSkeleton";
import ActivityCard from "../components/activities/ActivityCard";
import ActivityFilters from "../components/activities/ActivityFilters";
import ActivityForm from "../components/activities/ActivityForm";
import NoRolesNotice from "../components/activities/NoRolesNotice";

import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "../services/activityService";
import { getRoles } from "../services/roleService";

import type { Activity, CreateActivityData } from "../types/activity";

const ActivitiesPage = () => {
  const queryClient = useQueryClient();

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities", selectedRoleId],
    queryFn: () => getActivities(selectedRoleId || undefined),
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingActivity(null);
  };

  const createMutation = useMutation({
    mutationFn: createActivity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      resetForm();

      toast.success("Activity created successfully.");
    },

    onError: () => {
      toast.error("Unable to create activity.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateActivityData }) =>
      updateActivity(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      resetForm();

      toast.success("Activity updated successfully.");
    },

    onError: () => {
      toast.error("Unable to update activity.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      setActivityToDelete(null);

      toast.success("Activity deleted successfully.");
    },

    onError: () => {
      toast.error("Unable to delete activity.");
    },
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateActivity(id, { completed }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      toast.success(
        variables.completed
          ? "Activity marked as completed."
          : "Activity marked as incomplete.",
      );
    },

    onError: () => {
      toast.error("Unable to update activity.");
    },
  });

  const startCreate = () => {
    setEditingActivity(null);
    setIsCreating(true);
  };

  const startEdit = (activity: Activity) => {
    setIsCreating(false);
    setEditingActivity(activity);
  };

  const handleSubmit = (data: CreateActivityData) => {
    if (editingActivity) {
      updateMutation.mutate({
        id: editingActivity._id,
        data,
      });

      return;
    }

    createMutation.mutate(data);
  };

  const handleDelete = (activity: Activity) => {
    setActivityToDelete(activity);
  };

  const confirmDelete = () => {
    if (!activityToDelete) {
      return;
    }

    deleteMutation.mutate(activityToDelete._id);
  };

  const handleToggleComplete = (activity: Activity, completed: boolean) => {
    toggleCompletionMutation.mutate({
      id: activity._id,
      completed,
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const roles = rolesQuery.data?.data.roles ?? [];
  const activities = activitiesQuery.data?.data.activities ?? [];

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <ActivitiesHeader
          isCreating={isCreating}
          isEditing={Boolean(editingActivity)}
          hasRoles={roles.length > 0}
          onCreate={startCreate}
        />

        {roles.length === 0 && !rolesQuery.isLoading && <NoRolesNotice />}

        {(isCreating || editingActivity) && (
          <ActivityForm
            key={editingActivity?._id ?? "create"}
            editingActivity={editingActivity}
            roles={roles}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        <ActivityFilters
          roles={roles}
          selectedRoleId={selectedRoleId}
          onRoleChange={setSelectedRoleId}
        />

        {activitiesQuery.isLoading && <ActivitiesSkeleton />}

        {activitiesQuery.isError && <ActivitiesError />}

        {!activitiesQuery.isLoading &&
          !activitiesQuery.isError &&
          activities.length === 0 && <ActivitiesEmptyState />}

        {!activitiesQuery.isLoading &&
          !activitiesQuery.isError &&
          activities.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  onToggleComplete={handleToggleComplete}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
      </main>

      {activityToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-activity-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2
                id="delete-activity-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete activity?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-900">
                  "{activityToDelete.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActivityToDelete(null)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete activity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivitiesPage;
