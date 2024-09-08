import Image from "next/image";
import Link from "next/link";

export default function Offline() {
  return (
    <main className="h-screen bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="h-full relative py-20 overflow-hidden flex justify-center items-center">
        {/* Background Image */}
        {/* <div className="absolute inset-0">
          <Image
            src="/background.jpeg"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div> */}
        {/* Content */}
        <div className="container mx-auto text-center relative z-10  flex flex-col justify-center items-center gap-9">
          <Image width={400} height={400} alt="logo" src="/logo.png" />
          {/* <h1 className="label text-9xl ">Maza Sar Maza</h1> */}
          <p className="text-xl">
            Maza Sar Maza Afghani Dry Fruits one of the beloved online platform
            over india we are import the best fresh and tasty dry fruits from
            afghanistan
          </p>
          {/* <p className="text-lg md:text-xl text-slate-600 mb-8 ">
            Premium dry fruits for a healthier lifestyle
          </p> */}
          <Link
            href="/shopping/products"
            className="p-3 rounded-lg px-10  font-bold text-slate-50 bg-gradient-to-r from-amber-900 to-amber-700 hover:from-amber-500-500 hover:to-yellow-800 "
          >
            Shop Now
          </Link>
          {/* <div className="mb-10 mx-auto ">
            <Image src="/logo.png" alt="Dry Fruits" width={400} height={400} />
          </div> */}
        </div>
        {/* Animated Image */}
      </section>
    </main>
  );
}
