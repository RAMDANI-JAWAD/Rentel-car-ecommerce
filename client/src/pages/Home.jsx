import { useState, useEffect, useRef } from 'react'
import HeroSection from '../component/HeroSection'
import SearchBar from '../component/SearchBar'
import CarCard from '../component/CarCard'
import ServicesSection from '../component/ServicesSection'

export default function Home() {
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState('')
  const carsRef = useRef(null)

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then(setCars)
  }, [])

  const filtered = cars.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const scrollToCars = () => {
    carsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <HeroSection onExplore={scrollToCars} />

      <SearchBar value={search} onChange={setSearch} />

      <section
        ref={carsRef}
        id="cars"
        className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
      >
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Voitures populaires
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-20 text-center text-lg text-muted-foreground">
              Aucune voiture trouvée
            </p>
          )}
        </div>
      </section>

      <ServicesSection />
    </>
  )
}
