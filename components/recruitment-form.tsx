"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {RecruitmentType} from "@/types/recruitment.type";
import {recruitmentService} from "@/services/recruitment.service";

interface RecruitmentFormProps {
	initialData?: RecruitmentType;
	isEditing?: boolean;
}

export function RecruitmentForm({ initialData, isEditing = false }: RecruitmentFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<Omit<RecruitmentType, "id" | "createdAt" | "updatedAt">>({
		title: "",
		description: "",
		salary: "",
		deadline: "",
		location: "",
		requirements: [""],
		benefits: [""],
	});
	
	// Lấy dữ liệu ban đầu nếu đang edit
	useEffect(() => {
		if (initialData && isEditing) {
			setFormData({
				title: initialData.title,
				description: initialData.description,
				salary: initialData.salary,
				deadline: initialData.deadline,
				location: initialData.location,
				requirements: initialData.requirements.length > 0 ? initialData.requirements : [""],
				benefits: initialData.benefits.length > 0 ? initialData.benefits : [""],
			});
		}
	}, [initialData, isEditing]);
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	
	const handleArrayChange = (type: "requirements" | "benefits", index: number, value: string) => {
		setFormData((prev) => {
			const newArray = [...prev[type]];
			newArray[index] = value;
			return { ...prev, [type]: newArray };
		});
	};
	
	const addArrayItem = (type: "requirements" | "benefits") => {
		setFormData((prev) => ({
			...prev,
			[type]: [...prev[type], ""],
		}));
	};
	
	const removeArrayItem = (type: "requirements" | "benefits", index: number) => {
		setFormData((prev) => {
			const newArray = [...prev[type]];
			newArray.splice(index, 1);
			return { ...prev, [type]: newArray.length ? newArray : [""] };
		});
	};
	
	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setFormData((prev) => ({
				...prev,
				deadline: format(date, "yyyy-MM-dd"),
			}));
		}
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		try {
			// Xử lý dữ liệu trước khi gửi
			const dataToSubmit = {
				...formData,
				requirements: formData.requirements.filter(item => item.trim() !== ""),
				benefits: formData.benefits.filter(item => item.trim() !== ""),
			};
			
			if (isEditing && initialData) {
				await recruitmentService.updateRecruitment(initialData.id, dataToSubmit);
			} else {
				await recruitmentService.createRecruitment(dataToSubmit);
			}
			
			router.push("/dashboard/recruitment");
			router.refresh();
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	
	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>{isEditing ? "Chỉnh sửa thông tin tuyển dụng" : "Thêm thông tin tuyển dụng mới"}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Tiêu đề</Label>
						<Input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							placeholder="Nhập tiêu đề tuyển dụng"
							required
						/>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="description">Mô tả</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Mô tả chi tiết về vị trí tuyển dụng"
							required
							rows={4}
						/>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="salary">Mức lương</Label>
							<Input
								id="salary"
								name="salary"
								value={formData.salary}
								onChange={handleChange}
								placeholder="Ví dụ: 1000$ - 2000$"
								required
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="deadline">Hạn chót</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!formData.deadline && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{formData.deadline ? format(new Date(formData.deadline), "dd/MM/yyyy") : "Chọn ngày"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={formData.deadline ? new Date(formData.deadline) : undefined}
										onSelect={handleDateSelect}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					
					<div className="space-y-2">
						<Label htmlFor="location">Địa điểm</Label>
						<Input
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							placeholder="Địa điểm làm việc"
							required
						/>
					</div>
					
					<div className="space-y-2">
						<Label>Yêu cầu</Label>
						{formData.requirements.map((req, index) => (
							<div key={`req-${index}`} className="flex gap-2">
								<Input
									value={req}
									onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
									placeholder="Nhập yêu cầu cho vị trí"
								/>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => removeArrayItem("requirements", index)}
									disabled={formData.requirements.length === 1}
								>
									-
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => addArrayItem("requirements")}
						>
							Thêm yêu cầu
						</Button>
					</div>
					
					<div className="space-y-2">
						<Label>Quyền lợi</Label>
						{formData.benefits.map((benefit, index) => (
							<div key={`benefit-${index}`} className="flex gap-2">
								<Input
									value={benefit}
									onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
									placeholder="Nhập quyền lợi cho vị trí"
								/>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => removeArrayItem("benefits", index)}
									disabled={formData.benefits.length === 1}
								>
									-
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => addArrayItem("benefits")}
						>
							Thêm quyền lợi
						</Button>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/dashboard/recruitment")}
					>
						Hủy
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo mới"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}