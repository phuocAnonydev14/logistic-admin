"use client"

import {useEffect, useState} from "react";
import {Category} from "@/types/app.type";
import {categoryService} from "@/services/category.service";
import {appointmentService} from "@/services/appointment.service";
import {Appointment} from "@/types/appointment";

export const useAppointment = () => {
	const [appointment, setAppointment] = useState<Appointment[]>([])
	const [isLoading, setIsLoading] = useState(false)
	
	useEffect(() => {
		(async () => {
			try{
				setIsLoading(true)
				const res = await appointmentService.getAppointment({limit:1000})
				setAppointment(res as Appointment[])
			}catch (e) {
				console.log(e)
			}finally {
				setIsLoading(false)
			}
		})()
	}, []);
	
	return {appointment, isLoading, setAppointment} as const
}