import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TicketSelector from '../components/TicketSelector'
import { MapPin, Calendar } from 'lucide-react'
import { getEventById } from '../data/events'

export default function EventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const eventData = id ? getEventById(id) : null

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Evento não encontrado
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }))
  }

  const handleBuyNow = () => {
    // Verificar se há ingressos selecionados
    const hasTickets = Object.values(quantities).some((qty) => qty > 0)
    if (hasTickets) {
      navigate('/checkout', {
        state: {
          event: eventData,
          quantities,
        },
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner do Evento */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${eventData.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {eventData.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-lg md:text-xl">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{eventData.date}</span>
            </div>
            <span>|</span>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{eventData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna Esquerda - Detalhes */}
          <main className="flex-1 lg:max-w-2xl">
            {/* Descrição */}
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {eventData.description}
              </p>
            </section>

            {/* Line-up */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">LINEUP:</h2>
              <div className="flex flex-wrap gap-6">
                {eventData.lineup.map((artist, index) => (
                  <div key={index} className="text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-medium mb-3 mx-auto">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-900 font-medium">{artist.name}</p>
                  </div>
                ))}
                <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
                  <p className="text-gray-600 font-medium">e mais...</p>
                </div>
              </div>
            </section>

            {/* Localização */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                LOCALIZAÇÃO:{' '}
                <span className="font-normal text-gray-700">
                  {eventData.location}
                </span>
              </h2>
              <div className="rounded-xl overflow-hidden shadow-medium h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Ver no Google Maps: {eventData.location}
                </a>
              </div>
            </section>
          </main>

          {/* Sidebar Direita - Compra de Ingressos */}
          <aside className="lg:w-96 flex-shrink-0">
            <TicketSelector
              tickets={eventData.tickets}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
            />
            <div className="mt-4">
              <button
                onClick={handleBuyNow}
                disabled={
                  !Object.values(quantities).some((qty) => qty > 0)
                }
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                COMPRAR AGORA
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
