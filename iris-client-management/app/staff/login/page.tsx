"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useSearchParams } from "next/navigation"
import { signInUser } from "@/actions"

export default function StaffLoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast()
  const redirectTo = useSearchParams().get("redirectTo") || "/dashboard";
  const router = useRouter();

  const loginAction = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      try {
        const result = await signInUser(formData);

        if (result?.status === 401) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: result.message,
          });
          return;
        }

        if (result?.status === 200) {
           toast({
             title: "Login successful",
             description: "Welcome back!",
           });
          router.replace(redirectTo);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description:
            error instanceof Error ? error.message : "Something went wrong",
        });
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Staff Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginAction} method="POST" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}