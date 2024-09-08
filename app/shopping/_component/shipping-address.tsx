import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cartContext";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import {
  HomeIcon,
  Loader2,
  LocateFixedIcon,
  PhoneCallIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
enum SaveAs {
  Home = "Home",
  Work = "Work",
  Hotel = "Hotel",
  Other = "Other",
}
const formSchema = z.object({
  save_as: z.enum([SaveAs.Home, SaveAs.Hotel, SaveAs.Work, SaveAs.Other]),
  receiver_name: z.string(),
  receiver_contact: z.string(),
  building: z.string(),
  address: z.string(),
  near_by: z.optional(z.string()),
});
export function ShippingAddress() {
  const updateUserShippingInformation = useMutation(
    api.users.updateUserShippingInformation
  );
  const userProfile = useQuery(api.users.getMe);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      save_as: SaveAs.Home,
      receiver_name: "",
      receiver_contact: "",
      building: "",
      address: "",
      near_by: "",
    },
  });
  const { selectAddress, cart } = useCart();
  const [selectedAddress, setSeletedAddress] = useState<number>();

  const user = useUser();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let tokenIdentifier: string = "";
    if (user?.isLoaded) {
      tokenIdentifier = `https://superb-jaybird-7.clerk.accounts.dev|${user?.user?.id}`;
    }
    const shipping_information = {
      save_as: values.save_as,
      receiver_name: values.receiver_name,
      receiver_contact: values.receiver_contact,
      building: values.building,
      address: values.address,
      near_by: values.near_by,
    };
    try {
      await updateUserShippingInformation({
        tokenIdentifier: tokenIdentifier,
        shippingInformation: shipping_information,
      });
      toast({
        variant: "success",
        title: "Shipping Inforamtion Added",
        description: "Your file sended to trash successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "User Shipping information Update Faild",
        description: "You cant delete the file try again later!",
      });
    }
  };
  const [isDialogOpen, setIsDialoadOpen] = useState(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialoadOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="flex items-center gap-2">
          {userProfile?.shippingInformation &&
          userProfile?.shippingInformation?.length > 0
            ? "Change Address"
            : "Add Delivery Address"}
          <LocateFixedIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shipping Address Details</DialogTitle>
          <DialogDescription className="space-y-2">
            <ScrollArea className="h-96 px-4">
              {userProfile?.shippingInformation &&
                userProfile?.shippingInformation?.length > 0 && (
                  <RadioGroup
                    onValueChange={(value) => setSeletedAddress(Number(value))}
                    defaultValue={`${cart?.selectedAddress}`}
                  >
                    {userProfile?.shippingInformation?.map((address, i) => (
                      <div
                        key={i}
                        className="w-full flex items-center space-x-2 "
                      >
                        <RadioGroupItem value={`${i}`} id={`${i}`} />
                        <Label htmlFor={`${i}`}>
                          <div
                            className="w-full h-auto px-2 flex flex-col justify-start items-start border rounded p-2"
                            onClick={() => <ShippingAddress />}
                          >
                            <div className="text-slate-500 flex items-center gap-2">
                              <HomeIcon size={16} /> Delivery to{" "}
                              {address?.save_as}
                            </div>
                            <p className="text-sm ">
                              {address?.building},{address?.address},
                              {address?.near_by}
                            </p>
                            <p className=" px-2 flex justify-start items-center gap-2">
                              <PhoneCallIcon size={16} />
                              {address?.receiver_name},{" "}
                              {address?.receiver_contact}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              <Form {...form}>
                 
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="save_as"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Save As</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant={
                                field.value === "Home" ? "default" : "outline"
                              }
                              onClick={() => field.onChange(SaveAs.Home)}
                            >
                              Home
                            </Button>
                            <Button
                              type="button"
                              variant={
                                field.value === "Work" ? "default" : "outline"
                              }
                              onClick={() => field.onChange(SaveAs.Work)}
                            >
                              Work
                            </Button>
                            <Button
                              type="button"
                              variant={
                                field.value === "Hotel" ? "default" : "outline"
                              }
                              onClick={() => field.onChange(SaveAs.Hotel)}
                            >
                              Hotel
                            </Button>
                            <Button
                              type="button"
                              variant={
                                field.value === "Other" ? "default" : "outline"
                              }
                              onClick={() => field.onChange(SaveAs.Other)}
                            >
                              Other
                            </Button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiver_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver&apos;s name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter receiver's name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiver_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver&apos;s contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter receiver's contact number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Flat / House no / Floor / Building
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Flat / House no / Floor / Building"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area / Sector / Locality</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Area / Sector / Locality"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="near_by"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nearby landmark (optionl)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nearby landmark (optionl)"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex justify-end items-center py-4">
                    <Button
                      variant={"secondary"}
                      className="w-full"
                      type="submit"
                      disabled={form?.formState?.isSubmitting}
                    >
                      {form?.formState?.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Address
                    </Button>
                  </div>
                </form>
              </Form>
              <Button
                onClick={() => {
                  selectAddress(selectedAddress ?? 0);
                  setIsDialoadOpen(false);
                }}
                className="w-full "
              >
                Select Address
              </Button>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
