import { UTApi } from "uploadthing/server";
import { z } from "zod";
import {NextRequest, NextResponse} from "next/server";

// Create schema for request validation
const DeleteFileSchema = z.object({
	fileKey: z.string().min(1, "File key is required"),
});


// Admin authentication middleware (simplified)
const isAdmin = async (req: NextRequest) => {
	// Implement your admin authentication logic here
	// For example, check for admin token in headers
	const authHeader = req.headers.get("authorization");
	
	// This is a placeholder - replace with your actual admin auth logic
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return false;
	}
	
	// Verify the token and check if user is admin
	// const token = authHeader.split(" ")[1];
	// const isAdminUser = await verifyAdminToken(token);
	
	// For now, return true for demonstration
	return true;
};

export async function DELETE(req: NextRequest) {
	try {
		console.log("process.env.UPLOADTHING_TOKE", process.env.UPLOADTHING_TOKEN)
		// Parse request body
		const url = new URL(req.url);
		const fileKey = url.searchParams.get("fileKey");
		
// Initialize the UTApi with your API key
		const utApi = new UTApi();

		
		// Delete the file using UTApi
		const result = await utApi.deleteFiles(fileKey || '');
		
		return NextResponse.json(
			{
				success: true,
				message: "File deleted successfully",
				result
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting file:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to delete file",
				details: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}