"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Trash2, Eye, Search, Plus } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {RecruitmentType} from "@/types/recruitment.type";
import {recruitmentService} from "@/services/recruitment.service";

interface RecruitmentListProps {
	initialData: RecruitmentType[];
}

export function RecruitmentList({ initialData }: RecruitmentListProps) {
	const router = useRouter();
	const [recruitments, setRecruitments] = useState<RecruitmentType[]>(initialData);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [recruitmentToDelete, setRecruitmentToDelete] = useState<number | null>(null);
	
	const handleSearch = async () => {
		if (searchQuery.trim() === "") {
			const allData = await recruitmentService.getAllRecruitment({limit:1000});
			setRecruitments(allData);
		} else {
			const results = recruitments.filter(item => item.title.includes(searchQuery));
			setRecruitments(results || ([] as RecruitmentType[]));
		}
	};
	
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};
	
	const confirmDelete = (id: number) => {
		setRecruitmentToDelete(id);
		setDeleteDialogOpen(true);
	};
	
	const handleDelete = async () => {
		if (recruitmentToDelete) {
			await recruitmentService.deleteRecruitment(recruitmentToDelete);
			const updatedData = recruitments.filter(item => item.id !== recruitmentToDelete);
			setRecruitments(updatedData);
			setDeleteDialogOpen(false);
			setRecruitmentToDelete(null);
		}
	};
	
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Danh sách tuyển dụng</h2>
				<Button onClick={() => router.push("/dashboard/recruitment/add")}>
					<Plus className="mr-2 h-4 w-4" /> Thêm mới
				</Button>
			</div>
			
			<div className="flex gap-2">
				<Input
					placeholder="Tìm kiếm theo tiêu đề, mô tả, địa điểm..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					className="max-w-md"
				/>
				<Button variant="outline" onClick={handleSearch}>
					<Search className="h-4 w-4" />
				</Button>
			</div>
			
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tiêu đề</TableHead>
							<TableHead>Địa điểm</TableHead>
							<TableHead>Mức lương</TableHead>
							<TableHead>Hạn chót</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recruitments.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-6">
									Không có dữ liệu
								</TableCell>
							</TableRow>
						) : (
							recruitments.map((recruitment) => (
								<TableRow key={recruitment.id}>
									<TableCell className="font-medium">{recruitment.title}</TableCell>
									<TableCell>{recruitment.location}</TableCell>
									<TableCell>{recruitment.salary}</TableCell>
									<TableCell>
										{format(new Date(recruitment.deadline), "dd/MM/yyyy")}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => router.push(`/dashboard/recruitment/${recruitment.id}`)}
												>
													<Eye className="mr-2 h-4 w-4" />
													Xem chi tiết
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => router.push(`/dashboard/recruitment/${recruitment.id}/edit`)}
												>
													<Edit className="mr-2 h-4 w-4" />
													Chỉnh sửa
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => confirmDelete(recruitment.id)}
													className="text-red-500 focus:text-red-500"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Xóa
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa thông tin tuyển dụng này? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}