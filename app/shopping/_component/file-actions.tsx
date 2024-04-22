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
  Edit2Icon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  Undo2Icon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect, useOrganization, useUser } from "@clerk/nextjs";
import UploadButton from "./upload-button";

export interface FileCardActionProps {
  product: Doc<"products">;
  isFavorited: boolean;
}
export interface FileCardProps {
  product: Doc<"products">;
  favorites: Doc<"favorites">[];
}

export function FileCardActions({ product, isFavorited }: FileCardActionProps) {
  const { toast } = useToast();
  const deleteProduct = useMutation(api?.products?.deleteProduct);
  const restoreFile = useMutation(api?.files?.restoreFile);
  const toggleFavorite = useMutation(api?.products?.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean | undefined>(
    false
  );
  const me = useQuery(api.users.getMe);
  const user = useUser();
  const organization = useOrganization();

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

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
                  await deleteProduct({
                    fileId: product?._id,
                    fileStorageId: product.fileStorageId,
                  });
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
            onClick={() =>
              toggleFavorite({ fileId: product?._id, orgId: orgId ?? "" })
            }
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
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || product?.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            {/* <DropdownMenuItem className="flex gap-1 text-green-600 items-center cursor-pointer"> */}
            <UploadButton action={"edit"} productId={product?._id} />
            {/* </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                // if (product?.shouldDelete) {
                //   restoreFile({ fileId: product?._id });
                // } else {
                setIsConfirmOpen(true);
                // }
              }}
              className={`flex gap-1  text-red-600
               items-center cursor-pointer`}
            >
              <div className="flex gap-2">
                <TrashIcon className="w-4 h-4" /> Delete
              </div>
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
