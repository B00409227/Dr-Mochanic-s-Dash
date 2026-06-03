'use client'
import { useEffect, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterText({ text, speed = 25, onComplete }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayed}
      {!done && (
        <span className="animate-blink" style={{ color: 'var(--cyan)' }}>|</span>
      )}
    </span>
  )
}
