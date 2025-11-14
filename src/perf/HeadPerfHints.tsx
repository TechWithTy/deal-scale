'use client'
import React from 'react'

type FontPreload = {
  href: string
  type?: 'font/woff2' | 'font/woff'
  crossOrigin?: boolean
}

type ImagePreload = {
  href: string
  as?: 'image'
}

type Props = {
  preconnect?: string[]
  fonts?: FontPreload[]
  images?: ImagePreload[]
}

/**
 * Optional head hints for preconnect/preload of critical assets.
 * Use sparingly and only for above-the-fold needs.
 */
export default function HeadPerfHints({ preconnect = [], fonts = [], images = [] }: Props) {
  return (
    <>
      {preconnect.map((href) => (
        <link key={href} rel="preconnect" href={href} crossOrigin="anonymous" />
      ))}
      {fonts.map((f) => (
        <link
          key={f.href}
          rel="preload"
          as="font"
          href={f.href}
          type={f.type ?? 'font/woff2'}
          crossOrigin={f.crossOrigin ? 'anonymous' : undefined}
        />
      ))}
      {images.map((i) => (
        <link key={i.href} rel="preload" as={i.as ?? 'image'} href={i.href} />
      ))}
    </>
  )
}

