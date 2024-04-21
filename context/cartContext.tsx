// cartContext.ts
import { Doc, Id } from "@/convex/_generated/dataModel";
import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  productId: Id<"products">;
  name: string;
  category: string;
  description: string;
  status: boolean;
  selectedPrice: { price: number; quantity: string };
  limit: number;
  url: string;
  qty: number;
  fileStorageId: Id<"_storage">;
  orgId: string;
  userId: Id<"users">;
}

interface CartContextType {
  cart: {
    items: CartItem[];
    selectedAddress?: number;
  };
  addToCart: (args: {
    product: Doc<"products"> & { url: string | null };
    selectedQuantity: number;
    selectedPrice: { price: number; quantity: string };
  }) => void;
  cartCount: number;
  emptyCart: () => void;
  selectAddress: (selectedAddress: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{
    items: CartItem[];
    selectedAddress?: number;
  }>({
    items: [],
    selectedAddress: 0,
  });

  const setCartToState = () => {
    setCart(
      localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart")!)
        : {
            items: [],
            selectedAddress: 0,
          }
    );
  };

  const addToCart = async ({
    product,
    selectedQuantity,
    selectedPrice,
  }: {
    product: Doc<"products"> & { url: string | null };
    selectedQuantity: number;
    selectedPrice: { price: number; quantity: string };
  }) => {
    console.log({ selectedQuantity });

    const newItem: CartItem = {
      productId: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      status: product.status,
      selectedPrice: selectedPrice,
      limit: product.limit,
      url: product.url ?? "",
      qty: selectedQuantity,
      fileStorageId: product?.fileStorageId,
      orgId: product?.orgId,
      userId: product?.userId,
    };

    const isExisted = cart?.items.find(
      (item) =>
        item.productId === newItem.productId &&
        item?.selectedPrice?.quantity.includes(newItem?.selectedPrice?.quantity)
    );

    let newCartItems;
    if (isExisted) {
      if (selectedQuantity > 0) {
        // console.log(
        //   newItem?.selectedPrice?.quantity.includes(
        //     isExisted?.selectedPrice?.quantity
        //   ),
        //   newItem?.selectedPrice?.quantity,
        //   isExisted?.selectedPrice?.quantity
        // );

        // if (
        //   isExisted?.productId === newItem?.productId &&
        //   newItem?.selectedPrice?.quantity.includes(
        //     isExisted?.selectedPrice?.quantity
        //   )
        // ) {
        //   console.log("this");

        newCartItems = cart?.items.map((item) =>
          item.productId === isExisted.productId &&
          newItem?.selectedPrice?.quantity.includes(
            item?.selectedPrice?.quantity
          )
            ? newItem
            : item
        );
        // } else {
        //   console.log("this one");
        //   newCartItems = [...cart.items, newItem];
        // }
      } else {
        newCartItems = cart?.items.filter((item) => item?.qty > 1);
      }
    } else {
      newCartItems = cart?.items ? [...cart?.items, newItem] : [];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify({ ...cart, items: newCartItems })
    );
    setCartToState();
  };

  useEffect(() => {
    setCartToState();
  }, []);

  const cartCount = cart?.items.length;

  const emptyCart = () => {
    localStorage.setItem("cart", JSON.stringify({ items: [] }));
    setCartToState();
  };

  const selectAddress = (selectedAddress: number) => {
    localStorage.setItem(
      "cart",
      JSON.stringify({ ...cart, selectedAddress: selectedAddress })
    );
    setCartToState();
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, cartCount, emptyCart, selectAddress }}
    >
      {children}
    </CartContext.Provider>
  );
};
