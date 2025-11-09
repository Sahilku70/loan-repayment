"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, TrendingDown, DollarSign, Calendar, Calculator, PieChart, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Loan } from "@/lib/loan-store"
import { generateLoanRecommendations, AIRecommendation } from "@/app/actions/loan-recommendations"

interface AIRecommendationsProps {
  loans: Loan[]
}

export function AIRecommendations({ loans }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get recommendations when loans change
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!loans.length) {
        setRecommendations([])
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const recs = await generateLoanRecommendations(loans)
        setRecommendations(recs)
      } catch (err) {
        console.error("Failed to get recommendations:", err)
        setError("Failed to load recommendations. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecommendations()
  }, [loans])
  
  // Function to refresh recommendations
  const handleRefresh = async () => {
    if (!loans.length) return

    try {
      setLoading(true)
      setError(null)
      const recs = await generateLoanRecommendations(loans)
      setRecommendations(recs)
    } catch (err) {
      console.error("Failed to refresh recommendations:", err)
      setError("Failed to refresh recommendations. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Function to get the right icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "TrendingDown":
        return <TrendingDown className="h-5 w-5" />
      case "Calendar":
        return <Calendar className="h-5 w-5" />
      case "DollarSign":
        return <DollarSign className="h-5 w-5" />
      case "Calculator":
        return <Calculator className="h-5 w-5" />
      case "PieChart":
        return <PieChart className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  // If no loans, show a message
  if (!loans.length) {
    return (
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription className="text-indigo-50">
                Add loans to get personalized recommendations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-500">
          <p>Add loans to your dashboard to receive AI-powered recommendations for saving money and paying off loans faster.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription className="text-indigo-50">
                Personalized strategies to save money and pay off loans faster
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 text-white hover:bg-white/30 border-none" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
              <p className="text-gray-500">Generating recommendations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    {getIconComponent(rec.icon)}
                  </div>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{rec.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Potential Savings</span>
                  <span className="font-bold text-indigo-600">{rec.savings}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  asChild
                >
                  <Link href={rec.link}>
                    {rec.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

