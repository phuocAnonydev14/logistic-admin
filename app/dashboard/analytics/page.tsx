"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {useCategory} from "@/hooks/use-category";

// Sample analytics data
const pageViews = [
  { id: "1", page: "Homepage", views: 12543, uniqueVisitors: 8721 },
  { id: "2", page: "Products Listing", views: 8932, uniqueVisitors: 6254 },
  { id: "3", page: "Product Detail: Ergonomic Chair", views: 4521, uniqueVisitors: 3245 },
  { id: "4", page: "Product Detail: Wireless Headphones", views: 3876, uniqueVisitors: 2987 },
  { id: "5", page: "Blog: 10 Tips for Better Product Photography", views: 2543, uniqueVisitors: 1876 },
  { id: "6", page: "Blog: The Future of E-commerce in 2023", views: 2187, uniqueVisitors: 1654 },
  { id: "7", page: "Contact Us", views: 1543, uniqueVisitors: 1321 },
  { id: "8", page: "About Us", views: 1243, uniqueVisitors: 1087 },
]

export default function AnalyticsPage() {
  
  const {categories} = useCategory()
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>

        {/*<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold">37,388</div>*/}
        {/*      <p className="text-xs text-muted-foreground">+12.5% from last month</p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold">27,145</div>*/}
        {/*      <p className="text-xs text-muted-foreground">+8.2% from last month</p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium">Average Time on Site</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold">3m 42s</div>*/}
        {/*      <p className="text-xs text-muted-foreground">+0.8% from last month</p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
        {/*      <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="text-2xl font-bold">42.3%</div>*/}
        {/*      <p className="text-xs text-muted-foreground">-3.4% from last month</p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}

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

