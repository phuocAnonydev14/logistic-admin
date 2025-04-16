"use client"

import {useEffect, useState} from "react";
import {Category} from "@/types/app.type";
import {categoryService} from "@/services/category.service";

export const useCategory = () => {
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(false)
	
	useEffect(() => {
		(async () => {
			try{
				setIsLoading(true)
				const res = await categoryService.getAllCategories({limit:1000})
				setCategories(res)
			}catch (e) {
				console.log(e)
			}finally {
				setIsLoading(false)
			}
		})()
	}, []);
	
	return {categories, isLoading, setCategories} as const
}