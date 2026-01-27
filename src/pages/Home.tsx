import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import EventCard from '../components/EventCard'
import { Search, MapPin, Calendar } from 'lucide-react'

// Dados mockados de eventos
const mockEvents = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    title: 'Neon Dreams Music Festival',
    location: 'Parque Ibirapuera, São Paulo, SP',
    date: '25 OUT',
    price: 'A partir de R$ 250',
    badge: '25 OUT',
    badgeColor: 'blue' as const,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    title: 'Abstract Art Workshop',
    location: 'Centro Cultural, Rio de Janeiro, RJ',
    date: '10 OUT',
    price: 'A partir de R$ 150',
    badge: '10 OUT',
    badgeColor: 'blue' as const,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    title: 'City Rooftop Party',
    location: 'Rooftop Bar, São Paulo, SP',
    date: '30 OUT',
    price: 'A partir de R$ 180',
    badge: '30 OUT',
    badgeColor: 'blue' as const,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800',
    title: 'Jazz Night Experience',
    location: 'Teatro Municipal, Belo Horizonte, MG',
    date: '15 OUT',
    price: 'A partir de R$ 120',
    badge: '15 OUT',
    badgeColor: 'blue' as const,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    title: 'Tech Conference 2024',
    location: 'Centro de Convenções, São Paulo, SP',
    date: '20 OUT',
    price: 'A partir de R$ 350',
    badge: '20 OUT',
    badgeColor: 'blue' as const,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    title: 'Food & Wine Festival',
    location: 'Parque Villa-Lobos, São Paulo, SP',
    date: '28 OUT',
    price: 'A partir de R$ 200',
    badge: '28 OUT',
    badgeColor: 'blue' as const,
  },
]

const categories = [
  { name: 'Concertos', count: 2 },
  { name: 'Festas', count: 4 },
  { name: 'Workshops', count: 3 },
  { name: 'Conferências', count: 1 },
  { name: 'Festivals', count: 1 },
  { name: 'Artes & Cultura', count: 1 },
  { name: 'Comida & Bebida', count: 1 },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState('free')

  return (
    <div className="min-h-screen flex flex-col">
      <Header showSearch={false} />
      
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        {/* Hero Search Bar */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-strong p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 border border-gray-200 rounded-lg">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Buscar eventos, artistas, venues"
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <div className="flex items-center px-4 py-3 border border-gray-200 rounded-lg bg-white">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <select className="outline-none text-sm text-gray-600 bg-transparent">
                  <option>Qualquer Local</option>
                  <option>São Paulo, SP</option>
                  <option>Rio de Janeiro, RJ</option>
                  <option>Belo Horizonte, MG</option>
                </select>
              </div>
              <div className="flex items-center px-4 py-3 border border-gray-200 rounded-lg bg-white">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <select className="outline-none text-sm text-gray-600 bg-transparent">
                  <option>Qualquer Data</option>
                  <option>Hoje</option>
                  <option>Esta Semana</option>
                  <option>Este Mês</option>
                </select>
              </div>
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold whitespace-nowrap">
                Buscar Eventos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.name}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.name}
                        onChange={() =>
                          setSelectedCategory(
                            selectedCategory === category.name
                              ? null
                              : category.name
                          )
                        }
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h3>
                <div className="space-y-2">
                  {[
                    { value: 'free', label: 'Grátis' },
                    { value: 'under-100', label: 'Abaixo de R$100' },
                    { value: '100-250', label: 'R$100 - R$250' },
                    { value: '250-500', label: 'R$250 - R$500' },
                    { value: '500+', label: 'R$500+' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={priceRange === option.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Data</h3>
                <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Selecionar data"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Events Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                Mostrar mais eventos
              </button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
