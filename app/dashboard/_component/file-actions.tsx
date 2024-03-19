import * as React from "react";

import { Doc } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DownloadCloudIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  Undo2Icon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";

import { getFileUrl } from "./file-card";

export interface FileCardActionProps {
  file: Doc<"files">;
  isFavorited: boolean;
}
export interface FileCardProps {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}

export function FileCardActions({ file, isFavorited }: FileCardActionProps) {
  const { toast } = useToast();
  const deleteFile = useMutation(api?.files?.deleteFile);
  const restoreFile = useMutation(api?.files?.restoreFile);
  const toggleFavorite = useMutation(api?.files?.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean | undefined>(
    false
  );

  return (
    <>
      <AlertDialog onOpenChange={setIsConfirmOpen} open={isConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodecly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                //todo: actually delete the file
                try {
                  await deleteFile({ fileId: file?._id });
                  toast({
                    variant: "success",
                    title: "File marked for deletion",
                    description: "Your file sended to trash successfully",
                  });
                } catch (err) {
                  toast({
                    variant: "destructive",
                    title: "File Deleting Faild",
                    description: "You cant delete the file try again later!",
                  });
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => toggleFavorite({ fileId: file?._id })}
            className="flex gap-1 text-yellow-600 items-center cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-2">
                <StarIcon className="w-4 h-4" /> Unfavorite
              </div>
            ) : (
              <div className="flex gap-2">
                <StarHalf className="w-4 h-4" /> Favorite
              </div>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window?.open(getFileUrl(file?.fileId), "_blank");
            }}
            className="flex gap-1 text-yellow-600 items-center cursor-pointer"
          >
            <DownloadCloudIcon className="w-4 h-4" />
            Download
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuItem
              onClick={() => {
                if (file?.shouldDelete) {
                  restoreFile({ fileId: file?._id });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className={`flex gap-1 ${
                file?.shouldDelete ? "text-green-600" : "text-red-600"
              } items-center cursor-pointer`}
            >
              {file?.shouldDelete ? (
                <div className="flex gap-2">
                  <Undo2Icon className="w-4 h-4" /> Restore{" "}
                </div>
              ) : (
                <div className="flex gap-2">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
