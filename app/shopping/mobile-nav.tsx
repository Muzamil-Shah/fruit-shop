"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import {
  DatabaseIcon,
  DeleteIcon,
  FileIcon,
  MenuIcon,
  ShoppingCartIcon,
  StarIcon,
  Trash2,
  Trash2Icon,
  WholeWord,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <Sheet key={"left"}>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xs md:text-xl"
            >
              <Image width={50} height={50} alt="logo" src="/logo.png" />
              MSM Afghani Dry Fruits
            </Link>
          </SheetTitle>
          <Separator />
          <SheetDescription>
            <div className="w-40 flex flex-col">
              <Link href="/shopping/products">
                <Button
                  variant="link"
                  className={clsx("flex gap-2", {
                    "text-blue-500": pathname.includes("/shopping/products"),
                  })}
                >
                  <DatabaseIcon /> All Products
                </Button>
              </Link>
              <Link href="/shopping/favorites">
                <Button
                  variant="link"
                  className={clsx("flex gap-2", {
                    "text-blue-500": pathname.includes("/shopping/favorites"),
                  })}
                >
                  <StarIcon /> Favorites
                </Button>
              </Link>
              <Link href="/shopping/orders">
                <Button
                  variant="link"
                  className={clsx("flex gap-2", {
                    "text-blue-500": pathname.includes("/shopping/orders"),
                  })}
                >
                  <ShoppingCartIcon /> Orders
                </Button>
              </Link>
              <Link href="/shopping/privacy-policy">
                <Button
                  variant="link"
                  className={clsx("flex gap-2", {
                    "text-blue-500": pathname.includes(
                      "/shopping/privacy-policy"
                    ),
                  })}
                >
                  <WholeWord /> Privacy Policy
                </Button>
              </Link>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
