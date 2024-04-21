"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Protect } from "@clerk/nextjs";
import clsx from "clsx";
import { useQuery } from "convex/react";
import {
  DatabaseIcon,
  DeleteIcon,
  FileIcon,
  ShoppingCartIcon,
  StarIcon,
  Trash2,
  Trash2Icon,
  WholeWord,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  const me = useQuery(api.users.getMe);
  return (
    <div className="hidden w-40  sm:flex flex-col gap-4 border-r py-2">
      <Link href="/dashboard/products">
        <Button
          variant="link"
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/products"),
          })}
        >
          <DatabaseIcon /> All Products
        </Button>
      </Link>
      <Link href="/dashboard/favorites">
        <Button
          variant="link"
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon /> Favorites
        </Button>
      </Link>
      <Link href="/dashboard/orders">
        <Button
          variant="link"
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/orders"),
          })}
        >
          <ShoppingCartIcon /> Orders
        </Button>
      </Link>

      <Link href="/dashboard/privacy-policy">
        <Button
          variant="link"
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/privacy-policy"),
          })}
        >
          <WholeWord /> Privacy Policy
        </Button>
      </Link>
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
        <Link href="/dashboard/trash">
          <Button
            variant="link"
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/dashboard/trash"),
            })}
          >
            <Trash2Icon /> Deleted
          </Button>
        </Link>
      </Protect>
    </div>
  );
};

export default SideBar;
