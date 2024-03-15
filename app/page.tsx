'use client'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInButton, useSession, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
 
const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, 'Required')
})
export default function Home() {

  const session = useSession()
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api?.files?.generateUploadUrl)
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    if(!orgId) return 
    const postUrl = await generateUploadUrl()

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: {"Content-Type": values?.file[0].type},
      body: values?.file[0]
    })

    const { storageId } = await result.json();

    try{
      await createFile({
        name: values?.title,
        fileId: storageId,
        orgId
      })
      form.reset();
      setIsDialoadOpen(false)
      toast({
        variant: 'success',
        title:"File Uploaded",
        description: "Now everyone can view your file"
      })
    }catch(err){
      toast({
        variant: 'destructive',
        title:"Somthing went wrong",
        description: "Your file could not be uploaded, try again later"
      })
    } 
    
       
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined
    },
  })

  const [isDialogOpen,setIsDialoadOpen] = useState(false)

  const fileRef = form?.register("file")

  let orgId: string | undefined = undefined;
  if (organization?.isLoaded && user?.isLoaded){
    orgId = organization?.organization?.id ?? user?.user?.id
  }
  const getFiles = useQuery(api.files.getFiles, orgId ?{orgId} : 'skip')
  const createFile = useMutation(api.files.createFile)
  return (
    <main className="conatiner mx-auto pt-12 px-2">
      <div className="w-full flex justify-between items-center">
      <h1 className="text-4xl font-bold">File Name</h1>
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {setIsDialoadOpen(isOpen); 
        form?.reset()}} >
  <DialogTrigger asChild><Button>Uplaod File</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload your file here?</DialogTitle>
      <DialogDescription> 
      <Form {...form}> 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="enter your file title" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input type="file" {...fileRef}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form?.formState?.isSubmitting}>{form?.formState?.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit</Button>
      </form>
    </Form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      
      </div>
      {getFiles?.map((file) => {
        return <div key={file?._id}>{file?.name}</div>
      })}
      
    </main>
  );
}
