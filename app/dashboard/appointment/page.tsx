"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {useCategory} from "@/hooks/use-category";
import {useAppointment} from "@/hooks/use-contact";

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

export default function ContactPage() {
  
  const {appointment} = useAppointment()
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h2 className="text-2xl font-bold">Contact</h2>

        <Card>
          <CardHeader>
            <CardTitle>Appointment</CardTitle>
            <CardDescription>List of appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>name</TableHead>
                  <TableHead className="text-right">email</TableHead>
                  <TableHead className="text-right">phone</TableHead>
                  <TableHead className="text-right">category</TableHead>
                  <TableHead className="text-right">message</TableHead>
                  <TableHead className="text-right">time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointment?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.email}</TableCell>
                    <TableCell className="text-right">{item.phone}</TableCell>
                    <TableCell className="text-right">{item?.category.name}</TableCell>
                    <TableCell className="text-right">{item.message}</TableCell>
                    <TableCell className="text-right">{new Date(item.createdAt).toLocaleString()}</TableCell>
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

