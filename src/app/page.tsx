"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface Recommendation {
  title: string
}

export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const handleGetRecommendations = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    // TODO: Add recommendation logic
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a show or movie you enjoyed..."
          className="w-full rounded-md border bg-background px-4 py-2 text-center text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
        />
        <button 
          onClick={handleGetRecommendations}
          disabled={isLoading}
          className="w-full rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Get Recommendations
        </button>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
} 