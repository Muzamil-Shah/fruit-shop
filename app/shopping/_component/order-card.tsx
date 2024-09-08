import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  AppleIcon,
  BikeIcon,
  Building2Icon,
  DotIcon,
  HeartCrackIcon,
  HomeIcon,
  IndianRupeeIcon,
  LocateIcon,
  PhoneCallIcon,
  ShoppingBagIcon,
  Star,
} from "lucide-react";
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

import Image from "next/image";
import { useState } from "react";
import SubmitRating from "./rating-box";

export function DeliveryStatusShowcase({
  deliveryStatus,
}: {
  deliveryStatus: Doc<"orders">["deliveryStatus"];
}) {
  let statusActive = {
    ordered: true,
    accepted: false,
    pickup: false,
    deliver: false,
    completed: false,
    returned: false,
    cancelled: false,
  };

  if (deliveryStatus === "accepted") {
    statusActive = {
      ordered: true,
      accepted: true,
      pickup: false,
      deliver: false,
      completed: false,
      returned: false,
      cancelled: false,
    };
  } else if (deliveryStatus === "pickup") {
    statusActive = {
      ordered: true,
      accepted: true,
      pickup: true,
      deliver: false,
      completed: false,
      returned: false,
      cancelled: false,
    };
  } else if (deliveryStatus === "completed") {
    statusActive = {
      ordered: true,
      accepted: true,
      pickup: true,
      deliver: true,
      completed: true,
      returned: false,
      cancelled: false,
    };
  } else if (deliveryStatus === "returned") {
    statusActive = {
      ordered: true,
      accepted: true,
      pickup: true,
      deliver: true,
      completed: true,
      returned: true,
      cancelled: false,
    };
  } else if (deliveryStatus === "cancelled") {
    statusActive = {
      ordered: false,
      accepted: false,
      pickup: false,
      deliver: false,
      completed: false,
      returned: false,
      cancelled: true,
    };
  }

  return (
    <div className="w-full flex flex-wrap justify-center items-center px-2 py-4 gap-2">
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.ordered
              ? "bg-blue-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.ordered ? "blue" : "gray"}
          />
          <span
            className={`${
              statusActive?.ordered
                ? "font-bold text-blue-600"
                : "text-gray-400"
            } text-xs`}
          >
            Ordered
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.accepted
              ? "bg-blue-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.accepted ? "blue" : "gray"}
          />
          <span
            className={`${
              statusActive?.accepted
                ? "font-bold text-blue-600"
                : "text-gray-400"
            } text-xs`}
          >
            Accepted
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.pickup
              ? "bg-blue-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.pickup ? "blue" : "gray"}
          />
          <span
            className={`${
              statusActive?.pickup ? "font-bold text-blue-600" : "text-gray-400"
            } text-xs`}
          >
            Pickup
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.deliver
              ? "bg-blue-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.deliver ? "blue" : "gray"}
          />
          <span
            className={`${
              statusActive?.deliver
                ? "font-bold text-blue-600"
                : "text-gray-400"
            } text-xs`}
          >
            Deliver
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.completed
              ? "bg-blue-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.completed ? "blue" : "gray"}
          />
          <span
            className={`${
              statusActive?.completed
                ? "font-bold text-blue-600"
                : "text-gray-400"
            } text-xs`}
          >
            Completed
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.returned
              ? "bg-organge-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.returned ? "organge" : "gray"}
          />
          <span
            className={`${
              statusActive?.returned
                ? "font-bold text-organge-600"
                : "text-gray-400"
            } text-xs`}
          >
            Returned
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1">
        <div
          className={`px-4 py-0.5 rounded-full ${
            statusActive?.cancelled
              ? "bg-red-600"
              : "bg-gray-100 dark:bg-gray-900"
          }`}
        ></div>
        <div className="flex justify-start items-center gap-1">
          <LocateIcon
            size={16}
            color={statusActive?.cancelled ? "red" : "gray"}
          />
          <span
            className={`${
              statusActive?.cancelled
                ? "font-bold text-red-600"
                : "text-gray-400"
            } text-xs`}
          >
            Cancelled
          </span>
        </div>
      </div>
    </div>
  );
}

export function OrderCard({
  order,
  orgId,
}: {
  order: Doc<"orders">;
  orgId: string | undefined;
}) {
  const updateOrder = useMutation(api.orders.updateOrder);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean | undefined>(
    false
  );
  const handleCancelOrder = async () => {
    if (orgId)
      try {
        await updateOrder({
          orderId: order?._id,
          orgId: orgId ?? "",
          deliveryStatus: "cancelled",
        });
        toast({
          variant: "success",
          title: "Order Uploaded",
          description: "You canceled the order successfully",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Somthing went wrong",
          description: "You can't cancel the order, try again later",
        });
      }
  };
  return (
    <>
      <AlertDialog onOpenChange={setIsConfirmOpen} open={isConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the order for our cancel process. Order will
              cancel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-[600px] rounded-xl border p-2 shadow-md">
        <ScrollArea className="w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Items list{" "}
            </h4>
            {order?.items &&
              order?.items?.map((item, i) => {
                return (
                  <>
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="flex justify-start items-center gap-1">
                        {item?.url && (
                          <Image
                            width={20}
                            height={20}
                            alt="item-image"
                            src={item?.url}
                          />
                        )}
                        X {item?.qty}
                      </span>
                      <span className="flex flex-col items-start justify-start">
                        <span className="font-bold">{item?.name}</span>
                        <span className="flex items-center gap-2 text-xs">
                          {item?.selectedPrice?.quantity} /{" "}
                          <span className="font-bold flex items-center gap-1 text-back dark:text-white">
                            <IndianRupeeIcon size={14} />
                            {item?.selectedPrice?.price}
                          </span>
                        </span>
                      </span>

                      <span className=" flex flex-col justify-start items-start ">
                        <div className="flex justify-center items-center gap-2">
                          <span>{item?.qty}</span>
                        </div>
                      </span>
                      <span className="font-bold flex items-center gap-1 text-xs text-back dark:text-white">
                        <IndianRupeeIcon size={14} />
                        {item?.selectedPrice?.price * item?.qty}
                      </span>
                    </div>
                    <Separator className="my-2" />
                  </>
                );
              })}
          </div>
        </ScrollArea>
        <DeliveryStatusShowcase deliveryStatus={order?.deliveryStatus} />
        <Separator />

        <Collapsible>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text">
              <span className="flex items-center gap-2">
                <ShoppingBagIcon size={16} />
                Item total
              </span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.itemTotal}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2">
              <span className="flex items-center gap-2">
                <Building2Icon size={16} />
                GST and shop charges
              </span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.shopChargesAndGST}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text">
              <span className="flex items-center gap-2">
                <BikeIcon size={16} />
                Delivery partner fee
              </span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.deliveryPartnerFee}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text">
              <span className="flex items-center gap-2">
                <AppleIcon size={16} />
                Platform fee
              </span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.platformFee}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text">
              <span className="flex items-center gap-2">
                <HeartCrackIcon size={16} />
                Feeding India donation
              </span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.feedingIndiaDonation}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleTrigger>
            <div className="w-full flex justify-between items-center gap-2 text-lg text-back dark:text-white">
              <span>Grand Total</span>
              <span className="flex justify-end items-center gap-1 font-bold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.grandTotal}
              </span>
              <Badge variant={order.isPaid ? "success" : "destructive"}>
                {order?.paymentMethod}
              </Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text">
              <span className="flex items-center gap-2">Cash round off</span>
              <span className="flex justify-end items-center gap-1 font-semibold">
                -<IndianRupeeIcon size={16} />
                {order?.amountSummary?.cashRoundOff}
              </span>
            </div>
          </CollapsibleContent>
          <CollapsibleContent>
            <div className="w-full flex justify-between items-center gap-2 text-lg text-back dark:text-white">
              <span>To pay</span>
              <span className="flex justify-end items-center gap-1 font-bold">
                <IndianRupeeIcon size={16} />
                {order?.amountSummary?.toPay}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="flex justify-between items-center py-4">
          <div className="w-full h-auto px-2 flex flex-col justify-start items-start">
            <div className="text-slate-500 flex items-center gap-2">
              <HomeIcon size={16} /> Delivery to{" "}
              {order?.shippingInformation?.save_as}
            </div>
            <p className="text-sm">
              {order?.shippingInformation?.building},
              {order?.shippingInformation?.address},
              {order?.shippingInformation?.near_by}
            </p>
          </div>
          <div className="w-full px-2 flex justify-start items-center gap-2">
            <PhoneCallIcon size={16} />
            {order?.shippingInformation?.receiver_name},{" "}
            {order?.shippingInformation?.receiver_contact}
          </div>
        </div>
        <div className="w-full pt-4 flex flex-col justify-end items-end gap-2">
          {order?.deliveryStatus === "completed" && (
            <div className="w-full flex flex-col justify-start items-start border p-2 rounded-xl">
              <span className="font-semibold text-slate-600 flex items-center gap-2">
                Rating <Star className="text-green-500" />
              </span>
              {order?.items.map((item, i) => (
                <SubmitRating
                  item={item}
                  orgId={orgId ?? ""}
                  productId={item?.productId}
                  key={i}
                />
              ))}
            </div>
          )}
          <div className="flex justify-end items-center gap-2 text-lg text-back dark:text-white">
            <Button
              variant={"outline"}
              disabled={order?.deliveryStatus !== "completed"}
            >
              Returned
            </Button>
            <Button
              onClick={() => {
                setIsConfirmOpen(true);
              }}
              variant={"destructive"}
              disabled={
                !["ordered", "accepted"].includes(order?.deliveryStatus)
              }
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
