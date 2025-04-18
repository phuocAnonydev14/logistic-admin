"use client"

import {PropsWithChildren} from "react";
import {getCookie} from "cookies-next";
import {EToken} from "@/lib/enum/app.enum";
import {useRouter} from "next/navigation";

export default function Layout({children}: PropsWithChildren) {
	
	const token = getCookie(EToken.ACCESS_TOKEN)
	const router = useRouter()
	// if(!token) {
	// 	console.log("token", token)
	// 	router.push("/login")
	// }
	
	return <div>
		{children}
	</div>
}