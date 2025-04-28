"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/services/auth.service"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {EToken} from "@/lib/enum/app.enum";
import {deleteCookie, setCookie} from "cookies-next";

// Define the login form schema with Zod
const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

// Define the form values type
type LoginFormValues = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Default values for the form
  const defaultValues: LoginFormValues = {
    email: "admin",
    password: "admin",
  }
  
  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  })
  
  useEffect(() => {
    deleteCookie(EToken.ACCESS_TOKEN)
    deleteCookie(EToken.REFRESH_TOKEN)
  }, []);
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      
      // Call authentication service
      const res = await authService.login(data.email,data.password)
      
      // Store auth token in localStorage
      setCookie(EToken.ACCESS_TOKEN, res.data.accessToken)
      setCookie(EToken.REFRESH_TOKEN, res.data.refreshToken)
      setCookie(EToken.USER_ID, res.data.user.id)
      await new Promise(_ => setTimeout(_, 1000))
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      })
      
      router.push("/dashboard/categories")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="admin" className="pl-9" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
