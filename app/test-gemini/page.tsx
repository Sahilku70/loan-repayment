"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { testGeminiConnection } from "../actions/test-gemini"

export default function TestGeminiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    try {
      const testResult = await testGeminiConnection()
      setResult(testResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Gemini API Test</CardTitle>
            <CardDescription>Testing connection to Google's Gemini API</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-3">Testing connection...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                <h3 className="font-semibold mb-2">Error Testing Connection</h3>
                <p>{error}</p>
                <Button onClick={runTest} className="mt-4 bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </div>
            ) : result ? (
              <div>
                <div
                  className={`p-4 rounded-lg mb-4 ${result.success ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}
                >
                  <h3 className="font-semibold mb-2">
                    {result.success ? "Connection Successful" : "Connection Failed"}
                  </h3>
                  {result.success ? <p>{result.message}</p> : <p>{result.error}</p>}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">API Key Status</h3>
                  <p>
                    API Key Present:{" "}
                    <span
                      className={result.apiKeyPresent ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}
                    >
                      {result.apiKeyPresent ? "Yes" : "No"}
                    </span>
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Model Information</h3>
                  <p>
                    Using model: <span className="font-semibold">gemini-1.5-flash</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">API Version: v1 (stable)</p>
                </div>

                <Button onClick={runTest} className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                  Test Again
                </Button>
              </div>
            ) : (
              <p>No result available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

