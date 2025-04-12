import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET() {
  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

    // List available models
    try {
      const modelList = await genAI.listModels()
      console.log(
        "Available models:",
        modelList.models.map((m) => m.name),
      )
    } catch (listError) {
      console.error("Error listing models:", listError)
    }

    // Get the model - using gemini-1.0-pro which should be widely available
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" })

    // Generate a simple response
    const result = await model.generateContent("Say hello and confirm you are working correctly")
    const text = result.response.text()

    return NextResponse.json({
      success: true,
      message: text,
      apiKeyPresent: (process.env.GEMINI_API_KEY || "").length > 0,
    })
  } catch (error) {
    console.error("Gemini API test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        apiKeyPresent: (process.env.GEMINI_API_KEY || "").length > 0,
      },
      { status: 500 },
    )
  }
}

