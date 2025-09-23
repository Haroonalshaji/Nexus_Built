"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "@/utils/cookies/cookies" // your cookie helpers
import { useNotificationContext } from "@/context/useNotificationContext"

export const useAuthRedirect = () => {
  const router = useRouter()
  const {showNotification} = useNotificationContext()

  useEffect(() => {
    const accessToken = getCookie("accessToken") // check from cookies
    if (!accessToken) {
      router.push("/auth/sign-in");
      showNotification({
        title:"Refresh the page you have been redirected to login",
        variant:"success"
      })
    }
  }, [router])
}
