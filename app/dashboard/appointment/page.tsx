"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {useAppointment} from "@/hooks/use-contact";

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
                    <TableCell className="text-right">{item?.category?.name}</TableCell>
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

