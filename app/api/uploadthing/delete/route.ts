// app/api/uploadthing/delete/route.ts
import { UTApi } from "uploadthing/server";
import { NextRequest, NextResponse } from "next/server";

const utapi = new UTApi();

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json();
		const { fileKey } = body;
		
		if (!fileKey) {
			return NextResponse.json(
				{ error: "fileKey is required" },
				{ status: 400 }
			);
		}
		
		await utapi.deleteFiles(fileKey);
		
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting file:", error);
		return NextResponse.json(
			{ error: "Failed to delete file" },
			{ status: 500 }
		);
	}
}