import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TicketSelector from '../components/TicketSelector'
import { MapPin, Calendar } from 'lucide-react'

// Dados mockados do evento
const eventData = {
  id: '1',
  title: 'HORIZON FESTIVAL 2024',
  date: '25-27/10/2024',
  location: 'Allianz Parque, São Paulo, SP',
  description:
    'Experience the ultimate music festival featuring top artists, art installations, and immersive experiences at the heart of São Paulo. Join us for three unforgettable days of music, food, and community.',
  lineup: [
    {
      name: 'The Lumineers',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
    },
    {
      name: 'Florence + The Machine',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
    },
    {
      name: 'Tame Impala',
      image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=200',
    },
    {
      name: 'Hozier',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200',
    },
  ],
  tickets: [
    {
      id: 'early-bird',
      name: 'EARLY BIRD PASS',
      price: 799,
      status: 'limited' as const,
      statusText: '5 Restantes',
    },
    {
      id: 'general',
      name: 'GENERAL ADMISSION',
      price: 1299,
      status: 'selling-fast' as const,
      statusText: 'Vendendo Rápido',
    },
    {
      id: 'vip',
      name: 'VIP EXPERIENCE',
      price: 2599,
      status: 'available' as const,
      statusText: 'Disponibilidade Limitada',
    },
  ],
}

export default function EventPage() {
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

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
            backgroundImage:
              'url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920)',
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
              <div className="rounded-xl overflow-hidden shadow-medium h-64 md:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197584455426!2d-46.681583!3d-23.527562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57fd1d715d45%3A0x864e54213d853e!2sAllianz%20Parque!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
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
