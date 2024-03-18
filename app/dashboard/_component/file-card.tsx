import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Doc, Id } from "@/convex/_generated/dataModel";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DownloadCloudIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  TypeIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

export interface FileCardActionProps {
  file: Doc<"files">;
  isFavorited: boolean;
}
export interface FileCardProps {
  file: Doc<"files">;
  favorites: Doc<"favorites">[];
}

function FileCardActions({ file, isFavorited }: FileCardActionProps) {
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
              <StarHalf className="w-4 h-4" />
            ) : (
              <StarIcon className="w-4 h-4" />
            )}{" "}
            Favorite
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

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process?.env?.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({ file, favorites }: FileCardProps) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  const isFavorited = favorites?.some(
    (favorite) => favorite?.fileId === file?._id
  );

  const userProfile = useQuery(api?.users?.getUserProile, {
    userId: file?.userId,
  });
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-base">
          <span className="flex justify-start items-center gap-2">
            {typeIcons[file?.type]}
            {file.name}
          </span>
          <FileCardActions isFavorited={isFavorited} file={file} />
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center items-center">
        {file?.type === "image" && (
          <div className="w-32 h-32 hover:shadow-sm hover:duration-100 hover:delay-200 hover:ease-in-out hover:transform   hover:shadow-gray-950  flex justify-center items-center">
            <Image
              alt={file?.name}
              width="200"
              height="200"
              src={getFileUrl(file?.fileId)}
            />
          </div>
        )}
        {file?.type === "csv" && (
          <div className="w-32 h-32 hover:shadow-sm hover:duration-100 hover:delay-200 hover:ease-in-out hover:transform   hover:shadow-gray-950 rounded-lg shadow-md flex justify-center items-center">
            <GanttChartIcon className="w-32 h-32" />{" "}
          </div>
        )}
        {file?.type === "pdf" && (
          <div className="w-32 h-32 hover:shadow-sm hover:duration-100 hover:delay-200 hover:ease-in-out hover:transform   hover:shadow-gray-950 rounded-lg shadow-md flex justify-center items-center">
            <FileTextIcon className="w-full h-32" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage className="w-16 h-16" src={userProfile?.image} />
          </Avatar>
          <p className="text-sm">{userProfile?.name}</p>
        </div>
        <div className="text-xs text-gray-500 flex justify-end items-start gap-2">
          <UploadIcon className="w-4 h-4" />
          {formatRelative(new Date(file?._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
