"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

interface Recommendation {
  title: string
  description: string
  matchPercentage: number
}

interface WatchHistoryEntry {
  title: string
  timestamp: number
  recommendations: Recommendation[]
}

const getRecommendations = async (title: string): Promise<Recommendation[]> => {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch recommendations')
  }

  const data = await response.json()
  return data.recommendations
}

export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [watchHistory, setWatchHistory] = useState<WatchHistoryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<WatchHistoryEntry>()

  useEffect(() => {
    // Load watch history from localStorage
    const savedHistory = localStorage.getItem("watchHistory")
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const handleGetRecommendations = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    setRecommendations([]) // Clear previous recommendations

    try {
      const recommendations = await getRecommendations(input)
      
      // Create new history entry
      const newEntry: WatchHistoryEntry = {
        title: input,
        timestamp: Date.now(),
        recommendations
      }

      // Update watch history
      const updatedHistory = [newEntry, ...watchHistory]
      setWatchHistory(updatedHistory)
      localStorage.setItem("watchHistory", JSON.stringify(updatedHistory))

      setRecommendations(recommendations)
      setInput("")
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      // TODO: Add error state UI
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryEntryClick = (entry: WatchHistoryEntry) => {
    setSelectedEntry(entry)
    setRecommendations(entry.recommendations)
    setInput(entry.title)
  }

  return (
    <>
      <Sidebar 
        watchHistory={watchHistory}
        onEntryClick={handleHistoryEntryClick}
        selectedEntry={selectedEntry}
      />
      <div className="flex flex-1 flex-col items-center justify-center p-4">
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

          {!isLoading && recommendations.length > 0 && (
            <div className="space-y-4 pt-8">
              {recommendations.map((rec) => (
                <div
                  key={rec.title}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {rec.matchPercentage}% Match
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
} 