import Image from "next/image";
import Link from "next/link";

export default function LangnigPage() {
  return (
    // <div className="w-full h-screen bg-white p-4 flex   justify-between items-center relative overflow-hidden -mt-6 space-x-2">
    //   {/* <div className="z-0 w-[46rem] h-96 flex justify-center items-center rounded-t-full animate-accordion-down  blur-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 m-0 p-0">
    //     <div className="z-0 w-64 h-64 rounded-full animate-bounce  blur-xl bg-gradient-to-r from-red-500 via-orange-500 to-slate-500 m-0 p-0"></div>
    //   </div> */}
    //   <div className="w-96">
    //     <h1 className="label text-9xl">Afghan Crunchy Dry Fruits</h1>
    //   </div>
    //   <div className="flex flex-col justify-center items-center space-y-6">
    //     <div className="shadow-2xl rounded-full bg-black">
    //       <Image src={"/loader.png"} alt="loader" width={400} height={400} />
    //     </div>
    //     <Link
    //       href="/shopping/products"
    //       className="p-2 rounded-md px-10 font-bold text-slate-50 bg-gradient-to-r from-orange-900 to-amber-500 hover:from-pink-500 hover:to-yellow-500 ..."
    //     >
    //       Shoping Now
    //     </Link>
    //     {/* <div className="">
    //       <Image width={200} height={200} src="/logo.png" alt="logo" />
    //     </div> */}
    //   </div>
    // </div>
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
          <Link
            href="/shopping/products"
            className="p-3 rounded-lg px-10  font-bold text-slate-50 bg-gradient-to-r from-green-900 to-lime-500 hover:from-lime-500 hover:to-green-500 ..."
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
