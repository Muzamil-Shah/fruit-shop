import { Metadata } from "next";
import React from "react";

type Props = {};

export async function generateMetadata({
  params: { productId },
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const response = await fetch("url");
  const product = await response.json();
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.image,
        },
      ],
    },
  };
}
function pnge({}: Props) {
  return <div>pnge</div>;
}

export default pnge;
