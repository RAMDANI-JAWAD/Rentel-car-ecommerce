import { useState, useEffect, useRef } from 'react'
import HeroSection from '../component/HeroSection'
import SearchBar from '../component/SearchBar'
import CarCard from '../component/CarCard'
import ServicesSection from '../component/ServicesSection'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Home() {
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState('')
  const [fuelFilter, setFuelFilter] = useState('All')
  const [favorites, setFavorites] = useState([])
  const carsRef = useRef(null)

  const fuelTypes = ['All', 'Essence', 'Diesel', 'Hybride', 'Électrique']

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then(setCars)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    api.get('/favorites')
      .then((r) => setFavorites(r.data))
      .catch(() => {})
  }, [])

  const toggleFavorite = async (car) => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to add favorites.')
      return
    }

    const isFav = favorites.some((f) => f.id === car.id)

    try {
      if (isFav) {
        const res = await api.delete(`/favorites/${car.id}`)
        setFavorites(res.data.favorites)
        toast.success('Removed from favorites.')
      } else {
        const res = await api.post('/favorites', { car })
        setFavorites(res.data.favorites)
        toast.success('Added to favorites.')
      }
    } catch {
      toast.error('Failed to update favorites.')
    }
  }

  const filtered = cars.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesFuel = fuelFilter === 'All' || c.fuel === fuelFilter
    return matchesSearch && matchesFuel
  })

  const scrollToCars = () => {
    carsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <HeroSection onExplore={scrollToCars} />

      <SearchBar value={search} onChange={setSearch} />

      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap justify-center gap-2 px-6 sm:px-8 lg:px-10">
        {fuelTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFuelFilter(type)}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              fuelFilter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

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
            <CarCard
              key={car.id}
              car={car}
              isFav={favorites.some((f) => f.id === car.id)}
              onToggleFav={toggleFavorite}
            />
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
