import { scoreColor } from '@/lib/trust'
import { motion } from 'framer-motion'

export function TrustBadge({ score }: { score: number }) {
  const displayScore = Math.min(100, Math.max(0, score))
  const getEmoji = (score: number) => {
    if (score >= 90) return '⭐'
    if (score >= 75) return '✓'
    if (score >= 50) return '👍'
    return '⚠️'
  }

  return (
    <div className="inline-flex items-center gap-1 text-xs">
      <span>{getEmoji(displayScore)}</span>
      <span className="font-medium">{displayScore}%</span>
    </div>
  )
}
