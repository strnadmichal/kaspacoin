import React from 'react'
import NextImage from 'next/image' // Použijeme Next.js Image pro optimalizaci

// Typ pro props, měl by odpovídat struktuře ImageBlock z payload-types.ts
// Zejména 'image' bude objekt obsahující URL a další metadata z Media collection.
interface ImageBlockProps {
  image: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
    // Další potenciální pole z vaší Media collection, např. dominantColor
  }
  caption?: string | null
  size?: 'oneThird' | 'half' | 'twoThirds' | 'full'
  blockType: 'imageBlock'
}

export const ImageBlockComponent: React.FC<ImageBlockProps> = ({ image, caption, size }) => {
  if (!image?.url) {
    return null // Nezobrazovat nic, pokud chybí URL obrázku
  }

  const imageWidth = image.width || 1200 // Fallback šířka
  const imageHeight = image.height || 675 // Fallback výška

  let sizeClasses = ''
  switch (size) {
    case 'oneThird':
      sizeClasses = 'max-w-full md:max-w-[33%]'
      break
    case 'half':
      sizeClasses = 'max-w-full md:max-w-[50%]'
      break
    case 'twoThirds':
      sizeClasses = 'max-w-full md:max-w-[66%]'
      break
    case 'full':
    default:
      sizeClasses = 'max-w-full'
      break
  }

  return (
    <figure className={`my-6 flex flex-col items-center ${sizeClasses} mx-auto`}>
      <div className="relative w-full">
        <NextImage
          src={image.url}
          alt={image.alt || caption || 'Obrázek článku'}
          width={imageWidth} // Poskytněte originální šířku pro správné aspect ratio
          height={imageHeight} // Poskytněte originální výšku
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Příklad sizes atributu
          className="rounded-lg object-cover w-full h-auto" // w-full a h-auto pro responzivitu v rámci kontejneru
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
} 