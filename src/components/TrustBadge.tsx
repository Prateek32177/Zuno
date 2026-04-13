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
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200"
    >
      <span className="text-lg">{getEmoji(displayScore)}</span>
      <span style={{ color: scoreColor(displayScore) }} className="font-bold text-sm">
        {displayScore}%
      </span>
    </motion.div>
  )
}
