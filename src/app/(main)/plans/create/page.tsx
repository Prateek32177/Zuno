'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, MapPin, Users, DollarSign, Zap } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

const steps = ['Details', 'Location', 'Settings', 'Review']
const categories = ['hiking', 'food', 'music', 'cycling', 'art', 'travel', 'sports', 'other']

export default function CreatePlanPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    location_name: '',
    latitude: '',
    longitude: '',
    datetime: '',
    max_people: '8',
    whatsapp_link: '',
    approval_mode: false,
    female_only: false,
    image_url: '',
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Details
        return formData.title.trim() && formData.description.trim() && formData.category
      case 1: // Location & Date
        return formData.location_name.trim() && formData.datetime
      case 2: // Settings
        return formData.max_people && parseInt(formData.max_people) >= 2
      case 3: // Review
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < steps.length - 1) {
      handleNext()
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/plans/${data.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      alert('Error creating plan')
    } finally {
      setLoading(false)
    }
  }

  const stepContent = [
    {
      title: 'Plan Details',
      icon: Zap,
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Plan Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sunset Trek - Mhow Hills"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell people about your plan..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900 resize-none placeholder-gray-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'category', value: cat } })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-2 py-2 rounded-md text-xs font-semibold transition-all capitalize ${
                    formData.category === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.slice(0, 3)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Location & Date',
      icon: MapPin,
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Location</label>
            <input
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
              placeholder="Cafe Lalit, MG Road"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Date & Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">WhatsApp Link (Optional)</label>
            <input
              type="url"
              name="whatsapp_link"
              value={formData.whatsapp_link}
              onChange={handleChange}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Plan Settings',
      icon: Users,
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Max Participants</label>
            <input
              type="number"
              name="max_people"
              value={formData.max_people}
              onChange={handleChange}
              min="2"
              max="100"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="approval_mode"
                checked={formData.approval_mode}
                onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Require Approval</p>
                <p className="text-xs text-gray-500">Members need approval to join</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="female_only"
                checked={formData.female_only}
                onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Women Only</p>
                <p className="text-xs text-gray-500">Only women can join this plan</p>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      title: 'Review & Publish',
      icon: Check,
      fields: (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-500 mb-1 uppercase">Plan Title</p>
              <p className="text-lg font-bold text-gray-900">{formData.title || 'Untitled'}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="font-bold text-gray-500 mb-1 uppercase">Category</p>
                <p className="font-semibold text-gray-900 capitalize">{formData.category}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1 uppercase">Max</p>
                <p className="font-semibold text-gray-900">{formData.max_people}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1 uppercase">Date</p>
                <p className="font-semibold text-gray-900">{formData.datetime ? new Date(formData.datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 space-y-1 border border-blue-200 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
              <span>All details confirmed</span>
            </div>
            {formData.approval_mode && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
                <span>Approval required</span>
              </div>
            )}
            {formData.female_only && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
                <span>Women only</span>
              </div>
            )}
          </div>
        </div>
      )
    }
  ]

  const CurrentStepIcon = stepContent[currentStep].icon

  return (
    <div className="pb-24 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => currentStep > 0 ? setCurrentStep(prev => prev - 1) : router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{stepContent[currentStep].title}</h1>
              <p className="text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                layoutId={`step-${i}`}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {stepContent[currentStep].fields}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-8">
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Back
            </motion.button>
          )}

          <motion.button
            whileHover={canProceedToNextStep() ? { scale: 1.02 } : {}}
            whileTap={canProceedToNextStep() ? { scale: 0.98 } : {}}
            type="submit"
            disabled={!canProceedToNextStep() || loading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              !canProceedToNextStep() || loading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {currentStep === steps.length - 1 ? (
              loading ? 'Publishing...' : 'Publish Plan'
            ) : (
              <>Next <ChevronRight className="w-4 h-4 inline ml-1" /></>
            )}
          </motion.button>
        </div>
      </form>

      <BottomNav />
    </div>
  )
}
