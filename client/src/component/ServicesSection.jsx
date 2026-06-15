import { Car, BadgeDollarSign, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

const services = [
  {
    icon: Car,
    title: 'Large choix',
    desc: 'Des centaines de voitures disponibles.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Meilleurs prix',
    desc: 'Prix compétitifs et offres exclusives.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantie',
    desc: 'Voitures vérifiées et garanties.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-[#111] border-t border-white/10 px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pourquoi nous choisir ?
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Card
                key={s.title}
                className="border-white/10 bg-[#222] text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
