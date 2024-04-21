"use client";
import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./dashboard/mobile-nav";
import CartButton from "./dashboard/_component/cart-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, EyeIcon, User } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { format, formatDistance } from "date-fns";

export default function Notification() {
  const userProfile = useQuery(api.users.getMe);
  const user = useUser();
  const updateNotification = useMutation(api.notifications.updateNotification);
  let orgId: string | undefined = undefined;
  if (user?.isLoaded) {
    orgId = user?.user?.id;
  }

  const notifications = useQuery(
    api.notifications.getNotification,
    orgId
      ? {
          orgId,
          userId: userProfile?._id ?? "",
        }
      : "skip"
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="relative">
          <div className="absolute top-0 right-1">{notifications?.length}</div>
          <BellIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <DropdownMenuLabel className="flex justify-between items-center gap-2">
          <>Notification</>
          <Button
            size={"icon"}
            onClick={async () => {
              if (orgId && userProfile)
                try {
                  await updateNotification({
                    orgId: orgId,
                    userId: userProfile?._id,
                  });
                } catch (error) {
                  throw new ConvexError("something with wrong");
                }
            }}
            variant={"outline"}
          >
            <EyeIcon />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications && notifications?.length < 1 ? (
          <DropdownMenuItem className="flex flex-col justify-center items-centers gap-3 ">
            <Image
              width={200}
              height={200}
              alt="notifications empty"
              src={"/empty.svg"}
            />
            Notification is empty
          </DropdownMenuItem>
        ) : (
          <div className="flex flex-col justify-start items-start gap-2">
            {notifications?.map((notification, i) => (
              <DropdownMenuItem
                key={i}
                className={`flex flex-col justify-start items-start gap-1 border rounded-lg bg-green-50 ${
                  notification?.seen && "bg-gray-50"
                }`}
              >
                <div className="w-full flex justify-between items-center">
                  <h3 className="text-md font-semibold">
                    {notification?.notification?.title}
                  </h3>
                  <span className="text-slate-400">
                    {formatDistance(notification?._creationTime, new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {notification?.notification?.description}
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <div className="fixed w-full border-b py-4 bg-gray-50 z-50">
      <div className="mx-auto px-4  flex justify-between items-center">
        <div className="flex sm:hidden">
          <MobileNav />
        </div>
        <div className="hidden sm:flex justify-start items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xs md:text-xl"
          >
            <Image width={40} height={40} alt="logo" src="/logo.jpeg" />
            Afghan Crunchy Dry Fruits
          </Link>
        </div>
        <div className="flex justify-end items-center space-x-2">
          {/* <OrganizationSwitcher /> */}
          <Notification />
          <CartButton />
          <UserButton />
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
