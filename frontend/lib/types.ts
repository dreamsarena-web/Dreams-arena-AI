export interface Battle {
  battle_id: string
  prompt: string
  model_a: {
    id: string
    provider: string
    model_id: string
    label: string
  }
  model_b: {
    id: string
    provider: string
    model_id: string
    label: string
  }
}

export interface VoteResult {
  success: boolean
  winner: string
  revealed: {
    model_a: string
    model_b: string
  }
  elo_changes: {
    model_a: { old: number; new: number; change: number }
    model_b: { old: number; new: number; change: number }
  }
}

export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  provider: string
  elo_score: number
  total_battles: number
  total_wins: number
  total_losses: number
  total_ties: number
  win_rate: number
}

export type VoteType = "A" | "B" | "tie" | "both_bad"
export type BattleStatus = "idle" | "loading" | "ready" | "voted"
