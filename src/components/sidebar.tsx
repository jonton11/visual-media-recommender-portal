"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WatchHistoryEntry {
  title: string
  timestamp: number
  recommendations: Array<{
    title: string
    description: string
    matchPercentage: number
  }>
}

interface SidebarProps {
  watchHistory: WatchHistoryEntry[]
  onEntryClick: (entry: WatchHistoryEntry) => void
  selectedEntry?: WatchHistoryEntry
}

export function Sidebar({ watchHistory, onEntryClick, selectedEntry }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div 
      className={`relative border-r bg-card transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-4 rounded-full border bg-background p-1 hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="p-4">
        <h2 className={`mb-4 font-semibold ${isCollapsed ? "hidden" : ""}`}>
          Watch History
        </h2>
        
        {watchHistory.length === 0 ? (
          <p className={`text-sm text-muted-foreground ${isCollapsed ? "hidden" : ""}`}>
            No shows watched yet
          </p>
        ) : (
          <div className="space-y-2">
            {watchHistory.map((entry) => (
              <button
                key={entry.timestamp}
                onClick={() => onEntryClick(entry)}
                className={`w-full truncate rounded-md p-2 text-left text-sm hover:bg-accent ${
                  selectedEntry?.timestamp === entry.timestamp ? "bg-accent" : ""
                } ${isCollapsed ? "hidden" : ""}`}
              >
                {entry.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 