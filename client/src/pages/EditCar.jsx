import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function EditCar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [fuel, setFuel] = useState('Essence')
  const [year, setYear] = useState(new Date().getFullYear())
  const [description, setDescription] = useState('')
  const [transmission, setTransmission] = useState('Automatique')

  useEffect(() => {
    api.get('/cars')
      .then((res) => {
        const car = res.data.find((c) => c.id === id)
        if (!car) {
          toast.error('Car not found.')
          navigate('/')
          return
        }
        setName(car.name || '')
        setBrand(car.brand || '')
        setPrice(car.price || '')
        setMainImage(car.mainImage || '')
        setImage2(car.image2 || '')
        setImage3(car.image3 || '')
        setVideoUrl(car.videoUrl || '')
        setVideoId(car.videoId || '')
        setFuel(car.fuel || 'Essence')
        setYear(car.year || new Date().getFullYear())
        setDescription(car.description || '')
        setTransmission(car.transmission || 'Automatique')
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load car.')
        navigate('/')
      })
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = { name, brand, price, mainImage, image2, image3, videoUrl, videoId, fuel, year: Number(year), description, transmission }
    console.log('Submitting:', formData)
    try {
      await api.put(`/cars/${id}`, formData)
      toast.success('Car updated successfully!')
      navigate(`/car/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update car.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24 sm:px-8 lg:px-10">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Edit Car
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Main Image URL</label>
          <input
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Image 2 URL</label>
          <input
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Image 3 URL</label>
          <input
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option>Automatique</option>
              <option>Manuelle</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
