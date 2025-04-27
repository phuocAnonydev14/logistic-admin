import {recruitmentService} from "@/services/recruitment.service";
import {RecruitmentList} from "@/components/recruitment-list";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
	const recruitments = await recruitmentService.getAllRecruitment({limit:1000});
	
	return (
		<div className="container mx-auto py-6">
			<RecruitmentList initialData={recruitments} />
		</div>
	);
}