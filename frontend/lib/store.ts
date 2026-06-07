import { create } from "zustand"
import { Battle, VoteResult, BattleStatus } from "./types"

interface ArenaState {
  currentBattle: Battle | null
  responseA: string
  responseB: string
  status: BattleStatus
  isStreamingA: boolean
  isStreamingB: boolean
  voteResult: VoteResult | null
  selectedCategory: string

  setCurrentBattle: (battle: Battle) => void
  appendResponseA: (chunk: string) => void
  appendResponseB: (chunk: string) => void
  setStatus: (status: BattleStatus) => void
  setStreamingA: (value: boolean) => void
  setStreamingB: (value: boolean) => void
  setVoteResult: (result: VoteResult) => void
  setCategory: (category: string) => void
  resetBattle: () => void
}

export const useArenaStore = create<ArenaState>((set) => ({
  currentBattle: null,
  responseA: "",
  responseB: "",
  status: "idle",
  isStreamingA: false,
  isStreamingB: false,
  voteResult: null,
  selectedCategory: "general",

  setCurrentBattle: (battle) => set({ currentBattle: battle }),
  appendResponseA: (chunk) => set((s) => ({ responseA: s.responseA + chunk })),
  appendResponseB: (chunk) => set((s) => ({ responseB: s.responseB + chunk })),
  setStatus: (status) => set({ status }),
  setStreamingA: (value) => set({ isStreamingA: value }),
  setStreamingB: (value) => set({ isStreamingB: value }),
  setVoteResult: (result) => set({ voteResult: result }),
  setCategory: (category) => set({ selectedCategory: category }),
  resetBattle: () => set({
    currentBattle: null,
    responseA: "",
    responseB: "",
    status: "idle",
    isStreamingA: false,
    isStreamingB: false,
    voteResult: null
  })
}))
