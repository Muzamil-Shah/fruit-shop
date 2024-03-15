import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function Header(){
    return <div className="border-b py-4 bg-gray-50">
        <div className="container mx-auto flex justify-between items-center">
            FileDrive
            <div className="flex justify-end items-center space-x-2"><OrganizationSwitcher />
            <UserButton />
            </div>
        </div>
    </div>
}