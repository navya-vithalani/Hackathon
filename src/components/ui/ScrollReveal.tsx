'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  style,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      element.dataset.revealVisible = 'true'
      return
    }

    element.dataset.revealReady = 'true'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealVisible = 'true'
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={elementRef}
      className={cn('scroll-reveal', className)}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
