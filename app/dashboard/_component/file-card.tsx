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
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
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
import { FileCardActions } from "./file-actions";

export interface FileCardActionProps {
  file: Doc<"files">;
  isFavorited: boolean;
}
export interface FileCardProps {
  file: Doc<"files"> & { isFavorited: boolean };
}

export function getFileUrl(fileId: Id<"_storage">): string {
  return `${process?.env?.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

export function FileCard({ file }: FileCardProps) {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

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
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center items-center">
        {file?.type === "image" && (
          <div className="w-32 h-32   flex justify-center items-center">
            <Image
              alt={file?.name}
              width="200"
              height="200"
              src={getFileUrl(file?.fileId)}
            />
          </div>
        )}
        {file?.type === "csv" && (
          <div className="w-32 h-32  flex justify-center items-center">
            <GanttChartIcon className="w-32 h-32" />{" "}
          </div>
        )}
        {file?.type === "pdf" && (
          <div className="w-32 h-32 flex justify-center items-center">
            <FileTextIcon className="w-full h-32" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex justify-start items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userProfile?.image} />
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
