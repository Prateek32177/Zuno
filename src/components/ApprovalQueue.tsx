'use client'

import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { PlanParticipant } from '@/lib/types'

export function ApprovalQueue({ 
  requests, 
  planId,
  onApprove,
  onDecline 
}: { 
  requests: PlanParticipant[]
  planId: string
  onApprove?: (participantId: string) => Promise<void>
  onDecline?: (participantId: string) => Promise<void>
}) {
  const safeRequests = Array.isArray(requests) ? requests : []
  
  if (!safeRequests.length) {
    return <p className="text-sm text-gray-500 text-center py-4">No pending requests</p>
  }

  const handleApprove = async (participantId: string) => {
    if (onApprove) {
      try {
        await onApprove(participantId)
      } catch (error) {
        console.error('Failed to approve:', error)
        alert('Failed to approve request')
      }
    } else {
      // Default API call
      try {
        const response = await fetch(`/api/plans/${planId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participant_id: participantId })
        })
        if (!response.ok) throw new Error('Failed to approve')
      } catch (error) {
        console.error('Approve error:', error)
        alert('Failed to approve request')
      }
    }
  }

  const handleDecline = async (participantId: string) => {
    if (onDecline) {
      try {
        await onDecline(participantId)
      } catch (error) {
        console.error('Failed to decline:', error)
        alert('Failed to decline request')
      }
    } else {
      // Default API call
      try {
        const response = await fetch(`/api/plans/${planId}/decline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participant_id: participantId })
        })
        if (!response.ok) throw new Error('Failed to decline')
      } catch (error) {
        console.error('Decline error:', error)
        alert('Failed to decline request')
      }
    }
  }

  return (
    <div className="space-y-2">
      {safeRequests.map((r, idx) => (
        <motion.div 
          key={r?.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{r?.user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">@{r?.user?.instagram_handle || 'user'}</p>
          </div>
          <div className="flex gap-2 ml-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleApprove(r?.id || '')}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDecline(r?.id || '')}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              title="Decline"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
