"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function testGeminiConnection() {
  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

    // Get the model - using gemini-1.5-flash with explicit API version
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      apiVersion: "v1", // Explicitly set API version to v1 instead of v1beta
    })

    // Generate a simple response
    const result = await model.generateContent("Say hello and confirm you are working correctly")
    const text = result.response.text()

    return {
      success: true,
      message: text,
      apiKeyPresent: (process.env.GEMINI_API_KEY || "").length > 0,
    }
  } catch (error) {
    console.error("Gemini API test error:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      apiKeyPresent: (process.env.GEMINI_API_KEY || "").length > 0,
    }
  }
}

