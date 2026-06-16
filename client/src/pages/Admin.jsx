import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Admin() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [fuel, setFuel] = useState('Essence')
  const [year, setYear] = useState(new Date().getFullYear())

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in as admin.')
      return navigate('/login')
    }

    try {
      const res = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, brand, price, mainImage, fuel, year: Number(year) }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
        return
      }

      toast.success('Car added successfully!')
      setName('')
      setBrand('')
      setPrice('')
      setMainImage('')
      setFuel('Essence')
      setYear(new Date().getFullYear())
    } catch {
      toast.error('Failed to add car.')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24 sm:px-8 lg:px-10">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Admin Panel — Add Car
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. BMW M4 Competition"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. BMW"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 980 000 DH"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Image URL</label>
          <input
            type="url"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="https://example.com/car.jpg"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Fuel Type</label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option>Essence</option>
              <option>Diesel</option>
              <option>Hybride</option>
              <option>Électrique</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max="2030"
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Add Car
        </button>
      </form>
    </div>
  )
}
