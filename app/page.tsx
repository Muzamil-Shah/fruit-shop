'use client'
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInButton, useSession, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {

  const session = useSession()
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded){
    orgId = organization?.organization?.id ?? user?.user?.id
  }
  const getFiles = useQuery(api.files.getFiles, orgId ?{orgId} : 'skip')
  const createFile = useMutation(api.files.createFile)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
      <SignInButton mode="modal">

      <Button>Sign In</Button>
      </SignInButton>
      </SignedOut>

      {getFiles?.map((file) => {
        return <div key={file?._id}>{file?.name}</div>
      })}
      <Button onClick={() => {
        if(!orgId) return 
        createFile({
          name: 'hello world',
          orgId
        })
      }}>Click me</Button>
    </main>
  );
}
