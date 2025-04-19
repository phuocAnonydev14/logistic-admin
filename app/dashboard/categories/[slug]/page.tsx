"use client"

import type React from "react"

import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import {zodResolver} from "@hookform/resolvers/zod"
import {ImagePlus, Languages, Trash} from "lucide-react"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {DashboardLayout} from "@/components/dashboard-layout"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {categoryService} from "@/services/category.service";
import {toast} from "sonner";
import {Category} from "@/types/app.type"
import {ImageUploadPreview} from "@/components/uploadthing-button"
import {ClientUploadedFileData} from "uploadthing/types"
import dynamic from "next/dynamic";

const HTMLRichTextEditor = dynamic(() => import("@/components/HTMLString"), {
	ssr: false,
})

const languages = [
	{code: "en", name: "English"},
	{code: "vi", name: "Vietnamese"},
]

// Form schema
const formSchema = z.object({
	name: z.string().min(1, "Vietnamese name is required"),
	description: z.string().min(1, "Vietnamese description is required"),
	content: z.string().min(1, "Vietnamese content is required"),
})

export default function EditCategoryPage() {
	const router = useRouter()
	const {slug}: { slug: string } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [category, setCategory] = useState<Category | null>(null);
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
	
	useEffect(() => {
		// Simulate API call
		setIsLoading(true);
		(async () => {
			if (!slug) return
			const category: Category = await categoryService.getCategoryDetail(slug as string);
			setCategory(category)
			if (category) {
				// Set form values
				form.reset({
					name: category.name,
					description: category.description,
					content: category.content,
				});
				if (category.thumbnail) {
					setFilekey({key: category.thumbnail.fileKey || '', ufsUrl: category.thumbnail.imageUrl} as any)
				}
			} else {
				toast("Category not found",);
				router.push("/dashboard/products");
			}
			
			setIsLoading(false);
		})()
	}, [slug, form, router, toast]);
	
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await categoryService.updateCategory(category?.id || 1,values)
		// Here you would normally submit the form data to your API
		console.log("Submitting product:", {
			...values,
		})
		
		toast(
			"Category updated",
		)
		
		// Redirect to products list
		router.push("/dashboard/categories")
	}
	
	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="flex h-[50vh] items-center justify-center">
					<div className="text-center">
						<h2 className="text-lg font-medium">Loading category data...</h2>
						<p className="text-sm text-muted-foreground">
							Please wait while we fetch the category information.
						</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}
	
	return (
		<DashboardLayout>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Update Category</h2>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.push("/dashboard/products")}>
							Cancel
						</Button>
						<Button onClick={form.handleSubmit(onSubmit)}>Update Category</Button>
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
												<FormLabel className="text-2xl font-medium">Category Name</FormLabel>
												<FormControl>
													<Input placeholder="Enter product name" {...field} />
												</FormControl>
												<FormMessage/>
											</FormItem>
										)}
									/>
								
								</div>
							</CardContent>
						</Card>
						<ImageUploadPreview
							initialImage={filekey?.ufsUrl || ''}
							setFilekey={(data) => setFilekey(data)}
							initialFileData={filekey}
							additionalPayload={{categoryId: category?.id}}/>
						
						
						<Card className="md:col-span-2">
							<CardContent className="pt-6">
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="description"
										render={({field}) => (
											<FormItem>
												<FormLabel className="text-2xl font-medium">Category Description</FormLabel>
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
												<FormLabel className="text-2xl font-medium">Category Content</FormLabel>
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