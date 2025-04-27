import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {recruitmentService} from "@/services/recruitment.service";
import {RecruitmentForm} from "@/components/recruitment-form";

interface RecruitmentEditPageProps {
	params:any
}

export default async function RecruitmentEditPage({ params }: RecruitmentEditPageProps) {
	const id = (await  params).id
	const recruitment = await recruitmentService.getRecruitmentDetail(params.id);
	
	if (!recruitment) {
		notFound();
	}
	
	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<Link href={`/dashboard/recruitment/${params.id}`}>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Quay lại
					</Link>
				</Button>
				<h1 className="text-2xl font-bold ml-4">Chỉnh sửa thông tin tuyển dụng</h1>
			</div>
			
			<RecruitmentForm initialData={recruitment} isEditing={true} />
		</div>
	);
}