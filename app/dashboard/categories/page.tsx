"use client"

import {useState} from "react"
import {Edit, MoreHorizontal, Plus, Trash} from "lucide-react"

import {DashboardLayout} from "@/components/dashboard-layout"
import {Button} from "@/components/ui/button"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useToast} from "@/components/ui/use-toast"
import Link from "next/link";
import {useCategory} from "@/hooks/use-category";
import parse from "html-react-parser";
import {categoryService} from "@/services/category.service";
import axios from "axios";

export default function CategoriesPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const {toast} = useToast()
	const {categories, setCategories} = useCategory()
	
	
	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase()),
	)
	
	const handleDeleteCategory = async (id: number) => {
		try {
			await categoryService.deleteCategory(id)
			const category = categories.find((category) => category.id === +id)
			if(category?.thumbnail){
				await axios.delete(`/api/delete-file?fileKey=${category?.thumbnail?.fileKey}`);
			}
			setCategories(categories.filter((category) => category.id !== +id))
			
			toast({
				title: "Category deleted",
				description: "The category has been deleted successfully",
			})
		} catch (e) {
			console.error(e)
		}
	}
	
	return (
		<DashboardLayout>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Categories</h2>
					<Link href="/dashboard/categories/new">
						<Button>
							<Plus className="mr-2 h-4 w-4"/>
							Add Category
						</Button>
					</Link>
				</div>
				
				<div className="flex items-center gap-2">
					<Input
						placeholder="Search categories..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
				</div>
				
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCategories.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3} className="h-24 text-center">
										No categories found.
									</TableCell>
								</TableRow>
							) : (
								filteredCategories.map((category) => (
									<TableRow key={category.id}>
										<TableCell className="font-medium">{category?.name}</TableCell>
										<TableCell className="font-medium line-clamp-3 text-ellipsis">{parse(category?.description || '')}</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Open menu</span>
														<MoreHorizontal className="h-4 w-4"/>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator/>
													<DropdownMenuItem
													>
														<Link href={`/dashboard/categories/${category?.slug}`}
																	className="flex gap-2 items-center"
														>
															<Edit className="mr-2 h-4 w-4"/>
															Edit
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive focus:text-destructive"
														onClick={() => handleDeleteCategory(category.id)}
													>
														<Trash className="mr-2 h-4 w-4"/>
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		
		</DashboardLayout>
	)
}

