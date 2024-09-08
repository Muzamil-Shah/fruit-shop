"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
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
import { api } from "@/convex/_generated/api";
import { OrderCard } from "./order-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import useOnlineStatus from "@/customHooks/useOnlineStatus";

export function OrderBrowser({
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
  const me = useQuery(api.users.getMe);
  const userProfile = useQuery(api.users.getMe);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    Doc<"orders">["deliveryStatus"] | undefined
  >(undefined);
  const [paymentMethod, setpaymentMothod] = useState<
    Doc<"orders">["paymentMethod"] | undefined
  >(undefined);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const isOnline = useOnlineStatus();

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }
  console.log({ orgId });
  const orders = useQuery(
    me?.role === "admin" ? api.orders.getAllOrders : api.orders.getOrders,
    orgId
      ? {
          orgId,
          deliveryStatus: status,
          query,
          paymentMethod: paymentMethod,
        }
      : "skip"
  );

  const {
    results,
    status: Status,
    loadMore,
  } = usePaginatedQuery(
    api?.orders?.getOrdersWithPagination,
    orgId
      ? {
          filter: {
            query: query,
            orgId: orgId,
            deliveryStatus: status,
            paymentMethod: paymentMethod,
            sort: sort,
          },
        }
      : "skip",
    { initialNumItems: 2 }
  );

  const isLoading = Status === "LoadingFirstPage";

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
  }, [sentinelRef, loadMore, intersectionCallback]);

  return (
    <>
      <div className="w-full space-y-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-base md:text-4xl font-bold">{title}</h1>
          <div className="flex justify-end items-center gap-2">
            <SearchBar query={query} setQuery={setQuery} />
          </div>
        </div>

        <Tabs defaultValue="grid">
          <div className="w-full flex justify-between items-center gap-2  mb-2">
            <Select
              value={paymentMethod}
              onValueChange={(newType) => {
                setpaymentMothod(
                  newType === "all" ? undefined : (newType as any)
                );
              }}
              defaultValue="all"
            >
              <SelectTrigger className="md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end items-center gap-2">
              <Select
                value={status}
                onValueChange={(newType) => {
                  setStatus(newType === "all" ? undefined : (newType as any));
                }}
                defaultValue="all"
              >
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="deliver">Deliver</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
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
          {/* <ScrollArea className=" h-[500px] md:h-[800px] justify-center pb-10 "> */}
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
              {!isLoading && results?.length === 0 ? (
                <div className="w-full  flex flex-col justify-center items-center space-y-2 bg-gray-100 dark:bg-gray-900 py-16">
                  <Image
                    width={400}
                    height={400}
                    src="/empty_order.svg"
                    alt="empty image"
                  />
                  <p className="font-semibold text-center text-xl mt-2 text-gray-500">
                    You have not any order for now,you can order now{" "}
                  </p>
                  {/* <UploadButton action="create" /> */}
                  <Button>
                    <Link href={"/shopping/products"}>Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <TabsContent
                    value="grid"
                    className="w-full flex flex-col justify-center items-center"
                  >
                    <div className="w-[375px] sm:w-full  flex flex-wrap gap-2 justify-center p-4">
                      {results?.map((order) => {
                        return (
                          <OrderCard
                            key={order?._id}
                            order={order}
                            orgId={orgId}
                          />
                        );
                      })}
                      {Status === "LoadingMore" && (
                        <div className="flex flex-col space-y-3">
                          <Skeleton className="h-[125px] w-[600px] rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[600px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      )}
                      <div ref={sentinelRef} style={{ height: "10px" }}></div>
                    </div>
                  </TabsContent>
                  {/* <TabsContent value="table">
                  <DataTable columns={columns} data={order} />
                </TabsContent> */}
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
