import { DashboardLayout } from "@/components/dashboard-layout"
import {redirect} from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/blogs")
  return (
    <DashboardLayout>
    <div></div>
    </DashboardLayout>
  )
}

