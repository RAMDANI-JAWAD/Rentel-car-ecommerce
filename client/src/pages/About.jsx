import { Link } from 'react-router-dom'
import { Car, ArrowRight, Users, Award } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const stats = [
  { icon: Car, value: '50+', label: 'Voitures disponibles' },
  { icon: Users, value: '100%', label: 'Clients satisfaits' },
  { icon: Award, value: '10+', label: "Années d'expérience" },
]

export default function About() {
  return (
    <div className="about-section min-h-[80vh]">
      <div className="moving-background" />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            À propos de Car Showroom
          </h1>
          <p className="mb-16 text-lg leading-relaxed text-gray-200">
            Car Showroom est votre destination premium pour la découverte et
            l&apos;achat de voitures de luxe au Maroc. Nous proposons une
            sélection rigoureuse des meilleurs modèles, des berlines élégantes
            aux supercars les plus exclusives.
          </p>

          <div className="mb-16 grid gap-8 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="border-0 bg-white/95 shadow-lg backdrop-blur">
                  <CardContent className="flex flex-col items-center gap-4 p-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              Voir nos voitures
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
