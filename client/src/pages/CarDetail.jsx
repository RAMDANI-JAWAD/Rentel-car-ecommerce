import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, Fuel, Gauge, ArrowLeft, Mail, Pencil, X, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import api from '../lib/api'

const fuelLabels = {
  Essence: 'Essence',
  Diesel: 'Diesel',
  Hybride: 'Hybride',
  Électrique: 'Électrique',
}

function extractYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

function safeImagePath(path) {
  if (!path) return ''
  return path.startsWith('/') ? path : '/' + path
}

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showingVideo, setShowingVideo] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const isAdmin = localStorage.getItem('role') === 'admin'

  useEffect(() => {
    api.get('/cars')
      .then((res) => {
        const found = res.data.find((c) => c.id === id)
        console.log('Car data:', found)
        console.log('User email from localStorage:', localStorage.getItem('email'))
        setCar(found || null)
      })
      .catch(() => setCar(null))
  }, [id])

  const allImages = car
    ? (car.images && car.images.length > 0
        ? car.images
        : [car.mainImage, car.image2, car.image3].filter(Boolean))
    : []

  const videoUrl = car?.videoUrl || ''
  const videoId = extractYouTubeId(videoUrl) || car?.videoId || null

  if (!car) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <p className="text-xl text-muted-foreground">Voiture non trouvée</p>
        <Button asChild variant="outline">
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="w-full space-y-4">
          {showingVideo && videoId ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
              />
            </div>
          ) : (
            allImages.length > 0 && (
              <img
                src={safeImagePath(allImages[selectedImage])}
                alt=""
                onClick={() => setIsZoomed(true)}
                className="w-full cursor-pointer rounded-xl object-cover shadow transition-opacity hover:opacity-95"
              />
            )
          )}

          {(allImages.length > 1 || videoId) && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={safeImagePath(img)}
                  alt=""
                  onClick={() => { setSelectedImage(i); setShowingVideo(false) }}
                  className={`h-20 w-28 flex-shrink-0 cursor-pointer rounded-lg object-cover transition-all duration-200 hover:scale-105 ${!showingVideo && selectedImage === i ? 'ring-2 ring-primary opacity-100' : 'opacity-80 hover:opacity-100'}`}
                />
              ))}
              {videoId && (
                <button
                  onClick={() => setShowingVideo(true)}
                  className={`flex h-20 w-28 flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-black text-white transition-all duration-200 hover:scale-105 ${showingVideo ? 'ring-2 ring-primary' : ''}`}
                >
                  <Play className="h-5 w-5 fill-white" />
                  <span className="text-xs font-semibold">Vidéo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {isZoomed && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
            onClick={(e) => { if (e.target === e.currentTarget) setIsZoomed(false) }}
          >
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute -top-12 right-0 z-10 text-white/80 transition-colors hover:text-white"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={safeImagePath(allImages[selectedImage])}
                alt=""
                className="max-h-[80vh] max-w-[90vw] select-none rounded-xl object-contain shadow-2xl sm:max-w-[80vw]"
              />
            </div>
          </div>
        )}

        <Card className="border-0 shadow-xl">
          <CardContent className="space-y-8 p-8 sm:p-12">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {car.name}
              </h1>
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {car.price}
              </p>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {car.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-2.5 px-5 py-2.5 text-sm font-normal">
                <Calendar className="h-4 w-4" />
                Année : {car.year}
              </Badge>
              <Badge variant="secondary" className="gap-2.5 px-5 py-2.5 text-sm font-normal">
                <Fuel className="h-4 w-4" />
                Carburant : {fuelLabels[car.fuel] || car.fuel}
              </Badge>
              <Badge variant="secondary" className="gap-2.5 px-5 py-2.5 text-sm font-normal">
                <Gauge className="h-4 w-4" />
                Transmission : {car.transmission}
              </Badge>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              {isAdmin && (
                <Button onClick={() => navigate(`/edit-car/${id}`)} className="gap-2 sm:flex-1">
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Button>
              )}
              <Button asChild variant="outline" className="gap-2 sm:flex-1">
                <a href="mailto:ramdanijawad@carshowroom.com">
                  <Mail className="h-4 w-4" />
                  Contactez-nous
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 sm:flex-1">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Retour à l&apos;accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
