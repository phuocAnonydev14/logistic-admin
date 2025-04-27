"use client"

import { useState, useEffect } from "react";
import { UploadButton } from "@/app/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import axios from "axios";
import {categoryService} from "@/services/category.service";
import {Button} from "@/components/ui/button";

interface ImagePreviewProps {
  setFilekey: (data: ClientUploadedFileData<{
    uploadedBy: string;
  }> | null) => void;
  initialImage?: string; // Optional initial image URL from props
  initialFileData?: ClientUploadedFileData<{
    uploadedBy: string;
  }> | null; // Optional initial file data
  additionalPayload?: Record<string, any>; // Optional additional payload
}

export const ImageUploadPreview = ({ 
  setFilekey, 
  initialImage, 
  initialFileData ,
                                     additionalPayload
}: ImagePreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [fileData, setFileData] = useState<ClientUploadedFileData<{
    uploadedBy: string;
  }> | null>(initialFileData || null);
  const [loading, setLoading] = useState(false)

  // Update state when props change
  useEffect(() => {
    if (initialImage) {
      setImageUrl(initialImage);
    }
    if (initialFileData) {
      setFileData(initialFileData);
    }
  }, [initialImage, initialFileData]);

  const handleUploadComplete = async (result: ClientUploadedFileData<{
    uploadedBy: string;
  }>[]) => {
    try{
    setLoading(true)
      const uploadedFile = result[0];
      setImageUrl(uploadedFile.url);
      setFileData(uploadedFile);
      setFilekey(uploadedFile);
      await categoryService.addImage({...additionalPayload, fileKey: uploadedFile.key, imageUrl: uploadedFile.ufsUrl});
    }
    catch (error) {
      console.error("Error uploading image:", error);
    }finally {
      setLoading(false)
    }
  };

  const handleDeleteImage = async () => {
    try{
      setLoading(true)
      await axios.delete(`/api/delete-file?fileKey=${fileData?.key}`);
      await categoryService.deleteImage(fileData?.key || '');
      setImageUrl(null);
      setFileData(null);
      setFilekey(null);
    }catch (e) {
      console.error(e)
    }finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative w-full overflow-hidden rounded-lg border h-max">
            <img
              src={imageUrl} 
              alt="Preview" 
              className="object-cover w-full h-auto"
            />
          </div>
          <Button
            variant="destructive"
            type="button"
            size="icon"
            onClick={handleDeleteImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            aria-label="Delete image"
            disabled={loading}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Upload an image</p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`Upload error: ${error.message}`);
              }}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};