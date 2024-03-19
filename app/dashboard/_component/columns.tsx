"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { UploadIcon } from "lucide-react";
import { FileCardActions } from "./file-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProile, {
    userId: userId,
  });
  return (
    <div className="flex justify-start items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
      </Avatar>
      <p className="text-sm">{userProfile?.name}</p>
    </div>
  );
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row?.original.userId} />;
    },
  },
  {
    header: "Uploaded on",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-gray-500 flex justify-end items-start gap-2">
          <UploadIcon className="w-4 h-4" />
          {formatRelative(new Date(row?.original?._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions
            file={row?.original}
            isFavorited={row?.original?.isFavorited}
          />
        </div>
      );
    },
  },
];
