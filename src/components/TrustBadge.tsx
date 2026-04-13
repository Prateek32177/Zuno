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

  const getBgColor = (score: number) => {
    if (score >= 90) return 'from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900'
    if (score >= 75) return 'from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900'
    if (score >= 50) return 'from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900'
    return 'from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${getBgColor(displayScore)} border border-current border-opacity-20 shadow-brand`}
    >
      <span className="text-base">{getEmoji(displayScore)}</span>
      <span style={{ color: scoreColor(displayScore) }} className="font-bold text-xs">
        {displayScore}%
      </span>
    </motion.div>
  )
}
