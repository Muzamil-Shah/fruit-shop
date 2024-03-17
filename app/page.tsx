'use client'
import { api } from "@/convex/_generated/api";
import {  useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
 

export default function Home() {


  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded){
    orgId = organization?.organization?.id ?? user?.user?.id
  }
  const files = useQuery(api.files.getFiles, orgId ?{orgId} : 'skip')
  const isLoading = files === undefined
  return (
    <main className="conatiner mx-auto pt-4 px-2">
      {isLoading && <div className="mt-32 w-full flex flex-col justify-center items-center">
        <Loader2 className="mr-2 h-32 w-32 animate-spin" />
        <p className="text-xl font-semibold text-gray-400">The files going to show!</p>
        </div>}
      {!isLoading && files?.length === 0 &&<div className=" mt-40 flex flex-col justify-center items-center space-y-3">
           <Image src={'./empty.svg'} alt='empty file' width={600} height={600} />
     <div className="text-xl font-bold text-gray-500">You have no files, go ahead and upload one now</div>
     <UploadButton />
     </div>}
      {!isLoading && files?.length > 0 && (
<>
        <div className="w-full flex justify-between items-center">
      <h1 className="text-4xl font-bold">Your Files</h1>
      <UploadButton />
      
      </div>
      <div className="w-full p-2 flex flex-wrap gap-3 justify-center  mt-10 ">
        
      {files?.map((file) => {
        return <FileCard key={file?._id} file={file} />
      })}
      </div>
      </>
      )}
      
    </main>
  );
}
