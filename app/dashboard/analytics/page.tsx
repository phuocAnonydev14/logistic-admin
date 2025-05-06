"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {useCategory} from "@/hooks/use-category";

export default function AnalyticsPage() {
	
	const {categories} = useCategory()
	
	return (
		<DashboardLayout>
			<div className="flex flex-col space-y-6">
				<h2 className="text-2xl font-bold">Analytics</h2>
				<Card>
					<CardHeader>
						<CardTitle>Page Views</CardTitle>
						<CardDescription>Detailed breakdown of page views and unique visitors.</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Page</TableHead>
									<TableHead className="text-right">Views</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{categories?.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium">{item.name}</TableCell>
										<TableCell className="text-right">{item.view.toLocaleString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	)
}

