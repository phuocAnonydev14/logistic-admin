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
import parse from "html-react-parser";
import axios from "axios";
import {blogService} from "@/services/blog.service";
import {useBlog} from "@/hooks/use-blog";

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const {toast} = useToast()
  const {setBlogs, blogs} = useBlog()
  
  
  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || []
  
  const handleDeleteBlog = async (id: number) => {
    try {
      await blogService.deleteBlog(id)
      const blog = blogs.find((blog) => blog.id === +id)
      if(blog?.thumbnail){
        await axios.delete(`/api/delete-file?fileKey=${blog?.thumbnail?.fileKey}`);
      }
      setBlogs(blogs.filter((blog) => blog.id !== +id))
      
      toast({
        title: "Blog deleted",
        description: "The blog has been deleted successfully",
      })
    } catch (e) {
      console.error(e)
    }
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Blogs</h2>
          <Link href="/dashboard/blogs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4"/>
              Add Blog
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search blogs..."
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
                <TableHead>Tag</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell className="font-medium line-clamp-3 text-ellipsis">{parse(blog.desc || '')}</TableCell>
                    <TableCell>{blog?.tag}</TableCell>
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
                            <Link href={`/dashboard/blogs/${blog.slug}`}
                                  className="flex gap-2 items-center"
                            >
                              <Edit className="mr-2 h-4 w-4"/>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteBlog(blog.id)}
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

