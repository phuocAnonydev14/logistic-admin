import {PropsWithChildren} from "react";
import {DashboardLayout} from "@/components/dashboard-layout";

export default function layout({children}: PropsWithChildren) {
	return <DashboardLayout>
		{children}
	</DashboardLayout>
}