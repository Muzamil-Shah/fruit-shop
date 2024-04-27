"use client";
import { api } from "@/convex/_generated/api";
import { Protect, useOrganization, useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";

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
  WifiOff,
} from "lucide-react";
import SearchBar from "./search-bar";
import { useEffect, useRef, useState } from "react";
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
import CartButton from "./cart-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import useOnlineStatus from "@/customHooks/useOnlineStatus";

export function ProductBrowser({
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
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState<string>("all");
  const [sortPrice, setSortPrice] = useState<"lowest" | "highest" | "all">(
    "all"
  );
  const isOnline = useOnlineStatus();
  const me = useQuery(api.users.getMe);

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

  const products = useQuery(
    api.products.getProducts,
    orgId
      ? {
          orgId,
          status,
          query,
          favorites: favoritesOnly,
        }
      : "skip"
  );

  const {
    results,
    status: Status,
    loadMore,
  } = usePaginatedQuery(
    api?.products?.getProductsWithPagination,
    orgId
      ? {
          filter: {
            query: query,
            orgId: orgId,
            status: status,
            sort: sort,
            sortPrice: sortPrice === "all" ? undefined : sortPrice,
            favorites: favoritesOnly,
            category: category === "all" ? undefined : category,
          },
        }
      : "skip",
    { initialNumItems: 2 }
  );
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );
  const isLoading = Status === "LoadingFirstPage";

  const modifiedFiles =
    products?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  console.log({ results });

  const sentinelRef = useRef(null);

  // Intersection Observer callback function
  const intersectionCallback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        loadMore(1);
      }
    });
  };

  useEffect(() => {
    // Create Intersection Observer instance
    const observer = new IntersectionObserver(intersectionCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger callback when 10% of sentinel is visible
    });

    if (sentinelRef.current) {
      // Observe the sentinel element
      observer.observe(sentinelRef.current);
    }

    return () => {
      // Clean up observer
      observer.disconnect();
    };
  }, [sentinelRef, loadMore]);

  return (
    <>
      <div className="w-full overflow-hidden space-y-2">
        <div className=" w-full flex justify-between items-center px-2">
          <h1 className="text-base  md:text-2xl lg:text-3xl xl:text-4xl font-bold">
            {title}
          </h1>
          <div className="flex justify-end items-center gap-2">
            <SearchBar query={query} setQuery={setQuery} />

            {/* <CartButton /> */}
          </div>
        </div>

        <Tabs defaultValue="grid">
          <div className="flex flex-col justify-start items-start gap-2 mb-2 px-2">
            <div className="w-full flex justify-between items-center">
              <Protect
                condition={(check) => {
                  return (
                    check({
                      role: "org:admin",
                    }) || me?.role === "admin"
                  );
                }}
                fallback={<></>}
              >
                <TabsList className="">
                  <TabsTrigger className="flex items-center gap-2" value="grid">
                    <GridIcon />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="table"
                  >
                    <RowsIcon />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Protect>
              <Protect
                condition={(check) => {
                  return (
                    check({
                      role: "org:admin",
                    }) || me?.role === "admin"
                  );
                }}
                fallback={<></>}
              >
                <UploadButton action="create" />
              </Protect>
            </div>
            <div className="w-full flex  justify-between items-center gap-2 ">
              <Select
                // value={type}
                onValueChange={(newType) => {
                  setCategory(newType as any);
                }}
                defaultValue="all"
              >
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {products?.map((product, i) => (
                    <SelectItem key={i} value={product.category}>
                      {product.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end items-center gap-2">
                <Select
                  // value={type}
                  onValueChange={(newType) => {
                    setSortPrice(newType as any);
                  }}
                  defaultValue="all"
                >
                  <SelectTrigger className="md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="lowest">Lowest-to-highest</SelectItem>
                    <SelectItem value="highest">Highest-to-lowest</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  // value={type}
                  onValueChange={(newType) => {
                    setSort(newType as any);
                  }}
                  defaultValue="desc"
                >
                  <SelectTrigger className="md:w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">A-Z</SelectItem>
                    <SelectItem value="desc">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* <ScrollArea className=" h-[600px] md:h-[800px] pb-10"> */}
          {isOnline ? (
            <>
              {isLoading && (
                <div className="flex flex-wrap gap-2  justify-center items-center p-4">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-[320px]" />
                    <Skeleton className="h-[200px] w-[320px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-[320px]" />
                    <Skeleton className="h-[200px] w-[320px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-[320px]" />
                    <Skeleton className="h-[200px] w-[320px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-10 w-[320px]" />
                    <Skeleton className="h-[200px] w-[320px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-[200px]" />
                    </div>
                  </div>
                </div>
              )}
              {!isLoading && results?.length < 1 ? (
                <div className="w-full  flex flex-col justify-center items-center space-y-2 bg-gray-100 dark:bg-gray-900 py-16">
                  <Image
                    width={600}
                    height={600}
                    src="/empty.svg"
                    alt="empty image"
                  />
                  <Protect
                    condition={(check) => {
                      return (
                        check({
                          role: "org:admin",
                        }) || me?.role === "admin"
                      );
                    }}
                    fallback={<></>}
                  >
                    <p className=" text-sm md:text-xl mt-2 text-gray-500">
                      You have not any file for now,you can upload{" "}
                    </p>
                    <UploadButton action="create" />
                  </Protect>
                  <Protect
                    condition={(check) => {
                      return (
                        check({
                          role: "org:member",
                        }) || me?.role === "member"
                      );
                    }}
                    fallback={<></>}
                  >
                    <p className=" text-sm md:text-xl mt-2 text-zinc-500">
                      No Data
                    </p>
                  </Protect>
                </div>
              ) : (
                <>
                  <TabsContent value="grid">
                    <div className="w-full  flex flex-wrap gap-3 justify-center p-4 ">
                      {results?.map((product) => {
                        return (
                          <FileCard key={product?._id} product={product} />
                        );
                      })}
                    </div>
                    {Status === "LoadingMore" && (
                      <div className="flex flex-col space-y-3">
                        <Skeleton className="h-10 w-[300px]" />
                        <Skeleton className="h-[125px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-10 w-[200px]" />
                        </div>
                      </div>
                    )}
                    <div ref={sentinelRef} style={{ height: "10px" }}></div>
                  </TabsContent>
                  <TabsContent value="table">
                    <DataTable columns={columns} data={modifiedFiles} />
                  </TabsContent>
                </>
              )}
            </>
          ) : (
            <div className="mt-32 w-full flex flex-col justify-center items-center">
              <WifiOff className="mr-2 h-16 w-16" />
              <p className="text-xl font-semibold text-gray-400">
                It seem your offline, please check your internet connections!
              </p>
            </div>
          )}
          {/* </ScrollArea> */}
        </Tabs>
      </div>
    </>
  );
}
