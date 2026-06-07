"use client"

import { motion } from "framer-motion"
import { Bot, Loader2, Trophy, X } from "lucide-react"

interface ChatWindowProps {
  label: string
  response: string
  isStreaming: boolean
  side: "A" | "B"
  isWinner?: boolean
  isLoser?: boolean
}

export default function ChatWindow({
  label,
  response,
  isStreaming,
  side,
  isWinner,
  isLoser
}: ChatWindowProps) {
  const getBorderColor = () => {
    if (isWinner) return "border-green-500 shadow-green-500/20 shadow-xl"
    if (isLoser) return "border-red-500/50 opacity-75"
    return "border-dark-600"
  }

  const getHeaderColor = () => {
    if (side === "A") return "from-blue-500/20 to-indigo-500/20"
    return "from-purple-500/20 to-pink-500/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-dark-800 border-2 rounded-2xl overflow-hidden transition-all duration-500 ${getBorderColor()}`}
    >
      <div className={`bg-gradient-to-r ${getHeaderColor()} border-b border-dark-700 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
              side === "A" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
            }`}>
              {side}
            </div>
            <div>
              <div className="text-white font-bold">{label}</div>
              <div className="text-slate-400 text-xs">
                {isStreaming ? "يكتب..." : response ? "اكتمل" : "ينتظر"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                    className={`w-2 h-2 rounded-full ${
                      side === "A" ? "bg-blue-400" : "bg-purple-400"
                    }`}
                  />
                ))}
              </div>
            )}
            {isWinner && (
              <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 rounded-full px-3 py-1">
                <Trophy className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-bold">الفائز</span>
              </div>
            )}
            {isLoser && (
              <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1">
                <X className="w-3 h-3 text-red-400" />
                <span className="text-red-400 text-xs font-bold">خسر</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 min-h-64 max-h-96 overflow-y-auto">
        {!response && isStreaming && (
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>يولّد الرد...</span>
          </div>
        )}

        {response && (
          <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
            {response}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`inline-block w-0.5 h-4 ml-0.5 ${
                  side === "A" ? "bg-blue-400" : "bg-purple-400"
                }`}
              />
            )}
          </div>
        )}

        {!response && !isStreaming && (
          <div className="text-slate-500 text-center py-8">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>انتظر الرد...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
