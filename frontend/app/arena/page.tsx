"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Swords, Send, RefreshCw } from "lucide-react"
import { useArenaStore } from "@/lib/store"
import { createBattle, voteBattle, streamBattleResponse } from "@/lib/api"
import { VoteType } from "@/lib/types"
import ChatWindow from "@/components/Arena/ChatWindow"
import VotingButtons from "@/components/Arena/VotingButtons"
import ModelReveal from "@/components/Arena/ModelReveal"

const CATEGORIES = [
  { id: "general", label: "💬 عام" },
  { id: "coding", label: "💻 برمجة" },
  { id: "creative", label: "🎨 إبداعي" },
  { id: "math", label: "🔢 رياضيات" },
  { id: "science", label: "🔬 علوم" },
  { id: "arabic", label: "🌍 عربي" }
]

export default function ArenaPage() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    currentBattle,
    responseA,
    responseB,
    status,
    isStreamingA,
    isStreamingB,
    voteResult,
    selectedCategory,
    setCurrentBattle,
    appendResponseA,
    appendResponseB,
    setStatus,
    setStreamingA,
    setStreamingB,
    setVoteResult,
    setCategory,
    resetBattle
  } = useArenaStore()

  const handleStartBattle = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    resetBattle()
    setStatus("loading")

    try {
      const battle = await createBattle(prompt, selectedCategory)
      setCurrentBattle(battle)
      setStatus("ready")

      setStreamingA(true)
      setStreamingB(true)

      await Promise.all([
        streamBattleResponse(
          battle.battle_id,
          battle.model_a.id,
          "a",
          prompt,
          (chunk) => appendResponseA(chunk),
          () => setStreamingA(false)
        ),
        streamBattleResponse(
          battle.battle_id,
          battle.model_b.id,
          "b",
          prompt,
          (chunk) => appendResponseB(chunk),
          () => setStreamingB(false)
        )
      ])
    } catch (error) {
      console.error(error)
      setStatus("idle")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (voteType: VoteType) => {
    if (!currentBattle || status === "voted") return

    try {
      const result = await voteBattle(currentBattle.battle_id, voteType)
      setVoteResult(result)
      setStatus("voted")
    } catch (error) {
      console.error(error)
    }
  }

  const canVote = status === "ready" && !isStreamingA && !isStreamingB

  return (
    <div className="min-h-screen bg-dark-900 pt-6 pb-20">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-primary-500/20 p-3 rounded-xl">
              <Swords className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-3xl font-black text-white">ساحة المعارك</h1>
          </div>
          <p className="text-slate-400">اكتب سؤالك وصوّت للنموذج الأفضل</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary-500 text-white"
                  : "bg-dark-800 text-slate-400 hover:text-white border border-dark-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 focus-within:border-primary-500 transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              rows={3}
              className="w-full bg-transparent text-white placeholder-slate-500 resize-none outline-none text-lg"
              dir="auto"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700">
              <span className="text-slate-500 text-sm">
                {prompt.length} حرف
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartBattle}
                disabled={!prompt.trim() || isLoading}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isLoading ? "جاري..." : "ابدأ المعركة ⚔️"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChatWindow
                  label="النموذج A"
                  response={responseA}
                  isStreaming={isStreamingA}
                  side="A"
                  isWinner={voteResult?.winner === "A"}
                  isLoser={voteResult?.winner === "B"}
                />
                <ChatWindow
                  label="النموذج B"
                  response={responseB}
                  isStreaming={isStreamingB}
                  side="B"
                  isWinner={voteResult?.winner === "B"}
                  isLoser={voteResult?.winner === "A"}
                />
              </div>

              {canVote && !voteResult && (
                <VotingButtons onVote={handleVote} />
              )}

              {voteResult && (
                <ModelReveal
                  result={voteResult}
                  onNewBattle={() => {
                    resetBattle()
                    setPrompt("")
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">⚔️</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              ابدأ معركتك الأولى
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              اكتب أي سؤال وسنختار نموذجين عشوائيين للمقارنة
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
