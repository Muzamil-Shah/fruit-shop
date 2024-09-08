"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast, useToast } from "@/components/ui/use-toast";
import {
  AppleIcon,
  BanknoteIcon,
  BikeIcon,
  BuildingIcon,
  Clock10Icon,
  CoinsIcon,
  DeleteIcon,
  DonutIcon,
  HandCoinsIcon,
  HeartCrackIcon,
  HomeIcon,
  IndianRupeeIcon,
  Loader2,
  MinusCircleIcon,
  PercentIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  ShoppingBasketIcon,
  TrashIcon,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ShippingAddress } from "./shipping-address";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QuantityIncremental } from "./file-card";
import { useCart } from "@/context/cartContext";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import YourBillingComponent from "./online-payment";

export interface SelectedPriceData {
  price: number;
  quantity: string;
}

export default function CartButton() {
  const { cartCount, cart, addToCart, emptyCart } = useCart();
  const organization = useOrganization();
  const user = useUser();
  const userProfile = useQuery(api.users.getMe);

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }

  const products = useQuery(
    api.products.getProducts,
    orgId
      ? {
          orgId,
        }
      : "skip"
  );

  const [isDialogOpen, setIsDialoadOpen] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState<boolean>(false);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<
    "cash" | "online"
  >("cash");
  const [isPaid, setIspaid] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const getPayment = useQuery(api.payments.getMessageId, {
    razorpayId: paymentId,
  });

  const subTotal =
    cart?.items?.reduce(
      (c, a) =>
        a?.offer
          ? c +
            (a?.selectedPrice?.price -
              (a?.offer * a?.selectedPrice?.price) / 100) *
              a.qty
          : c + a.selectedPrice?.price * a.qty,
      0
    ) ?? 0;

  const shopChargesAndGST = parseFloat(((2 * subTotal) / 100).toFixed(2));

  const deliveryCharges = 0;

  const platformFee = 4;
  const feedingIndiaDonation = 4;
  const grandTotal =
    subTotal +
    shopChargesAndGST +
    deliveryCharges +
    platformFee +
    feedingIndiaDonation;
  const cashRoundOff = grandTotal - Math.round(grandTotal);
  const toPay = Math.round(grandTotal);

  const createOrder = useMutation(api?.orders?.createorder);

  const handlePlaceOrdered = async () => {
    console.log("handleplace", {
      orgId,
      items: cart?.items,
      shippingInformation: userProfile?.shippingInformation,
      isPaid: true,
      deliveryStatus: "ordered",
      userId: user?.user?.id,
      paymentMethod: "cash",
      amountSummary: {
        itemTotal: subTotal,
        shopChargesAndGST,
        deliveryPartnerFee: deliveryCharges,
        platformFee,
        feedingIndiaDonation,
        grandTotal,
        cashRoundOff,
        toPay,
      },
    });

    try {
      if (orgId && userProfile?.shippingInformation)
        await createOrder({
          orgId,
          items: cart?.items,
          shippingInformation:
            userProfile?.shippingInformation[cart?.selectedAddress ?? 0],
          isPaid: isPaid,
          deliveryStatus: "ordered",
          userId: userProfile?._id,
          paymentMethod: selectPaymentMethod,
          paymentDetails: {
            paymentId: getPayment?._id ?? "",
          },
          amountSummary: {
            itemTotal: subTotal,
            shopChargesAndGST,
            deliveryPartnerFee: deliveryCharges,
            platformFee,
            feedingIndiaDonation,
            grandTotal,
            cashRoundOff,
            toPay,
          },
        });
      toast({
        variant: "success",
        title: "Order Placed",
        description: "You are the product successfuly",
      });
      setOrderConfirm(true);
      setIspaid(false);
      setPaymentId(undefined);
      emptyCart();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Order Faild",
        description:
          "You want order something but it went wrong, try again later",
      });
    }
  };

  useEffect(() => {
    if (isPaid && getPayment?._id) {
      setIsDialoadOpen(true);
      handlePlaceOrdered();
    }
  }, [isPaid, getPayment, handlePlaceOrdered]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (orderConfirm) setOrderConfirm(false);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [orderConfirm]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialoadOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="flex items-center gap-2 relative"
          variant={"outline"}
        >
          {cartCount > 0 && (
            <div className="animate-ping p-0 absolute right-1 top-0 text-red-500">
              {cartCount}
            </div>
          )}
          <ShoppingBasketIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card Items</DialogTitle>
          <DialogDescription className=" space-y-2">
            {orderConfirm ? (
              <div className="w-full  flex flex-col justify-center items-center space-y-2 bg-gray-100 dark:bg-gray-900 py-16">
                <Image
                  width={400}
                  height={400}
                  src="/order_confirm.svg"
                  alt="order confirm image"
                />
                <p className="font-semibold text-xl mt-2 text-gray-500">
                  Your order placed Successfuly!
                </p>
                <Button onClick={() => setIsDialoadOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : cart?.items?.length === 0 ? (
              <div className="w-full  flex flex-col justify-center items-center space-y-2 bg-gray-100 dark:bg-gray-900 py-16">
                <Image
                  width={400}
                  height={400}
                  src="/empty_cart.svg"
                  alt="empty image"
                />
                <p className="font-semibold text-xl mt-2 text-gray-500">
                  Your cart is empty right now!
                </p>
                <Button onClick={() => setIsDialoadOpen(false)}>
                  Add Item To Cart
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="w-full rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                      Items list{" "}
                    </h4>
                    {cart?.items &&
                      cart?.items?.map((product, i) => {
                        // setSelectedQuantity(product.qty);
                        const productFind = products?.find(
                          (item: Doc<"products">) =>
                            item?._id === product.productId
                        );
                        return (
                          <>
                            <div
                              key={i}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="flex justify-start items-center gap-1">
                                {product?.url && (
                                  <Image
                                    width={20}
                                    height={20}
                                    alt="item-image"
                                    src={product?.url}
                                  />
                                )}
                                X {product?.qty}
                              </span>
                              <span className="flex flex-col items-start justify-start">
                                <span className="font-bold">
                                  {product?.name}{" "}
                                </span>
                                <span className="flex items-center gap-2 text-xs">
                                  {product?.selectedPrice?.quantity} /{" "}
                                  <span className="font-bold flex items-center gap-1 text-back dark:text-white">
                                    <IndianRupeeIcon size={14} />
                                    {product?.selectedPrice?.price}
                                  </span>
                                </span>
                              </span>

                              <span className=" flex flex-col justify-start items-start ">
                                <div className="flex justify-center items-center gap-2">
                                  <Button
                                    variant={"ghost"}
                                    className="p-0 h-auto"
                                    disabled={product?.qty < 1}
                                    onClick={() => {
                                      if (productFind) {
                                        addToCart({
                                          product: productFind,
                                          selectedQuantity: product?.qty - 1,
                                          selectedPrice: product?.selectedPrice,
                                        });
                                      }
                                    }}
                                  >
                                    <MinusCircleIcon />
                                  </Button>
                                  <span>{product?.qty}</span>
                                  <Button
                                    variant={"ghost"}
                                    className="p-0 h-auto"
                                    disabled={product?.qty === product?.limit}
                                    onClick={() => {
                                      if (productFind) {
                                        addToCart({
                                          product: productFind,
                                          selectedQuantity: product?.qty + 1,
                                          selectedPrice: product?.selectedPrice,
                                        });
                                      }
                                    }}
                                  >
                                    <PlusCircleIcon />
                                  </Button>
                                </div>
                              </span>
                              <span className="font-bold flex items-center gap-1 text-xs text-back dark:text-white">
                                {product?.offer ? (
                                  <>
                                    <Badge
                                      variant={"destructive"}
                                      className="text-xs"
                                    >
                                      {product?.offer}
                                      <PercentIcon size={16} />
                                      off
                                    </Badge>

                                    <div>
                                      <div className="flex items-center line-through text-slate-400 text-xs font-thin">
                                        <IndianRupeeIcon size={14} />
                                        {product?.selectedPrice?.price *
                                          product?.qty}
                                      </div>
                                      {product?.offer && (
                                        <div className="flex items-center">
                                          <IndianRupeeIcon size={14} />
                                          {(product?.selectedPrice?.price -
                                            (product?.offer *
                                              product?.selectedPrice?.price) /
                                              100) *
                                            product?.qty}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center ">
                                    <IndianRupeeIcon size={14} />
                                    {product?.selectedPrice?.price *
                                      product?.qty}
                                  </div>
                                )}
                              </span>
                            </div>
                            <Separator className="my-2" />
                          </>
                        );
                      })}
                  </div>
                </ScrollArea>
                <Separator />

                {userProfile?.shippingInformation &&
                userProfile?.shippingInformation?.length > 0 ? (
                  <>
                    <Button
                      variant={"outline"}
                      className="w-full h-auto px-2 flex flex-col justify-start items-start"
                    >
                      <div className=" text-slate-500 flex items-center gap-2">
                        <HomeIcon size={16} /> Delivery to{" "}
                        {
                          userProfile?.shippingInformation[
                            cart?.selectedAddress ?? 0
                          ]?.save_as
                        }
                      </div>
                      <div className="w-full">
                        <p className="  text-start text-sm text-wrap">
                          {
                            userProfile?.shippingInformation[
                              cart?.selectedAddress ?? 0
                            ]?.building
                          }
                          ,
                          {
                            userProfile?.shippingInformation[
                              cart?.selectedAddress ?? 0
                            ]?.address
                          }
                          ,
                          {
                            userProfile?.shippingInformation[
                              cart?.selectedAddress ?? 0
                            ]?.near_by
                          }
                        </p>
                      </div>

                      <div className="w-full flex justify-end items-center py-2">
                        <ShippingAddress />
                      </div>
                    </Button>
                    <Button
                      variant={"outline"}
                      className="w-full px-2 flex justify-start items-center gap-2"
                    >
                      <PhoneCallIcon size={16} />
                      {
                        userProfile?.shippingInformation[
                          cart?.selectedAddress ?? 0
                        ]?.receiver_name
                      }
                      ,{" "}
                      {
                        userProfile?.shippingInformation[
                          cart?.selectedAddress ?? 0
                        ]?.receiver_contact
                      }
                    </Button>
                  </>
                ) : (
                  <ShippingAddress />
                )}
                <Collapsible>
                  <CollapsibleContent>
                    <div className="w-full flex justify-between items-center gap-2 text">
                      <span className="flex items-center gap-2">
                        <ShoppingBagIcon size={16} />
                        Item total
                      </span>
                      <span className="flex justify-end items-center gap-1 font-semibold">
                        <IndianRupeeIcon size={16} />
                        {subTotal}
                      </span>
                    </div>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <div className="w-full flex justify-between items-center gap-2">
                      <span className="flex items-center gap-2">
                        <BuildingIcon size={16} />
                        GST and shop charges
                      </span>
                      <span className="flex justify-end items-center gap-1 font-semibold">
                        <IndianRupeeIcon size={16} />
                        {shopChargesAndGST}
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
                        {deliveryCharges}
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
                        {platformFee}
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
                        {feedingIndiaDonation}
                      </span>
                    </div>
                  </CollapsibleContent>
                  <CollapsibleTrigger>
                    <div className="w-full flex justify-between items-center gap-2 text-lg text-back dark:text-white">
                      <span>Grand Total</span>
                      <span className="flex justify-end items-center gap-1 font-bold">
                        <IndianRupeeIcon size={16} />
                        {grandTotal}
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="w-full flex justify-between items-center gap-2 text">
                      <span className="flex items-center gap-2">
                        Cash round off
                      </span>
                      <span className="flex justify-end items-center gap-1 font-semibold">
                        -<IndianRupeeIcon size={16} />
                        {cashRoundOff}
                      </span>
                    </div>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <div className="w-full flex justify-between items-center gap-2 text-lg text-back dark:text-white">
                      <span>To pay</span>
                      <span className="flex justify-end items-center gap-1 font-bold">
                        <IndianRupeeIcon size={16} />
                        {toPay}
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <div className="w-full pt-4 flex flex-col justify-end items-end gap-2">
                  <div className="flex justify-end items-center gap-2 text-lg text-back dark:text-white ">
                    {!isPaid && !getPayment?._id && (
                      <Select
                        defaultValue={selectPaymentMethod}
                        onValueChange={(value) =>
                          setSelectPaymentMethod(
                            value === "cash" ? "cash" : "online"
                          )
                        }
                      >
                        <SelectTrigger className="w-[200px]  font-bold ">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem
                              value={`cash`}
                              className="flex items-center gap-2"
                            >
                              Cash On Delivery
                              <BanknoteIcon size={16} />
                            </SelectItem>
                            <SelectItem value={`online`} className="flex">
                              Online Payment
                              <Clock10Icon size={16} />
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}

                    {selectPaymentMethod === "cash" ? (
                      <Button onClick={handlePlaceOrdered}>Buy Now</Button>
                    ) : selectPaymentMethod === "online" ? (
                      isPaid && getPayment?._id ? (
                        <Button onClick={handlePlaceOrdered}>Buy Now</Button>
                      ) : (
                        <YourBillingComponent
                          total={grandTotal}
                          setIsDialoadOpen={setIsDialoadOpen}
                          setIsPaid={setIspaid}
                          setPaymentId={setPaymentId}
                        />
                      )
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
