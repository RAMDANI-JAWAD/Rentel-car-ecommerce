import { Link } from 'react-router-dom'
import { Heart, Gauge, Calendar, Fuel, Eye, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const fuelLabels = {
  Essence: 'Essence',
  Diesel: 'Diesel',
  Hybride: 'Hybride',
  Électrique: 'Électrique',
}

export default function CarCard({ car, isFav, onToggleFav }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={car.mainImage}
          alt={car.name}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.preventDefault(); onToggleFav(car) }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:scale-110"
          aria-label="Favoris"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${isFav ? 'fill-primary text-primary' : 'text-gray-600'}`}
          />
        </button>
      </div>

      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight">{car.name}</h3>
          <p className="text-lg font-bold text-primary">{car.price}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1.5 font-normal">
            <Calendar className="h-3.5 w-3.5" />
            {car.year}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 font-normal">
            <Fuel className="h-3.5 w-3.5" />
            {fuelLabels[car.fuel] || car.fuel}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 font-normal">
            <Gauge className="h-3.5 w-3.5" />
            {car.transmission}
          </Badge>
        </div>

        <div className="flex gap-3 pt-1">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to={`/car/${car.id}`}>
              <Eye className="h-4 w-4" />
              Aperçu
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/car/${car.id}`}>
              Détails
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
