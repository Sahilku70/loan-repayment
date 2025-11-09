import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Log the request for debugging
    console.log("Processing chat request with message:", lastUserMessage.content)

    // List available models to help with debugging
    try {
      const modelList = await genAI.listModels()
      console.log(
        "Available models:",
        modelList.models.map((m) => m.name),
      )
    } catch (listError) {
      console.error("Error listing models:", listError)
    }

    // Create a prompt that includes context from previous messages
    let prompt = `You are LoanAI Assistant, a helpful AI loan assistant for a loan repayment website. 
    Help users with loan terms, repayment strategies, and financial advice.
    
    For specific loan details, reference:
    - Home Loan: $250,000 total, $175,000 remaining, 3.5% interest rate, $1,250 monthly payment, due May 15, 2025
    - Auto Loan: $35,000 total, $12,000 remaining, 4.2% interest rate, $450 monthly payment, due May 10, 2025
    - Student Loan: $50,000 total, $20,000 remaining, 5.0% interest rate, $500 monthly payment, due May 20, 2025
    
    Recommend strategies like Debt Avalanche (highest interest first), Debt Snowball (smallest balances first), 
    Refinancing, Bi-weekly payments, and Extra principal payments.
    
    Be helpful, concise, and friendly.\n\n`

    // Add conversation history to the prompt
    const conversationHistory = messages.slice(0, -1) // Exclude the last message
    if (conversationHistory.length > 0) {
      prompt += "Previous conversation:\n"
      conversationHistory.forEach((msg: any) => {
        prompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`
      })
      prompt += "\n"
    }

    // Add the current user question
    prompt += `User: ${lastUserMessage.content}\nAssistant: `

    // Get the Gemini model - try with gemini-1.0-pro which should be widely available
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    })

    // Generate content with a single prompt approach
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log("Generated response:", text)

    // Return the AI response
    return NextResponse.json({ role: "assistant", content: text })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "There was an error processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

