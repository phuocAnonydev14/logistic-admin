"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'
import {useUploadThing} from "@/app/utils/uploadthing";

interface HTMLRichTextEditorProps {
	value: string
	onChange: (value: string) => void
}

export function HTMLRichTextEditor({ value, onChange }: HTMLRichTextEditorProps) {
	const quillRef = useRef<ReactQuill>(null)
	const [uploadedImages, setUploadedImages] = useState<string[]>([])
	
	// Đăng ký module imageResize
	ReactQuill.Quill.register('modules/imageResize', ImageResize)
	
	// Sử dụng uploadThing hooks
	const { startUpload } = useUploadThing("imageUploader") // Thay "imageUploader" bằng endpoint của bạn
	
	// Hàm kiểm tra xem một URL có phải là từ uploadthing không
	const isUploadthingUrl = (url: string): boolean => {
		return url.includes('utfs.io/f/');
	}
	
	// Hàm xóa ảnh từ uploadthing
	const deleteImage = async (imageUrl: string) => {
		try {
			// Trích xuất fileKey từ URL của utfs.io
			const fileKey = imageUrl.split('/f/')[1];
			
			// Gọi API endpoint để xóa ảnh
			const response = await fetch('/api/uploadthing/delete', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ fileKey }),
			})
			
			if (!response.ok) {
				console.error('Failed to delete image:', await response.text())
			}
		} catch (error) {
			console.error('Error deleting image:', error)
		}
	}
	
	// Hàm theo dõi sự thay đổi của nội dung
	const handleChange = (newValue: string) => {
		onChange(newValue)
		
		// Phân tích các ảnh trong nội dung mới
		const imgRegex = /<img[^>]+src="([^">]+)"/g
		const currentImages: string[] = []
		let match
		
		while ((match = imgRegex.exec(newValue)) !== null) {
			// Chỉ thêm ảnh từ uploadthing (utfs.io)
			if (isUploadthingUrl(match[1])) {
				currentImages.push(match[1])
			}
		}
		
		// Tìm ảnh đã bị xóa khỏi nội dung
		uploadedImages.forEach(oldImage => {
			if (!currentImages.includes(oldImage)) {
				// Ảnh không còn trong nội dung mới - xóa nó
				deleteImage(oldImage)
			}
		})
		
		// Cập nhật danh sách ảnh hiện tại
		setUploadedImages(currentImages)
	}
	
	// Định nghĩa hàm xử lý upload ảnh
	const imageHandler = async () => {
		const input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('accept', 'image/*')
		input.click()
		
		input.onchange = async () => {
			if (!input.files || input.files.length === 0) return
			
			try {
				// Hiển thị trạng thái đang tải
				const editor = quillRef.current?.getEditor()
				if (!editor) return
				
				const range = editor.getSelection(true)
				const placeholder = '[Đang tải ảnh...]'
				editor.insertText(range.index, placeholder)
				
				// Upload file bằng uploadthing
				// @ts-ignore
				const [res] = await startUpload(Array.from(input.files))
				
				// Xóa placeholder và chèn ảnh từ URL
				editor.deleteText(range.index, placeholder.length)
				editor.insertEmbed(range.index, 'image', res.url)
				
				// Thêm URL vào danh sách ảnh đã tải lên
				setUploadedImages(prev => [...prev, res.url])
			} catch (error) {
				console.error('Error uploading image:', error)
			}
		}
	}
	
	// Phân tích nội dung ban đầu để lấy danh sách ảnh
	useEffect(() => {
		if (!value) return
		
		const imgRegex = /<img[^>]+src="([^">]+)"/g
		const initialImages: string[] = []
		let match
		
		while ((match = imgRegex.exec(value)) !== null) {
			if (isUploadthingUrl(match[1])) {
				initialImages.push(match[1])
			}
		}
		
		setUploadedImages(initialImages)
	}, []) // Chỉ chạy một lần khi component được tạo
	
	// Định nghĩa modules với handler tùy chỉnh cho hình ảnh
	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, 3, false] }],
					['bold', 'italic', 'underline', 'strike'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['link', 'image', 'video'],
					['emoji'],
					['clean'],
				],
				handlers: {
					image: imageHandler
				}
			},
			imageResize: {},
		}),
		[]
	)
	
	return (
		<div className="min-h-max">
			<ReactQuill
				ref={quillRef}
				theme="snow"
				value={value}
				onChange={handleChange}
				modules={modules}
				className="min-h-64"
			/>
		</div>
	)
}