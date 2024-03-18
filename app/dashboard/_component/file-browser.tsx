"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { FileIcon, Loader2 } from "lucide-react";
import SearchBar from "./search-bar";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FileBrowsers({
  title,
  favoritesOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly } : "skip"
  );
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );
  const isLoading = files === undefined;
  return (
    <>
      {isLoading && (
        <div className="mt-32 w-full flex flex-col justify-center items-center">
          <Loader2 className="mr-2 h-32 w-32 animate-spin" />
          <p className="text-xl font-semibold text-gray-400">
            Loading your images...
          </p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-bold">{title}</h1>
            <div className="flex justify-end items-center gap-2">
              <SearchBar query={query} setQuery={setQuery} />
              <UploadButton />
            </div>
          </div>
          {files?.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center space-y-2 mt-24">
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
          )}
          <div className="w-full p-2 flex flex-wrap gap-3 justify-center  mt-10 ">
            {files?.map((file) => {
              return (
                <FileCard
                  favorites={favorites ?? []}
                  key={file?._id}
                  file={file}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
