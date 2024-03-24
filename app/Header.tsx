import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="mx-auto px-4  flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image width={40} height={40} alt="logo" src="/logo.png" />
          Filo FD
        </Link>
        <div className="flex justify-end items-center space-x-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
