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
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
  TypeIcon,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export interface FileCardProps {
  file: Doc<"files">;
}

function FileCardActions({ file }: FileCardProps) {
  const { toast } = useToast();
  const deleteFile = useMutation(api?.files?.deleteFile);
  const toggleFavorite = useMutation(api?.files?.toggleFavorite);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean | undefined>(
    false
  );
  const [isFavorites, setIsFavorites] = React.useState<string[] | null>(null);

  return (
    <>
      <AlertDialog onOpenChange={setIsConfirmOpen} open={isConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                //todo: actually delete the file
                try {
                  deleteFile({ fileId: file?._id });
                  toast({
                    variant: "success",
                    title: "Deleted File",
                    description: "Your file deleted successfully",
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
            <StarIcon className="w-4 h-4" /> Favorite
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className="flex gap-1 text-red-600 items-center cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process?.env?.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({ file }: FileCardProps) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{typeIcons[file?.type]}</span>
          {file.name} <FileCardActions file={file} />
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
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={() => {
            window?.open(getFileUrl(file?.fileId), "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
