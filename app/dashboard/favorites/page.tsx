import { useQuery } from "convex/react";
import { FileBrowsers } from "../_component/file-browser";
import { api } from "@/convex/_generated/api";

export default function FavoritesPage() {
  return (
    <>
      <FileBrowsers title={"Favorites"} favorites={true} />
    </>
  );
}
