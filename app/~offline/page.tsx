import Image from "next/image";
import Link from "next/link";

export default function Offline() {
  return (
    <main className="h-screen bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="h-full relative py-20 overflow-hidden flex justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/background.jpeg"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        {/* Content */}
        <div className="container mx-auto text-center relative z-10  flex flex-col justify-center items-center gap-9">
          <h1 className="label text-9xl p-10">Afghan Crunchy Dry Fruits</h1>
          {/* <p className="text-lg md:text-xl text-slate-600 mb-8 ">
            Premium dry fruits for a healthier lifestyle
          </p> */}
          <div
            // href="/shopping/products"
            className="p-3 rounded-lg px-10  font-bold text-slate-50 bg-gradient-to-r from-green-900 to-lime-500 hover:from-lime-500 hover:to-green-500 ..."
          >
            Shop Now
          </div>
          {/* <div className="mb-10 mx-auto ">
            <Image src="/logo.png" alt="Dry Fruits" width={400} height={400} />
          </div> */}
        </div>
        {/* Animated Image */}
      </section>
    </main>
  );
}
