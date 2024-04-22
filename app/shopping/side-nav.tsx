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
            "text-blue-500": pathname.includes("/shopping/privacy-policy"),
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
        <Link href="/shopping/trash">
          <Button
            variant="link"
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/shopping/trash"),
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
