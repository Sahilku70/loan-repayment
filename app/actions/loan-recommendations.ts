"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { Loan } from "../../lib/loan-store"

// Initialize the Google Generative AI client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface AIRecommendation {
  id: number
  title: string
  description: string
  action: string
  icon: string
  savings: string
  link: string
}

export async function generateLoanRecommendations(loans: Loan[]): Promise<AIRecommendation[]> {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    // Prepare loan data for the AI
    const loanDetails = loans.map(loan => {
      return `
        Loan: ${loan.name}
        Amount: ₹${loan.amount}
        Remaining: ₹${loan.remaining}
        Interest Rate: ${loan.interestRate}
        Monthly Payment: ₹${loan.nextAmount}
        Payments Remaining: ${loan.paymentsRemaining}
      `
    }).join("\n")
    
    // Create a prompt for the AI
    const prompt = `
      You are an AI loan advisor. Based on the following loan information, provide 3 personalized recommendations to help save money and pay off loans faster.
      
      ${loanDetails}
      
      For each recommendation, provide:
      1. A title (short and specific)
      2. A description (explain the strategy and its benefits)
      3. An action label (what the user should do next)
      4. An icon name (choose one: TrendingDown, Calendar, DollarSign, Calculator, PieChart)
      5. Estimated savings amount in ₹
      
      Format your response as a JSON array with the following structure:
      [
        {
          "title": "...",
          "description": "...",
          "action": "...",
          "icon": "...",
          "savings": "₹..."
        },
        ...
      ]
      
      Only provide specific, actionable recommendations based on the actual loan data provided.
    `
    
    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the response - it might be wrapped in code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to extract recommendations from AI response")
    }
    
    // Parse the JSON recommendations
    const recommendations = JSON.parse(jsonMatch[0]) as AIRecommendation[]
    
    // Add IDs and links to the recommendations
    return recommendations.map((rec, index) => ({
      ...rec,
      id: index + 1,
      link: "#",  // Default link
    }))
  } catch (error) {
    console.error("Error generating recommendations:", error)
    
    // Return default recommendations if API fails
    return [
      {
        id: 1,
        title: "Refinance High-Interest Loans",
        description: "Look into refinancing options for loans with interest rates above 5%. This could lower your monthly payments and save on interest.",
        action: "Explore Refinancing Options",
        icon: "TrendingDown",
        savings: "₹20,000+",
        link: "#",
      },
      {
        id: 2,
        title: "Implement Bi-weekly Payments",
        description: "Make payments every two weeks instead of monthly to reduce your loan term and save on interest payments.",
        action: "Set Up Bi-weekly Payments",
        icon: "Calendar",
        savings: "₹8,500",
        link: "#",
      },
      {
        id: 3,
        title: "Make Extra Principal Payments",
        description: "Adding even a small extra amount to your monthly payment can significantly reduce your loan term and interest costs.",
        action: "Adjust Payment Amount",
        icon: "DollarSign",
        savings: "₹15,000+",
        link: "#",
      },
    ]
  }
}