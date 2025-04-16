"use client"

import { useMemo } from "react"
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react'

interface HTMLRichTextEditorProps {
	value: string
	onChange: (value: string) => void
}

export function HTMLRichTextEditor({ value, onChange }: HTMLRichTextEditorProps) {
	
	ReactQuill.Quill.register('modules/imageResize', ImageResize)
	
	
	const modules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ list: 'ordered' }, { list: 'bullet' }],
				['link', 'image', 'video'],
				['emoji'],
				['clean'],
			],
			imageResize: {},
		}),
		[]
	)
	
	return (
		<div className="min-h-max">
			<ReactQuill
				theme="snow"
				value={value}
				onChange={onChange}
				modules={modules}
				className="min-h-64"
			/>
		</div>
	)
}