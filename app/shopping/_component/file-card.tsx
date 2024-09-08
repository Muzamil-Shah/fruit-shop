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
  BugIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  IndianRupeeIcon,
  Info,
  MinusCircleIcon,
  PercentDiamondIcon,
  PercentIcon,
  PlusCircleIcon,
  PresentationIcon,
  ShoppingBagIcon,
  ShoppingCart,
  ShoppingCartIcon,
  Star,
  UploadIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast, useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { FileCardActions } from "./file-actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { number, object } from "zod";
import { useLocalStorage } from "@/customHooks/useLocalStorage";
import { useCart } from "@/context/cartContext";

export interface FileCardActionProps {
  file: Doc<"products">;
  isFavorited: boolean;
}
export interface ProductCardProps {
  product: Doc<"products"> & { isFavorited: boolean; url: string | null };
}

export function QuantityIncremental({
  limit,
  selectedQuantity,
  setSelectedQuantity,
}: {
  limit: number;
  selectedQuantity: number;
  setSelectedQuantity: any;
}) {
  const incrementFn = () => {
    setSelectedQuantity((pre: number) => pre + 1);
  };
  const decrementFn = () => {
    setSelectedQuantity((pre: number) => pre - 1);
  };
  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant={"ghost"}
        className="p-0 h-auto"
        disabled={selectedQuantity < 1}
        onClick={decrementFn}
      >
        <MinusCircleIcon />
      </Button>
      <span>{selectedQuantity}</span>
      <Button
        variant={"ghost"}
        className="p-0 h-auto"
        disabled={selectedQuantity === limit}
        onClick={incrementFn}
      >
        <PlusCircleIcon />
      </Button>
    </div>
  );
}

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Rating from "./rating";
import { Input } from "@/components/ui/input";

export function ResizableDemo({ product }: ProductCardProps) {
  const updateProduct = useMutation(api.products.updateProduct);
  const applyOffer = useMutation(api.products.applyOffer);
  const [offer, setOffer] = React.useState<number>(0);

  const updateProductStatus = async (checked: boolean) => {
    try {
      await updateProduct({
        fileId: product?._id,
        status: checked,
      });
      toast({
        title: "Product Updated",
        description: "Stack Availablity Update Successfully",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Product Updated Fail",
        description: "Stack Availablity Update Fail, please try later",
        variant: "success",
      });
    }
  };
  const applyOfferHandler = async () => {
    try {
      await applyOffer({
        fileId: product?._id,
        offer: offer > 0 ? offer : undefined,
      });
      toast({
        title: "Offer Added Successfully",
        description: `You successfully added ${offer}% of your product`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Offer Adding Fail",
        description: "Adding Offer to Product Fail, please try later",
        variant: "success",
      });
    }
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-[200px] items-center justify-center p-2">
          <span className="font-semibold">Price List</span>
          {product.selectedPrice?.map((price) => (
            <span className="flex items-center text-sm">
              {price?.quantity} - <IndianRupeeIcon size={16} />
              {price?.price}
            </span>
          ))}
          <span className="text-sm gap-2 flex">
            <span className="font-semibold">Stock Count:</span>
            {product?.limit}
          </span>
          <span className="text-sm gap-2 flex">
            <span className="font-semibold">Category:</span>
            {product?.category}
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex flex-col  items-center justify-center p-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={product?.status}
                  onCheckedChange={(checked: boolean) =>
                    updateProductStatus(checked)
                  }
                  id="stack-available"
                />
                <Label htmlFor="stack-available">Stack Available</Label>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>
            <div className="flex flex-col  items-center justify-center p-2">
              <div className="flex justify-between items-center gap-2">
                <Input
                  className="p-2 h-8"
                  type="number"
                  value={offer}
                  onChange={(e) => setOffer(Number(e?.target.value))}
                  placeholder="Add offer here"
                />
                <Button
                  size={"sm"}
                  onClick={applyOfferHandler}
                  className="flex gap-1"
                  variant={"destructive"}
                >
                  <PercentIcon />
                  Apply
                </Button>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex flex-col h-full items-center justify-center p-2">
              <span className="font-semibold">Decription</span>
              <span className="text-xs">{product?.description}</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function FileCard({ product }: ProductCardProps) {
  // const [value, setValue] = useLocalStorage("cart")
  const [showDiscription, setShowDescription] = React.useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = React.useState<number>(0);
  const [selectedPrice, setSelectedPrice] = React.useState(() => {
    if (product?.selectedPrice && product.selectedPrice.length > 0) {
      return {
        quantity: product.selectedPrice[0].quantity,
        price: product.selectedPrice[0].price,
      };
    }
    return { quantity: "", price: 0 };
  });
  const me = useQuery(api.users.getMe);

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  const userProfile = useQuery(api?.users?.getUserProile, {
    userId: product?.userId,
  });
  const ratingAverage = useQuery(api?.productRating?.calculateAverageRating, {
    productId: product?._id,
  });

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log("handleAddto", product, selectedPrice, selectedQuantity);

    addToCart({ product, selectedQuantity, selectedPrice });
  };

  console.log(selectedPrice);
  return (
    <Card className="w-full md:w-[400px] ">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-base">
          <span className="flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={product?.status ? "success" : "destructive"}
                    className="p-2"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{product?.status ? "Available" : "Unavailable"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {product.name}
            <span className="flex items-center gap-1 text-slate-500">
              {ratingAverage}
              <Star size={16} className="text-yellow-500" />
            </span>
          </span>
          <div className="flex justify-end items-center">
            <Button
              onClick={() => setShowDescription((pre) => !pre)}
              variant={"ghost"}
              size={"icon"}
            >
              <Info />
            </Button>
            {product?.offer && product?.offer > 0 && (
              <Badge variant={"destructive"} className="gap-1">
                {product?.offer}
                <PercentIcon size={16} />
                Offer
              </Badge>
            )}
            <FileCardActions
              isFavorited={product.isFavorited}
              product={product}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center items-center">
        {/* <div className="w-32 h-32   flex justify-center items-center"> */}
        {product.url && (
          <Image
            alt={product?.name}
            width={200}
            height={200}
            src={product?.url}
          />
        )}
        {/* </div> */}
      </CardContent>
      <CardFooter className="w-full">
        {me?.role === "admin" ? (
          <ResizableDemo product={product} />
        ) : (
          <div className=" w-full flex justify-between items-center gap-2">
            <Select
              defaultValue={
                product?.selectedPrice.length > 0
                  ? `${product?.selectedPrice[0]?.quantity}-${product?.selectedPrice[0]?.price}`
                  : "Select Size"
              }
              onValueChange={(value) => {
                setSelectedPrice({
                  quantity: value.split("-")[0],
                  price: Number(value.split("-")[1]),
                });
                setSelectedQuantity(0);
              }}
            >
              <SelectTrigger className="md:w-[145px]  font-bold px-1">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Price List</SelectLabel>
                  {product?.selectedPrice.map((item) => (
                    <SelectItem
                      value={`${item?.quantity}-${item?.price}`}
                      className="flex"
                    >
                      <div className="flex justify-center items-center gap-2">
                        {`${item?.quantity} - ${item?.price}`}
                        <IndianRupeeIcon size={16} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <QuantityIncremental
              limit={product?.limit}
              selectedQuantity={selectedQuantity}
              setSelectedQuantity={setSelectedQuantity}
            />
            <div className="text-xs text-gray-500 flex justify-end items-start gap-2">
              <Button
                disabled={!product?.status || selectedQuantity === 0}
                onClick={handleAddToCart}
                className="flex gap-2"
                size={"default"}
              >
                <span className="hidden md:flex">Add</span> <ShoppingCart />
              </Button>
            </div>
          </div>
        )}
        {showDiscription && (
          <div className="flex-1">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-wrap">
              <span className="text-pretty font-medium">Discription:</span>
              {product?.description}
              {product.description}. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Fugit praesentium expedita iste magnam eius nemo
              nisi accusamus iusto possimus deserunt culpa delectus quo, porro
              sunt? Ipsum modi incidunt facere molestias?
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
