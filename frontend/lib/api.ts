import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" }
})

export const createBattle = async (prompt: string, category: string = "general") => {
  const { data } = await api.post("/api/battles/create", { prompt, category })
  return data
}

export const voteBattle = async (battleId: string, winner: string) => {
  const { data } = await api.post("/api/battles/vote", {
    battle_id: battleId,
    winner
  })
  return data
}

export const getLeaderboard = async (provider?: string) => {
  const params = provider ? { provider } : {}
  const { data } = await api.get("/api/leaderboard", { params })
  return data
}

export const getStats = async () => {
  const { data } = await api.get("/api/leaderboard/stats")
  return data
}

export const getModels = async () => {
  const { data } = await api.get("/api/models")
  return data
}

export const streamBattleResponse = async (
  battleId: string,
  modelId: string,
  modelSlot: "a" | "b",
  prompt: string,
  onChunk: (chunk: string) => void,
  onDone: () => void
) => {
  const response = await fetch(`${BASE_URL}/api/stream/battle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      battle_id: battleId,
      model_id: modelId,
      model_slot: modelSlot,
      prompt
    })
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    const lines = text.split("\n")

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.chunk) onChunk(data.chunk)
          if (data.done) onDone()
        } catch {}
      }
    }
  }
}
