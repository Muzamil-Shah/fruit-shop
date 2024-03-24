import Image from "next/image";
import Link from "next/link";

export default function LangnigPage() {
  return (
    <div className="w-full h-screen bg-slate-900 p-4 flex justify-center items-center relative overflow-hidden -mt-6">
      <div className="z-0 w-[46rem] h-96 flex justify-center items-center rounded-t-full animate-accordion-down  blur-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 m-0 p-0">
        <div className="z-0 w-64 h-64 rounded-full animate-bounce  blur-xl bg-gradient-to-r from-red-500 via-orange-500 to-slate-500 m-0 p-0"></div>
      </div>
      <div className="flex flex-col justify-center items-center space-y-6">
        <div className="text-5xl font-extrabold ...">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Filo File Drive
          </span>
        </div>
        <div className="flex flex-col justify-center items-center px-10">
          <p className="text-xl text-slate-100 text-center">
            you can store all the file in free storage, make your one
            organization for friends, family, team work and etc...
          </p>
        </div>
        <Link
          href="/dashboard/files"
          className="p-2 rounded-md px-10 font-bold text-slate-50 bg-gradient-to-r from-slate-900 to-blue-500 hover:from-pink-500 hover:to-yellow-500 ..."
        >
          Get Started
        </Link>
        <div className="">
          <Image width={200} height={200} src="/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  );
}
