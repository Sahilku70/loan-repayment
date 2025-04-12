import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface WhiteButtonProps {
  href: string
  children: React.ReactNode
}

export function WhiteButton({ href, children }: WhiteButtonProps) {
  return (
    <div className="bg-indigo-700 p-6 rounded-lg">
      <Button
        className="w-full bg-white text-indigo-700 hover:bg-indigo-50 transition-all rounded-xl py-6 h-auto text-lg font-semibold"
        asChild
      >
        <Link href={href}>{children}</Link>
      </Button>
    </div>
  )
}

