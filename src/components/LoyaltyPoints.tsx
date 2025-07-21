'use client'

import { useState, useEffect } from 'react'
import { LoyaltyPointsService } from '@/lib/loyaltyPoints'

interface LoyaltyPointsProps {
  userMobile?: string
  billAmount: number
  onPointsRedeemed: (discount: number, pointsUsed: number) => void
}

interface LoyaltyData {
  loyaltyPoints: number
  totalOrders: number
  loyaltyTier: {
    tier: string
    color: string
    nextTierOrders?: number
    benefits: string[]
  }
  redemptionInfo?: {
    availablePoints: number
    redeemableAmount: number
    pointsToRedeem: number
    minimumBillForRedemption: number
    canRedeem: boolean
    remainingPointsAfterRedemption: number
  }
  formattedPoints: string
}

export default function LoyaltyPointsComponent({ userMobile, billAmount, onPointsRedeemed }: LoyaltyPointsProps) {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Fetch loyalty points data
  useEffect(() => {
    if (!userMobile) {
      setLoading(false)
      return
    }

    const fetchLoyaltyData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/loyalty?mobile=${userMobile}&billAmount=${billAmount}`)
        const result = await response.json()

        if (result.success) {
          setLoyaltyData(result.data)
          // Set default redemption to maximum available
          if (result.data.redemptionInfo?.canRedeem) {
            setPointsToRedeem(result.data.redemptionInfo.pointsToRedeem)
          }
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch loyalty points')
      } finally {
        setLoading(false)
      }
    }

    fetchLoyaltyData()
  }, [userMobile, billAmount])

  const handleRedeemPoints = async () => {
    if (!userMobile || !loyaltyData?.redemptionInfo?.canRedeem) return

    try {
      setRedeeming(true)
      setError(null)

      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: userMobile,
          pointsToRedeem,
          billAmount
        })
      })

      const result = await response.json()

      if (result.success) {
        onPointsRedeemed(result.data.discountAmount, pointsToRedeem)
        // Update local state
        setLoyaltyData(prev => prev ? {
          ...prev,
          loyaltyPoints: result.data.remainingPoints,
          formattedPoints: LoyaltyPointsService.formatPoints(result.data.remainingPoints)
        } : null)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to redeem points')
    } finally {
      setRedeeming(false)
    }
  }

  if (!userMobile) {
    return (
      <div className="bg-amber-600 bg-opacity-20 border border-amber-400 border-opacity-30 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-amber-400 text-xl">🏆</span>
          <div className="text-amber-300">
            <p className="font-semibold">Join Our Loyalty Program!</p>
            <p className="text-sm">Log in to earn and redeem loyalty points</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
        <div className="animate-pulse">
          <div className="h-4 bg-brown-600 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-brown-600 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!loyaltyData) {
    return null
  }

  const { loyaltyPoints, totalOrders, loyaltyTier, redemptionInfo, formattedPoints } = loyaltyData

  return (
    <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
      <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
        <span className="mr-3">🏆</span>
        Loyalty Rewards
      </h2>

      {/* Loyalty Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Your Status</h3>
            <p className={`text-xl font-bold ${loyaltyTier.color}`}>{loyaltyTier.tier} MEMBER</p>
          </div>
          <div className="text-right">
            <p className="text-brown-300 text-sm">Available Points</p>
            <p className="text-3xl font-bold text-amber-300">{formattedPoints}</p>
          </div>
        </div>

        <div className="bg-brown-700 bg-opacity-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm text-brown-200 mb-2">
            <span>Total Orders: {totalOrders}</span>
            {loyaltyTier.nextTierOrders && (
              <span>{loyaltyTier.nextTierOrders - totalOrders} orders to next tier</span>
            )}
          </div>
          <div className="w-full bg-brown-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: loyaltyTier.nextTierOrders 
                  ? `${(totalOrders / loyaltyTier.nextTierOrders) * 100}%` 
                  : '100%' 
              }}
            ></div>
          </div>
        </div>

        <div className="text-brown-300 text-sm">
          <p className="font-medium mb-1">Your Benefits:</p>
          <ul className="list-disc list-inside space-y-1">
            {loyaltyTier.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Redemption Section */}
      {redemptionInfo && (
        <div className="border-t border-brown-600 pt-6">
          {redemptionInfo.canRedeem ? (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Redeem Points</h4>
              
              <div className="bg-green-600 bg-opacity-20 border border-green-400 border-opacity-30 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 text-xl">💰</span>
                  <div className="text-green-300">
                    <p className="font-semibold">
                      You can save ₹{redemptionInfo.redeemableAmount} on this order!
                    </p>
                    <p className="text-sm">
                      Redeem {redemptionInfo.pointsToRedeem} points (₹{redemptionInfo.redeemableAmount} discount)
                    </p>
                  </div>
                </div>
              </div>

              {/* Points Slider */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Points to Redeem: {pointsToRedeem.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={LoyaltyPointsService.MINIMUM_REDEMPTION_POINTS}
                  max={redemptionInfo.pointsToRedeem}
                  step={LoyaltyPointsService.MINIMUM_REDEMPTION_POINTS}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                  className="w-full h-2 bg-brown-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-brown-300 mt-1">
                  <span>1,000 pts (₹20)</span>
                  <span>₹{(pointsToRedeem / LoyaltyPointsService.POINTS_PER_RUPEE).toFixed(0)} discount</span>
                </div>
              </div>

              <button
                onClick={handleRedeemPoints}
                disabled={redeeming || pointsToRedeem === 0}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-green-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {redeeming ? 'Redeeming...' : `Redeem ${pointsToRedeem.toLocaleString()} Points`}
              </button>
            </div>
          ) : (
            <div className="bg-orange-600 bg-opacity-20 border border-orange-400 border-opacity-30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-orange-400 text-xl">ℹ️</span>
                <div className="text-orange-300">
                  <p className="font-semibold mb-2">Redemption Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Minimum 1,000 points required (you have {formattedPoints})</li>
                    <li>• Minimum bill amount: ₹{redemptionInfo.minimumBillForRedemption}</li>
                    <li>• Points redeemed in chunks of 1,000 (₹20 each)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-4">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Points Earning Info */}
      <div className="mt-6 bg-blue-600 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-400 text-xl">💡</span>
          <div className="text-blue-300">
            <p className="font-semibold mb-1">How to Earn Points:</p>
            <p className="text-sm">Complete every 10 orders to earn 100 loyalty points! Keep ordering to unlock better rewards.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
