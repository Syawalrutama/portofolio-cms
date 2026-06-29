import React, { useState, useEffect, useRef } from 'react'

export default function SmartImage({ src, alt, className = '', fallback = '' }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'failed'
  const [retryCount, setRetryCount] = useState(0)
  
  const timerRef = useRef(null)
  const maxRetries = 5
  const retryInterval = 2000

  // Standard inline placeholder if fallback is not provided
  const defaultPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
  const fallbackSrc = fallback || defaultPlaceholder

  useEffect(() => {
    // Reset state whenever the source changes
    setStatus('loading')
    setRetryCount(0)
  }, [src])

  useEffect(() => {
    if (!src) {
      setStatus('failed')
      return
    }

    if (status !== 'loading') return

    let isMounted = true
    const img = new Image()

    img.onload = () => {
      if (isMounted) {
        setStatus('loaded')
      }
    }

    img.onerror = () => {
      if (!isMounted) return

      if (retryCount < maxRetries) {
        console.warn(`Gambar gagal dimuat: ${src}. Mencoba kembali (${retryCount + 1}/${maxRetries})...`)
        timerRef.current = setTimeout(() => {
          if (isMounted) {
            setRetryCount(prev => prev + 1)
          }
        }, retryInterval)
      } else {
        console.error(`Gambar gagal dimuat setelah ${maxRetries} kali percobaan: ${src}`)
        setStatus('failed')
      }
    }

    // Append cache-buster on retry to force bypass of cached error states
    const finalSrc = retryCount > 0 
      ? (src.includes('?') ? `${src}&retry=${retryCount}` : `${src}?retry=${retryCount}`) 
      : src

    img.src = finalSrc

    return () => {
      isMounted = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [src, retryCount, status])

  if (status === 'loading') {
    return (
      <div className={`animate-pulse bg-slate-200 ${className}`} />
    )
  }

  return (
    <img
      src={status === 'loaded' ? src : fallbackSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        // Double-check fallback safety in case of runtime rendering errors
        e.target.src = fallbackSrc
      }}
    />
  )
}
