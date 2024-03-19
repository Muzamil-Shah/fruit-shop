"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import {
  FileIcon,
  Grid2X2Icon,
  GridIcon,
  Loader2,
  RowsIcon,
  Table2Icon,
  TableIcon,
} from "lucide-react";
import SearchBar from "./search-bar";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FileBrowsers({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];
  return (
    <>
      {!isLoading && (
        <div className="space-y-4">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-bold">{title}</h1>
            <div className="flex justify-end items-center gap-2">
              <SearchBar query={query} setQuery={setQuery} />
              <UploadButton />
            </div>
          </div>

          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center">
              <TabsList className="mb-4">
                <TabsTrigger className="flex items-center gap-2" value="grid">
                  <GridIcon />
                  Grid
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="table">
                  <RowsIcon />
                  Table
                </TabsTrigger>
              </TabsList>
              <div>
                <Select
                  value={type}
                  onValueChange={(newType) => {
                    setType(newType as any);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading && (
              <div className="mt-32 w-full flex flex-col justify-center items-center">
                <Loader2 className="mr-2 h-32 w-32 animate-spin" />
                <p className="text-xl font-semibold text-gray-400">
                  Loading your file...
                </p>
              </div>
            )}
            {files?.length === 0 ? (
              <div className="w-full  flex flex-col justify-center items-center space-y-2 bg-gray-100 py-16">
                <Image
                  width={600}
                  height={600}
                  src="/empty.svg"
                  alt="empty image"
                />
                <p className="font-semibold text-xl mt-2 text-gray-500">
                  You have not any file for now,you can upload{" "}
                </p>
                <UploadButton />
              </div>
            ) : (
              <>
                <TabsContent value="grid">
                  <div className="w-full  flex flex-wrap gap-3 justify-center  ">
                    {modifiedFiles?.map(
                      (file: Doc<"files"> & { isFavorited: boolean }) => {
                        return <FileCard key={file?._id} file={file} />;
                      }
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="table">
                  <DataTable columns={columns} data={modifiedFiles} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      )}
    </>
  );
}
