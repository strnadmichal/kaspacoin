'use client'

import { useEffect, useRef } from 'react'

interface Block {
  x: number
  y: number
  size: number
  speed: number
  color: string
  connections: number[]
}

const BlockDagBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Resize on window change
    window.addEventListener('resize', resizeCanvas)

    // Create blocks - increased number and size
    const blocks: Block[] = []
    const numBlocks = 50 // Increased from 20 to 40
    const maxConnections = 3
    const sizeMultiplier = 2
    const speedMultiplier = 1

    // Create blocks with random positions and larger sizes
    for (let i = 0; i < numBlocks; i++) {
      blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: (Math.random() * 8 + 4) * sizeMultiplier, // Increased size range from 2-6px to 4-12px
        speed: (Math.random() * 0.2 + 0.1) * speedMultiplier, // Speed between 0.1-0.3
        color: i % 5 === 0 ? '#70C7BA' : '#ffffff', // Some blocks are teal
        connections: [],
      })
    }

    // Create connections between blocks
    blocks.forEach((block, index) => {
      const numConnections = Math.floor(Math.random() * maxConnections) + 1
      const possibleConnections = [...Array(numBlocks).keys()].filter((i) => i !== index)

      // Shuffle and take first numConnections
      const shuffled = possibleConnections.sort(() => 0.5 - Math.random())
      block.connections = shuffled.slice(0, numConnections)
    })

    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1

      // Vertical grid lines
      const gridSize = 100
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw blocks
      blocks.forEach((block, index) => {
        // Move blocks
        block.x += block.speed
        if (block.x > canvas.width + 50) {
          block.x = -50
          block.y = Math.random() * canvas.height
        }

        // Draw connections
        block.connections.forEach((connIndex) => {
          const connectedBlock = blocks[connIndex]
          if (!connectedBlock) return

          // Calculate distance
          const dx = connectedBlock.x - block.x
          const dy = connectedBlock.y - block.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Only draw connections if blocks are close enough
          if (distance < 400) {
            // Increased from 300 to 400 to show more connections
            // Draw curved connections for some blocks
            if (Math.random() > 0.7) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(112, 199, 186, ${0.15 - distance / 3000})` // Slightly increased opacity
              ctx.lineWidth = 1.5 // Increased from 1 to 1.5

              // Control point for curve
              const cpX = (block.x + connectedBlock.x) / 2 - dy * 0.3
              const cpY = (block.y + connectedBlock.y) / 2 + dx * 0.3

              ctx.moveTo(block.x, block.y)
              ctx.quadraticCurveTo(cpX, cpY, connectedBlock.x, connectedBlock.y)
              ctx.stroke()
            } else {
              // Draw straight connections
              ctx.beginPath()
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - distance / 6000})` // Increased opacity
              ctx.lineWidth = 0.8 // Increased from 0.5 to 0.8
              ctx.moveTo(block.x, block.y)
              ctx.lineTo(connectedBlock.x, connectedBlock.y)
              ctx.stroke()
            }
          }
        })

        // Draw block - slightly more opaque
        ctx.fillStyle = block.color + '60' // Changed from "40" to "60" for more opacity
        ctx.fillRect(block.x - block.size / 2, block.y - block.size / 2, block.size, block.size)
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export default BlockDagBackground
