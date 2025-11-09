"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FloatingChatButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`
          flex items-center gap-2 
          ${isHovered ? "bg-white pr-4 rounded-full shadow-lg" : ""}
          transition-all duration-300
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && <span className="text-indigo-600 font-medium whitespace-nowrap">Chat with AI</span>}
        <Button size="lg" className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg" asChild>
          <Link href="/chat">
            <MessageSquare className="h-6 w-6" />
            <span className="sr-only">Chat with AI</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

