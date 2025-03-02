"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/utils/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/admin/login") return

    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [pathname, router])

  // Don't wrap login page in admin layout
  if (pathname === "/admin/login") {
    return children
  }

  return <div className="min-h-screen bg-background">{children}</div>
}

