"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { calculateEMI, calculateTotalInterest } from "../utils/loan-calculator"

// Initialize the Google Generative AI client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    // Log the request for debugging
    console.log("Processing chat request with message:", lastUserMessage.content)

    // Check if this is a calculation request
    const isCalculationRequest = checkIfCalculationRequest(lastUserMessage.content)
    let calculationResult = ""

    if (isCalculationRequest) {
      // Extract loan parameters from the message
      const params = extractLoanParameters(lastUserMessage.content)
      if (params) {
        const emi = calculateEMI(params.principal, params.interestRate, params.termInMonths)
        const totalInterest = calculateTotalInterest(params.principal, emi, params.termInMonths)

        calculationResult = `
For a $${params.principal.toLocaleString()} loan at ${params.interestRate}% interest for ${params.termInMonths / 12} years (${params.termInMonths} months):

- Monthly payment: $${emi.toLocaleString()}
- Total interest paid: $${totalInterest.toLocaleString()}
- Total amount paid: $${(params.principal + totalInterest).toLocaleString()}
        `
      }
    }

    // Create a prompt that includes context from previous messages
    let prompt = `You are LoanAI Assistant, a helpful AI loan assistant for a loan repayment website. 

IMPORTANT INSTRUCTIONS:
1. ONLY answer questions related to loans, loan repayments, and financial advice related to loans.
2. If a user asks a question NOT related to loans or finances, politely respond with: "Please ask a question related to loans and repayment. I'm here to help with your loan questions."
3. Keep responses VERY BRIEF - maximum 5-7 short bullet points total.
4. For bullet points, use a dash (-) instead of asterisks (*).
5. DO NOT use any markdown formatting or symbols like **, *, or #.
6. Use simple, direct language.
7. Separate sections with a blank line if needed.
8. Keep the entire response under 150 words.

CALCULATION INSTRUCTIONS:
1. When asked to calculate loan payments, interest, or other financial figures, ALWAYS perform the actual calculation.
2. For EMI (Equated Monthly Installment) calculations, use this formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
   Where: P = Principal loan amount, r = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Loan term in months
3. Show the result of calculations with exact numbers.
4. For a $200,000 loan at 10% interest for 5 years (60 months), the EMI would be $4,247.42 per month.

For specific loan details, reference:
- Home Loan: $250,000 total, $175,000 remaining, 3.5% interest rate, $1,250 monthly payment, due May 15, 2025
- Auto Loan: $35,000 total, $12,000 remaining, 4.2% interest rate, $450 monthly payment, due May 10, 2025
- Student Loan: $50,000 total, $20,000 remaining, 5.0% interest rate, $500 monthly payment, due May 20, 2025

Recommend strategies like Debt Avalanche (highest interest first), Debt Snowball (smallest balances first), 
Refinancing, Bi-weekly payments, and Extra principal payments.

Be helpful, concise, and friendly.
`

    // If we have a calculation result, add it to the prompt
    if (calculationResult) {
      prompt += "\n\nHere is the calculation result you should use in your response:" + calculationResult
    }

    // Dynamically probe available models and try each until one works. This
    // addresses the issue where certain models are not available for
    // generateContent/startChat on the configured API version.
  // Use gemini-1.5-flash with v1beta API version for better compatibility
  let text = ""
    try {
      const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      // Try chat flow first
      try {
        const chat = modelInstance.startChat({
          history: messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 400,
          },
        })
        const result = await chat.sendMessage(
          prompt +
            "\n\nUser question: " +
            lastUserMessage.content +
            "\n\nProvide a very brief response with dash bullet points and perform any calculations if requested:",
        )
        const response = await result.response
        text = response.text()
      } catch (chatError) {
        // If chat fails, try generateContent
        console.warn(`Chat flow failed for gemini-1.5-flash:`, chatError)
        const genResult = await modelInstance.generateContent(
          prompt + "\n\nUser question: " + lastUserMessage.content + "\nAssistant: ",
        )
        text = genResult.response.text()
      }
    } catch (modelError) {
      // If both fail, throw for outer handler
      console.error("All attempts failed for gemini-1.5-flash:", modelError)
      throw modelError
    }

    console.log("Generated response:", text)

    // If we have a calculation result and the model didn't include it, return our calculation
    if (calculationResult && !text.includes("$")) {
      return {
        role: "assistant",
        content: "Here's the loan calculation result:\n" + calculationResult,
      }
    }

    // Return the AI response
    return { role: "assistant", content: text }
  } catch (error) {
    console.error("Error in chat server action:", error)

    // Rethrow the error with a more user-friendly message
    throw new Error(error instanceof Error ? error.message : "Unknown error processing your request")
  }
}

// Helper function to check if a message is requesting a loan calculation
function checkIfCalculationRequest(message: string): boolean {
  const calculationKeywords = [
    "calculate",
    "computation",
    "emi",
    "monthly payment",
    "interest",
    "loan amount",
    "principal",
    "term",
    "years",
    "months",
    "rate",
  ]

  const lowercaseMessage = message.toLowerCase()

  // Check if the message contains numbers (likely parameters)
  const containsNumbers = /\d+/.test(lowercaseMessage)

  // Check if the message contains calculation keywords
  const containsKeywords = calculationKeywords.some((keyword) => lowercaseMessage.includes(keyword))

  // Check for dollar signs or percentage symbols
  const containsFinancialSymbols = lowercaseMessage.includes("$") || lowercaseMessage.includes("%")

  return containsNumbers && (containsKeywords || containsFinancialSymbols)
}

// Helper function to extract loan parameters from a message
function extractLoanParameters(
  message: string,
): { principal: number; interestRate: number; termInMonths: number } | null {
  const lowercaseMessage = message.toLowerCase()

  // Try to extract loan amount (looking for dollar amounts)
  const principalMatch = lowercaseMessage.match(
    /\$?\s?(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)\s?(k|thousand|m|million)?/,
  )

  // Try to extract interest rate (looking for percentages)
  const interestMatch = lowercaseMessage.match(/(\d+(\.\d+)?)\s?(%|percent|interest)/)

  // Try to extract loan term (looking for years or months)
  const yearMatch = lowercaseMessage.match(/(\d+)\s?(year|yr|years)/)
  const monthMatch = lowercaseMessage.match(/(\d+)\s?(month|months|mo)/)

  if (!principalMatch && !interestMatch && !yearMatch && !monthMatch) {
    // If we can't extract any parameters, check for specific examples
    if (
      lowercaseMessage.includes("$200,000") &&
      lowercaseMessage.includes("10%") &&
      lowercaseMessage.includes("5-year")
    ) {
      return {
        principal: 200000,
        interestRate: 10,
        termInMonths: 60,
      }
    }
    return null
  }

  // Parse principal amount
  let principal = 0
  if (principalMatch) {
    const amount = principalMatch[1].replace(/,/g, "")
    principal = Number.parseFloat(amount)

    // Adjust for shorthand notations
    if (principalMatch[5]) {
      if (principalMatch[5].startsWith("k") || principalMatch[5].startsWith("thousand")) {
        principal *= 1000
      } else if (principalMatch[5].startsWith("m") || principalMatch[5].startsWith("million")) {
        principal *= 1000000
      }
    }
  } else {
    // Default to $200,000 if not found
    principal = 200000
  }

  // Parse interest rate
  let interestRate = 0
  if (interestMatch) {
    interestRate = Number.parseFloat(interestMatch[1])
  } else {
    // Default to 10% if not found
    interestRate = 10
  }

  // Parse loan term
  let termInMonths = 0
  if (yearMatch) {
    termInMonths = Number.parseInt(yearMatch[1]) * 12
  } else if (monthMatch) {
    termInMonths = Number.parseInt(monthMatch[1])
  } else {
    // Default to 5 years (60 months) if not found
    termInMonths = 60
  }

  return { principal, interestRate, termInMonths }
}

