import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, videoId, currentIndex, onClose, onPrev, onNext }) {
  const hasMedia = videoId && currentIndex === images.length

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onNext()
    if (e.key === 'ArrowLeft') onPrev()
  }, [onClose, onNext, onPrev])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-10 text-white/80 transition-colors hover:text-white"
          aria-label="Fermer"
        >
          <X className="h-8 w-8" />
        </button>

        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition-all hover:bg-primary hover:text-white sm:-left-16 sm:left-auto"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {hasMedia ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`}
            className="rounded-xl"
            style={{ width: 'min(80vw, 800px)', height: 'min(45vw, 450px)' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        ) : (
          <img
            src={images[currentIndex]}
            alt=""
            className="max-h-[80vh] max-w-[90vw] select-none rounded-xl object-contain shadow-2xl transition-transform duration-200 sm:max-w-[80vw]"
          />
        )}

        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur transition-all hover:bg-primary hover:text-white sm:-right-16 sm:right-auto"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
