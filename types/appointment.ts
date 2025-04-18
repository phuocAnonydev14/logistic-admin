import {BaseEntity, Category} from "@/types/app.type";

export interface Appointment  extends BaseEntity{
	name: string,
	email: string,
	phone: string,
	category: Category
	message: string
}