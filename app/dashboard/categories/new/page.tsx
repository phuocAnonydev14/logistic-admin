"use client"
import type React from "react"

import { useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {DashboardLayout} from "@/components/dashboard-layout"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import "react-quill/dist/quill.snow.css"
import {categoryService} from "@/services/category.service";
import {toast} from "sonner";
import {ImageUploadPreview} from "@/components/uploadthing-button"
import {ClientUploadedFileData} from "uploadthing/types"
import dynamic from "next/dynamic";
import {Textarea} from "@/components/ui/textarea";
const HTMLRichTextEditor = dynamic(() => import("@/components/HTMLString").then(res => res.HTMLRichTextEditor), {
	ssr: false,
})

// Form schema
const formSchema = z.object({
	name: z.string().min(1, "Vietnamese name is required"),
	description: z.string().min(1, "Vietnamese description is required"),
	content: z.string().min(1, "Vietnamese content is required"),
})

export default function EditCategoryPage() {
	const router = useRouter()
	const [filekey, setFilekey] = useState<ClientUploadedFileData<{
		uploadedBy: string;
	}> | any>(null);
	
	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			content: ""
		},
	})
	
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		
		try{
			await categoryService.createCategory({...values, imageUrl: filekey?.ufsUrl, fileKey: filekey?.key})
			
			// Here you would normally submit the form data to your API
			console.log("Submitting Category:", {
				...values,
			})
			
			toast(
				"Category updated",
			)
			
			// Redirect to Categories list
			router.push("/dashboard/categories")
		}catch (e) {
			console.error(e)
		}
	}
	
	
	return (
		<DashboardLayout>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Add New Category</h2>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.push("/dashboard/Categories")}>
							Cancel
						</Button>
						<Button onClick={form.handleSubmit(onSubmit)}>Add Category</Button>
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
										name="name"
										render={({field}) => (
											<FormItem>
												<FormLabel>Category Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter Category name" {...field} />
												</FormControl>
												<FormMessage/>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({field}) => (
											<FormItem>
												<FormLabel>Category Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter category descripton" {...field}
													/>
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
										name="content"
										render={({field}) => (
											<FormItem>
												<FormLabel>Category Content</FormLabel>
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