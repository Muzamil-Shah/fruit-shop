import { useQuery } from "convex/react";
import { FileBrowsers } from "../_component/file-browser";
import { api } from "@/convex/_generated/api";

export default function TrashPage() {
  return (
    <>
      <FileBrowsers title={"Trash"} deletedOnly />
    </>
  );
}
