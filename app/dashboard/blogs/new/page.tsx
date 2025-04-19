"use client"

import type React from "react"

import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {DashboardLayout} from "@/components/dashboard-layout"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {toast} from "sonner";
import {ImageUploadPreview} from "@/components/uploadthing-button"
import {ClientUploadedFileData} from "uploadthing/types"
import {BlogType} from "@/types/blog.type";
import {blogService} from "@/services/blog.service";
import dynamic from "next/dynamic";

const HTMLRichTextEditor = dynamic(() => import("@/components/HTMLString"), {
  ssr: false,
})

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Vietnamese name is required"),
  description: z.string().min(1, "Vietnamese description is required"),
  content: z.string().min(1, "Vietnamese content is required"),
})

export default function EditBlogPage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const {slug}: { slug: string } = useParams();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); // Add state for the file
  const [filekey, setFilekey] = useState<ClientUploadedFileData<{
    uploadedBy: string;
  }> | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: ""
    },
  })
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try{
      await blogService.createBlog({...values, imageUrl: filekey?.ufsUrl, fileKey: filekey?.key})
      
      // Here you would normally submit the form data to your API
      console.log("Submitting blog:", {
        ...values,
      })
      
      toast(
        "Blog updated",
      )
      
      // Redirect to blogs list
      router.push("/dashboard/blogs")
    }catch (e) {
      console.error(e)
    }
  }
  
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Blog</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/blogs")}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>Add Blog</Button>
          </div>
        </div>
        
        <Form {...form}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Blog Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog name" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                
                </div>
              </CardContent>
            </Card>
            
            <ImageUploadPreview setFilekey={(data) => setFilekey(data)}/>
            
            
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Blog Description</FormLabel>
                        <FormControl>
                          <HTMLRichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Blog Content</FormLabel>
                        <FormControl>
                          <HTMLRichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  )
}