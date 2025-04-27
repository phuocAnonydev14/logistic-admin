import {RecruitmentForm} from "@/components/recruitment-form";

export default function AddRecruitmentPage() {
	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Thêm thông tin tuyển dụng</h1>
			<RecruitmentForm />
		</div>
	);
}