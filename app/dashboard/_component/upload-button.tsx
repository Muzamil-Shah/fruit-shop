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
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  EditIcon,
  IndianRupeeIcon,
  Loader2,
  PlusIcon,
  Trash2Icon,
  UploadCloud,
} from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export interface SelectedPriceData {
  price: number;
  quantity: string;
  buyPrice: number;
}
const formSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(0).max(100),
  limit: z.string(),
  status: z.boolean(),
  selectedPrice: z.array(
    z.object({
      price: z.number(),
      quantity: z.string(),
      buyPrice: z.number(),
    })
  ),
  fileStorageId: z.union([
    z.string(),
    z
      .custom<FileList>((val) => val instanceof FileList, "Required")
      .refine((files) => files.length > 0, "Required"),
  ]),
  description: z.string(),
});
export default function UploadButton({
  action,
  productId,
}: {
  action: "create" | "edit";
  productId?: Id<"products">;
}) {
  const [loading, setLoading] = useState(false);
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api?.files?.generateUploadUrl);
  const { toast } = useToast();
  const getProductDetails =
    productId &&
    useQuery(api.products.getProductDetails, {
      productId: productId,
    });

  console.log("data", productId, getProductDetails);
  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      status: true,
      selectedPrice: [
        {
          price: 0,
          quantity: "",
          buyPrice: 0,
        },
      ],
      limit: "",
      fileStorageId: undefined,
    },
  });

  useEffect(() => {
    console.log("form", getProductDetails);
    if (getProductDetails) {
      form?.setValue("name", getProductDetails?.name);
      form?.setValue("category", getProductDetails?.category);
      form?.setValue("description", getProductDetails?.description);
      form?.setValue("limit", getProductDetails?.limit?.toString());
      form?.setValue("selectedPrice", getProductDetails?.selectedPrice);
      setSelectedPriceData(getProductDetails?.selectedPrice);
      form?.setValue("status", getProductDetails?.status);
      form?.setValue("fileStorageId", getProductDetails?.fileStorageId);
    }
  }, [getProductDetails]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ orgId });

    if (!orgId) return;
    const postUrl = await generateUploadUrl();
    const fileTypes = values?.fileStorageId[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileTypes },
      body: values?.fileStorageId[0],
    });

    const { storageId } = await result.json();

    try {
      if (action === "create") {
        await createProduct({
          name: values?.name,
          category: values?.category,
          description: values?.description,
          limit: Number(values?.limit),
          status: values?.status,
          selectedPrice: selectedPriceData,
          fileStorageId: storageId,
          orgId,
        });
        form.reset();
        setIsDialoadOpen(false);
        toast({
          variant: "success",
          title: "Product Uploaded",
          description: "Now everyone can view your file",
        });
      } else if (action === "edit" && productId) {
        await updateProduct({
          fileId: productId,
          name: values?.name,
          category: values?.category,
          description: values?.description,
          limit: Number(values?.limit),
          status: values?.status,
          selectedPrice: selectedPriceData,
          fileStorageId: storageId,
        });
        setIsDialoadOpen(false);
        toast({
          variant: "success",
          title: "Product Updated",
          description: "Now everyone can view your updated product",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Somthing went wrong",
        description: "Your file could not be uploaded, try again later",
      });
    }
  }

  const [isDialogOpen, setIsDialoadOpen] = useState(false);
  const [selectedPriceData, setSelectedPriceData] = useState<
    SelectedPriceData[]
  >([]);
  const [selectedPriceObject, setSelectedPriceObject] =
    useState<SelectedPriceData>({
      price: 0,
      quantity: "",
      buyPrice: 0,
    });

  const addSeletedPrice = () => {
    if (selectedPriceObject) {
      setSelectedPriceData((pre) => [
        ...pre,
        {
          quantity: selectedPriceObject?.quantity,
          price: selectedPriceObject?.price,
          buyPrice: selectedPriceObject?.buyPrice,
        },
      ]);
    }
  };

  const fileRef = form?.register("fileStorageId");

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded) {
    orgId = organization?.organization?.id ?? user?.user?.id;
  }
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);

  useEffect(() => {
    if (getProductDetails) {
      const productDetails = getProductDetails;
      form?.setValue("name", productDetails?.name);
      form?.setValue("category", productDetails?.category);
      form?.setValue("description", productDetails?.description);
      form?.setValue("limit", productDetails?.limit?.toString());
      form?.setValue("selectedPrice", productDetails?.selectedPrice);
      setSelectedPriceData(productDetails?.selectedPrice);
      form?.setValue("status", productDetails?.status);
      form?.setValue("fileStorageId", productDetails?.fileStorageId);
      setLoading(false); // Set loading to false when data is fetched
    }
  }, [getProductDetails]);

  console.log("form", form?.getValues());

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while data is fetching
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialoadOpen(isOpen);
        form?.reset();
      }}
    >
      <DialogTrigger asChild>
        {action === "create" ? (
          <Button>Uplaod Product</Button>
        ) : (
          <div className="flex items-center gap-2 text-green-500">
            <EditIcon size={16} /> Edit
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your file here?</DialogTitle>
          <DialogDescription>
            {getProductDetails?.url && (
              <div className="w-full flex justify-center items-center p-2">
                <Image
                  width={150}
                  height={150}
                  alt="image-product"
                  className="border-2 border-gray-500 rounded-xl shadow-md"
                  src={getProductDetails?.url}
                />
              </div>
            )}
            <Form {...form}>
               
              <form onSubmit={form.handleSubmit(onSubmit)} className=" p-4 ">
                <div className="w-full flex justify-between items-center gap-4">
                  <FormField
                    control={form.control}
                    name="fileStorageId"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Image</FormLabel> */}
                        <Button
                          variant={"secondary"}
                          className="px-10 flex gap-2"
                          onClick={() => fileRef?.onBlur}
                        >
                          <UploadCloud /> Upload
                        </Button>
                        <FormControl>
                          <Input className=" " type="file" {...fileRef} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="status"
                    defaultValue={true}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field?.value}
                          onCheckedChange={(checked: boolean) =>
                            field?.onChange(checked)
                          }
                          id="stack-available"
                        />
                        <Label htmlFor="stack-available">Stack Available</Label>
                      </div>
                    )}
                  />
                </div>
                <ScrollArea className="h-96 w-full flex flex-col justify-start items-start space-y-8 p-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      console.log({ field });

                      return (
                        <FormItem>
                          <FormLabel>Categroy</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="enter your product category"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Name"
                            {...field}
                            value={field?.value}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Description"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Limit"
                            {...field}
                            type="number"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Quantity"
                            value={selectedPriceObject?.quantity}
                            onChange={(e) =>
                              setSelectedPriceObject((pre) => ({
                                quantity: e.target.value,
                                price: pre.price,
                                buyPrice: pre.buyPrice,
                              }))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pricing</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Price"
                            value={selectedPriceObject?.price}
                            onChange={(e) =>
                              setSelectedPriceObject((pre) => ({
                                quantity: pre.quantity,
                                buyPrice: pre.buyPrice,
                                price: Number(e.target.value),
                              }))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="selectedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buying Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your product Price"
                            value={selectedPriceObject?.buyPrice}
                            onChange={(e) =>
                              setSelectedPriceObject((pre) => ({
                                quantity: pre.quantity,
                                price: pre.price,
                                buyPrice: Number(e.target.value),
                              }))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedPriceData?.length > 0 && (
                    <div className="w-full flex flex-col justify-start items-start gap-2 my-4">
                      {selectedPriceData?.map((selectedPrice, i) => (
                        <div
                          key={i}
                          className="w-full flex justify-between items-center"
                        >
                          <span>{i + 1}</span>
                          <span>{selectedPrice?.quantity}</span>
                          <span className="flex items-center gap-1 font-semibold text-black">
                            <IndianRupeeIcon size={16} />
                            {selectedPrice.price}
                          </span>
                          <span>
                            <Button
                              onClick={() =>
                                setSelectedPriceData((pre) => [
                                  ...pre?.filter((item, index) => index !== i),
                                ])
                              }
                              variant={"destructive"}
                              className="p-1"
                            >
                              <Trash2Icon />
                            </Button>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant={"secondary"}
                    type="button"
                    onClick={addSeletedPrice}
                    className="w-full "
                  >
                    <PlusIcon />
                    Add
                  </Button>
                </ScrollArea>
                <Button type="submit" disabled={form?.formState?.isSubmitting}>
                  {form?.formState?.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {action === "create" ? "Submit" : "Update"}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
