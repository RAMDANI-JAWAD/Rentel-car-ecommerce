import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function HeroSection({ onExplore }) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Découvrez les meilleures voitures
        </h1>
        <p className="mx-auto max-w-xl text-lg text-gray-200 sm:text-xl">
          Prix, caractéristiques et modèles de luxe.
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            onClick={onExplore}
            className="gap-2 text-base"
          >
            Voir les voitures
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
