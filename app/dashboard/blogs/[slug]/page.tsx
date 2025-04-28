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
import {Textarea} from "@/components/ui/textarea";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

const HTMLRichTextEditor = dynamic(() => import("@/components/HTMLString").then(res => res.HTMLRichTextEditor), {ssr: false})

// Form schema
const formSchema = z.object({
	title: z.string().min(1, "Vietnamese name is required"),
	desc: z.string().min(1, "Vietnamese desc is required"),
	content: z.string().min(1, "Vietnamese content is required"),
})

export default function EditBlogPage() {
	const router = useRouter()
	const {slug}: { slug: string } = useParams();
	const [blog, setBlog] = useState<BlogType | null>(null);
	const [filekey, setFilekey] = useState<ClientUploadedFileData<{
		uploadedBy: string;
	}> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [tag, setTag] = useState("")
	
	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			desc: "",
			content: ""
		},
	})
	
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		
		try {
			await blogService.updateBlog(blog?.id || 0, {...values, imageUrl: filekey?.ufsUrl, fileKey: filekey?.key, tag})
			
			// Here you would normally submit the form data to your API
			console.log("Submitting blog:", {
				...values,
			})
			
			toast(
				"Blog updated",
			)
			
			// Redirect to blogs list
			router.push("/dashboard/blogs")
		} catch (e) {
			console.error(e)
		}
	}
	
	useEffect(() => {
		// Simulate API call
		setIsLoading(true);
		(async () => {
			if (!slug) return
			const blog: BlogType = await blogService.getBlogDetail(slug as string);
			setBlog(blog)
			if (blog) {
				// Set form values
				form.reset({
					title: blog.title,
					desc: blog.desc,
					content: blog.content,
				});
				setTag(blog.tag as any || "internal")
				if (blog.thumbnail) {
					setFilekey({key: blog.thumbnail.fileKey || '', ufsUrl: blog.thumbnail.imageUrl} as any)
				}
			} else {
				toast("Blog not found",);
				router.push("/dashboard/blogs");
			}
			
			setIsLoading(false);
		})()
	}, [slug, form, router, toast]);
	
	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="flex h-[50vh] items-center justify-center">
					<div className="text-center">
						<h2 className="text-lg font-medium">Loading blog data...</h2>
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
					<h2 className="text-2xl font-bold">Edit Blog</h2>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.push("/dashboard/blogs")}>
							Cancel
						</Button>
						<Button onClick={form.handleSubmit(onSubmit)}>Edit Blog</Button>
					</div>
				</div>
				
				<Form {...form}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Basic Information */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div>
										<RadioGroup defaultValue="interal" onValueChange={val => setTag(val)}>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="internal" id="option-one"/>
												<Label htmlFor="internal">Tin công ty</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="external" id="option-two"/>
												<Label htmlFor="external">Tin ngành</Label>
											</div>
										</RadioGroup>
									</div>
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
									<FormField
										control={form.control}
										name="desc"
										render={({field}) => (
											<FormItem>
												<FormLabel>Blog Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter blog description" {...field}
													/>
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
							additionalPayload={{blogId: blog?.id}}
						/>
						<Card className="md:col-span-2">
							<CardContent className="pt-6">
								<div className="space-y-4">
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