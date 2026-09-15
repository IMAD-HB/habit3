import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import RoleCard from "../components/roles/RoleCard";
import RoleForm from "../components/roles/RoleForm";
import RolesEmptyState from "../components/roles/RolesEmptyState";
import RolesError from "../components/roles/RolesError";
import RolesHeader from "../components/roles/RolesHeader";
import RolesSkeleton from "../components/roles/RolesSkeleton";

import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../services/roleService";

import type { CreateRoleData, Role } from "../types/role";

const RolesPage = () => {
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingRole(null);
  };

  const createMutation = useMutation({
    mutationFn: createRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      resetForm();

      toast.success("Role created successfully.");
    },

    onError: () => {
      toast.error("Unable to create role.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateRoleData }) =>
      updateRole(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      resetForm();

      toast.success("Role updated successfully.");
    },

    onError: () => {
      toast.error("Unable to update role.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      setRoleToDelete(null);

      toast.success("Role deleted successfully.");
    },

    onError: () => {
      toast.error("Unable to delete role.");
    },
  });

  const startCreate = () => {
    setEditingRole(null);
    setIsCreating(true);
  };

  const startEdit = (role: Role) => {
    setIsCreating(false);
    setEditingRole(role);
  };

  const handleSubmit = (data: CreateRoleData) => {
    if (editingRole) {
      updateMutation.mutate({
        id: editingRole._id,
        data,
      });

      return;
    }

    createMutation.mutate(data);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
  };

  const confirmDelete = () => {
    if (!roleToDelete) {
      return;
    }

    deleteMutation.mutate(roleToDelete._id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const roles = rolesQuery.data?.data.roles ?? [];

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <RolesHeader
          isCreating={isCreating}
          isEditing={Boolean(editingRole)}
          onCreate={startCreate}
        />

        {(isCreating || editingRole) && (
          <RoleForm
            key={editingRole?._id ?? "create"}
            editingRole={editingRole}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {rolesQuery.isLoading && <RolesSkeleton />}

        {rolesQuery.isError && <RolesError />}

        {!rolesQuery.isLoading && !rolesQuery.isError && roles.length === 0 && (
          <RolesEmptyState onCreate={startCreate} />
        )}

        {!rolesQuery.isLoading && !rolesQuery.isError && roles.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <RoleCard
                key={role._id}
                role={role}
                onEdit={startEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>

      {roleToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-role-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2
                id="delete-role-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete role?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-900">
                  "{roleToDelete.name}"
                </span>
                ? Activities belonging to this role may be affected.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
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
                {deleteMutation.isPending ? "Deleting..." : "Delete role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RolesPage;
