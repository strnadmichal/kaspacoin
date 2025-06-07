'use client'

import { TrendingUp } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const formatNumber = (num: number, options = {}) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...options,
  }).format(num)
}

const formatHashrate = (hashrate: number): string => {
  if (hashrate < 1e3) return `${hashrate.toFixed(2)} TH/s`
  if (hashrate < 1e6) return `${(hashrate / 1e3).toFixed(2)} PH/s`
  return `${(hashrate / 1e6).toFixed(2)} EH/s`
}

export const PriceCard = () => {
  const [data, setData] = useState({
    price: 0.1247,
    priceChange: 5.8,
    marketCap: 1_450_000_000,
    volume: 87_200_000,
    rank: 42,
    hashrate: 1_200_000, // in TH/s for EH/s conversion
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const coingeckoRes = await fetch(
          'https://api.coingecko.com/api/v3/coins/kaspa?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
        )
        const coingeckoData = await coingeckoRes.json()

        const hashrateRes = await fetch('https://api.kaspa.org/info/hashrate')
        const hashrateData = await hashrateRes.json()

        const priceRes = await fetch('https://api.kaspa.org/info/price')
        const priceData = await priceRes.json()

        setData({
          price: priceData.price,
          priceChange: coingeckoData.market_data.price_change_percentage_24h,
          marketCap: coingeckoData.market_data.market_cap.usd,
          volume: coingeckoData.market_data.total_volume.usd,
          rank: coingeckoData.market_data.market_cap_rank,
          hashrate: hashrateData.hashrate,
        })
      } catch (error) {
        console.error('Failed to fetch Kaspa market data:', error)
        // Keep initial static data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const priceChangeColor = data.priceChange >= 0 ? 'text-teal' : 'text-red-500'
  const priceChangeBg = data.priceChange >= 0 ? 'bg-teal/10' : 'bg-red-500/10'

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 h-40">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium text-base">Aktuální cena</h2>
        {loading && <span className="text-xs text-gray-400">Načítání...</span>}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="size-5 rounded-full bg-white flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Kaspacoin.cz Logo"
            width={20}
            height={20}
            className="w-5 h-5"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">
            {formatNumber(data.price, { minimumFractionDigits: 4 })}
          </div>
          <div
            className={`flex items-center text-xs px-1.5 py-0.5 rounded-full ${priceChangeBg} ${priceChangeColor}`}
          >
            <TrendingUp className="w-2.5 h-2.5 mr-1" />
            <span>{data.priceChange.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <div className="text-gray-400 text-xs mb-0.5">Market Cap</div>
          <div className="font-medium text-xs">
            {formatNumber(data.marketCap, { notation: 'compact' })}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-0.5">Volume</div>
          <div className="font-medium text-xs">
            {formatNumber(data.volume, { notation: 'compact' })}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-0.5">Rank</div>
          <div className="font-medium text-xs">#{data.rank}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-0.5">Hashrate</div>
          <div className="font-medium text-xs">{formatHashrate(data.hashrate)}</div>
        </div>
      </div>
    </div>
  )
}
