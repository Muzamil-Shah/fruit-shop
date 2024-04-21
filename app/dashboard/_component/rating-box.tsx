"use client";
import React from "react";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Star } from "lucide-react";

export default function SubmitRating({
  orgId,
  productId,
  item,
}: {
  orgId: string;
  productId: Doc<"products">["_id"];
  item: any;
}) {
  const [rating, setRating] = React.useState(0);
  const ratingExist = useQuery(
    api?.productRating?.userRatingExist,
    orgId ? { orgId: orgId, productId: productId } : "skip"
  );
  const createProductRating = useMutation(
    api.productRating.createProductRacting
  );

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const onSubmit = async () => {
    if (orgId && productId) {
      try {
        await createProductRating({ orgId, productId, rating });
        toast({
          variant: "success",
          title: "Rating Successfuly",
          description:
            "Thanks for your rating, your opinin change our productivty",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Somthing went wrong",
          description: "your rating didnt submit please try again later",
        });
      }
    }
  };

  return ratingExist ? (
    <div className="w-full flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="flex justify-start items-center gap-1">
          {item?.url && (
            <Image width={80} height={80} alt="item-image" src={item?.url} />
          )}
        </span>
        <span className="flex flex-col items-start justify-start">
          <span className="font-semibold">{item?.name}</span>
        </span>
      </div>
      <div className="flex justify-end items-center gap-2 font-bold">
        {ratingExist?.rating}
        <Star className="text-yellow-500" />
      </div>
    </div>
  ) : (
    <div className="w-full flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="flex justify-start items-center gap-1">
          {item?.url && (
            <Image width={80} height={80} alt="item-image" src={item?.url} />
          )}
        </span>
        <span className="flex flex-col items-start justify-start">
          <span className="font-semibold">{item?.name}</span>
        </span>
      </div>
      <Rating value={rating} onChange={handleRatingChange} />
      <Button
        size={"sm"}
        onClick={onSubmit}
        className={`${
          rating < 3
            ? "bg-red-500"
            : rating === 3
            ? "bg-yellow-500"
            : rating > 3
            ? "bg-green-500"
            : ""
        }`}
      >
        Submit
      </Button>
    </div>
  );
}
