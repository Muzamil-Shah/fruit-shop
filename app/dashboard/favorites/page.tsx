import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductBrowser } from "../_component/product-browser";

export default function FavoritesPage() {
  return (
    <>
      <ProductBrowser title={"Favorites"} favoritesOnly />
    </>
  );
}
