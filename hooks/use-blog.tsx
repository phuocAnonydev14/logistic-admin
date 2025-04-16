"use client"

import {useEffect, useState} from "react";
import {blogService} from "@/services/blog.service";
import {BlogType} from "@/types/blog.type";

export const useBlog = () => {
	const [blogs, setBlogs] = useState<BlogType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	
	useEffect(() => {
		(async () => {
			try{
				setIsLoading(true)
				const res = await blogService.getAllBlogs({limit:1000})
				setBlogs(res)
			}catch (e) {
				console.log(e)
			}finally {
				setIsLoading(false)
			}
		})()
	}, []);
	
	return {blogs, isLoading, setBlogs} as const
}