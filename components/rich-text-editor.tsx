"use client"

import { useEffect, useState } from "react"
import { Bold, Italic, Link, List, ListOrdered, Underline } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Textarea className={cn("min-h-[200px]", className)} placeholder="Loading editor..." disabled />
  }

  const handleFormat = (format: string) => {
    // This is a simplified implementation
    // In a real app, you would use a proper rich text editor library
    let newValue = value

    switch (format) {
      case "bold":
        newValue = `**${value}**`
        break
      case "italic":
        newValue = `*${value}*`
        break
      case "underline":
        newValue = `_${value}_`
        break
      case "link":
        newValue = `[${value}](https://example.com)`
        break
      case "list":
        newValue = `\n- Item 1\n- Item 2\n- Item 3`
        break
      case "ordered-list":
        newValue = `\n1. Item 1\n2. Item 2\n3. Item 3`
        break
      default:
        break
    }

    onChange(newValue)
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("bold")}>
                <Bold className="h-4 w-4" />
                <span className="sr-only">Bold</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("italic")}>
                <Italic className="h-4 w-4" />
                <span className="sr-only">Italic</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("underline")}>
                <Underline className="h-4 w-4" />
                <span className="sr-only">Underline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("link")}>
                <Link className="h-4 w-4" />
                <span className="sr-only">Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("list")}>
                <List className="h-4 w-4" />
                <span className="sr-only">Bullet List</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleFormat("ordered-list")}>
                <ListOrdered className="h-4 w-4" />
                <span className="sr-only">Numbered List</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your content here..."
        className="min-h-[200px] border-0 focus-visible:ring-0"
      />
    </div>
  )
}

