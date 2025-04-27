import {BaseEntity} from "@/types/app.type";

export interface RecruitmentType extends BaseEntity {
	title: string
	description: string
	salary: string
	deadline: string
	location: string
	requirements: string[]
	benefits: string[]
}