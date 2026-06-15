import { Search } from 'lucide-react'
import { Input } from '../components/ui/input'

export default function SearchBar({ value, onChange }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher une voiture..."
          className="h-11 pl-10"
        />
      </div>
    </section>
  )
}
