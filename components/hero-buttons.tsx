import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Single button matching the image */}
      <Button
        size="lg"
        className="bg-white text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl px-8 py-6 h-auto text-lg font-medium w-full justify-start"
        asChild
      >
        <Link href="/dashboard" className="flex items-center">
          <span>Get Started Free</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  )
}

