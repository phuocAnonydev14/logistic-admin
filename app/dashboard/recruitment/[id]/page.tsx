import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Edit } from "lucide-react";
import {recruitmentService} from "@/services/recruitment.service";

interface RecruitmentDetailPageProps {
	params: any
}

export default async function RecruitmentDetailPage({ params }: RecruitmentDetailPageProps) {
	const id = (await  params).id as string;
	const recruitment = await recruitmentService.getRecruitmentDetail(params.id);
	
	if (!recruitment) {
		notFound();
	}
	
	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Button variant="outline" size="sm" asChild>
					<Link href="/dashboard/recruitment">
						<ChevronLeft className="mr-2 h-4 w-4" />
						Quay lại
					</Link>
				</Button>
				<h1 className="text-2xl font-bold ml-4">Chi tiết tuyển dụng</h1>
			</div>
			
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl">{recruitment.title}</CardTitle>
					<Button variant="outline" size="sm" asChild>
						<Link href={`/dashboard/recruitment/${params.id}/edit`}>
							<Edit className="mr-2 h-4 w-4" />
							Chỉnh sửa
						</Link>
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="font-medium mb-1">Mô tả công việc</h3>
						<p className="text-gray-700">{recruitment.description}</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="font-medium mb-1">Mức lương</h3>
							<p className="text-gray-700">{recruitment.salary}</p>
						</div>
						<div>
							<h3 className="font-medium mb-1">Địa điểm</h3>
							<p className="text-gray-700">{recruitment.location}</p>
						</div>
						<div>
							<h3 className="font-medium mb-1">Hạn nộp hồ sơ</h3>
							<p className="text-gray-700">{format(new Date(recruitment.deadline), "dd/MM/yyyy")}</p>
						</div>
						<div>
							<h3 className="font-medium mb-1">Ngày đăng</h3>
							<p className="text-gray-700">{format(new Date(recruitment.createdAt), "dd/MM/yyyy")}</p>
						</div>
					</div>
					
					<div>
						<h3 className="font-medium mb-2">Yêu cầu</h3>
						<ul className="list-disc pl-5 space-y-1">
							{recruitment.requirements.map((req, index) => (
								<li key={index} className="text-gray-700">{req}</li>
							))}
						</ul>
					</div>
					
					<div>
						<h3 className="font-medium mb-2">Quyền lợi</h3>
						<ul className="list-disc pl-5 space-y-1">
							{recruitment.benefits.map((benefit, index) => (
								<li key={index} className="text-gray-700">{benefit}</li>
							))}
						</ul>
					</div>
				</CardContent>
				<CardFooter className="text-sm text-gray-500">
					Cập nhật lần cuối: {format(new Date(recruitment.updatedAt), "dd/MM/yyyy HH:mm")}
				</CardFooter>
			</Card>
		</div>
	);
}