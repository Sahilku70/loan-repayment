"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "LoanAI helped me save over $15,000 in interest on my mortgage by optimizing my payment strategy. The AI recommendations were spot-on!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Recent Graduate",
    content:
      "I was overwhelmed by my student loans until I found LoanAI. The platform helped me create a realistic repayment plan that fits my budget.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Small Business Owner",
    content:
      "The visualization tools and AI chatbot made managing my business loans so much easier. I can see exactly where my money is going.",
    rating: 4,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Financial Advisor",
    content:
      "I recommend LoanAI to all my clients. The platform provides clear insights and strategies that align with sound financial planning principles.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= testimonials.length ? 0 : prevIndex + itemsPerPage))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0 ? Math.max(0, testimonials.length - itemsPerPage) : prevIndex - itemsPerPage,
    )
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <div className="relative">
      <div className="grid md:grid-cols-3 gap-6">
        {visibleTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <Button variant="outline" size="icon" onClick={prevSlide} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={i === currentIndex / itemsPerPage ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentIndex(i * itemsPerPage)}
              className={`h-8 w-8 rounded-full ${
                i === currentIndex / itemsPerPage ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              <span className="sr-only">Page {i + 1}</span>
              <span>{i + 1}</span>
            </Button>
          ))}
          <Button variant="outline" size="icon" onClick={nextSlide} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  )
}

