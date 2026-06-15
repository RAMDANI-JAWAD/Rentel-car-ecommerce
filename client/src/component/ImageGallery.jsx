import { useState } from 'react'
import { Play } from 'lucide-react'
import Lightbox from './Lightbox'

export default function ImageGallery({ images, videoId }) {
  const [mainIndex, setMainIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lbIndex, setLbIndex] = useState(0)

  const allMedia = videoId ? [...images, 'video'] : images

  const openLightbox = (index) => {
    setLbIndex(index)
    setLightboxOpen(true)
  }

  const handlePrev = () => setLbIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  const handleNext = () => setLbIndex((prev) => (prev + 1) % allMedia.length)

  return (
    <>
      <div className="w-full space-y-4">
        <img
          src={images[mainIndex]}
          alt=""
          onClick={() => openLightbox(mainIndex)}
          className="w-full cursor-pointer rounded-xl object-cover shadow transition-opacity hover:opacity-95"
        />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              onClick={() => setMainIndex(i)}
              className={`h-20 w-28 flex-shrink-0 cursor-pointer rounded-lg object-cover transition-all duration-200 hover:scale-105 ${mainIndex === i ? 'ring-2 ring-primary opacity-100' : 'opacity-80 hover:opacity-100'}`}
            />
          ))}
          {videoId && (
            <button
              onClick={() => openLightbox(images.length)}
              className="flex h-20 w-28 flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-black text-white transition-all duration-200 hover:scale-105"
            >
              <Play className="h-5 w-5 fill-white" />
              <span className="text-xs font-semibold">Vidéo</span>
            </button>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          videoId={videoId}
          currentIndex={lbIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
