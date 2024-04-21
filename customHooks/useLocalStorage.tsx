"use client";
import { useEffect, useState } from "react";

export function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : { items: [] };
  });

  const addItemToCart = (item: any) => {
    setValue((prevValue: any) => {
      const updatedItems = [...prevValue.items, item];
      localStorage.setItem(key, JSON.stringify({ items: updatedItems }));
      return { items: updatedItems };
    });
  };

  return [value, addItemToCart];
}
