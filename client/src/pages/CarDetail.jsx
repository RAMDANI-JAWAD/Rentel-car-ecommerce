import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Fuel, Gauge, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import ImageGallery from '../component/ImageGallery'

const fuelLabels = {
  Essence: 'Essence',
  Diesel: 'Diesel',
  Hybride: 'Hybride',
  Électrique: 'Électrique',
}

export default function CarDetail() {
  const { id } = useParams()
  const [car, setCar] = useState(null)

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((c) => c.id === id)
        setCar(found || null)
      })
  }, [id])

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
        <ImageGallery images={car.images} videoId={car.videoId} />

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
              <Button asChild className="gap-2 sm:flex-1">
                <a href="mailto:ramdani@carshowroom.com">
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
