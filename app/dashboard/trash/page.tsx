import { useQuery } from "convex/react";
import { FileBrowsers } from "../_component/product-browser";
import { api } from "@/convex/_generated/api";

export default function TrashPage() {
  return (
    <>
      <FileBrowsers title={"Trash"} deletedOnly />
    </>
  );
}
