export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image: string
  lineup: Array<{
    name: string
    image: string
  }>
  tickets: Array<{
    id: string
    name: string
    price: number
    status: 'available' | 'selling-fast' | 'limited' | 'sold-out'
    statusText: string
  }>
}

export const events: Event[] = [
  {
    id: '1',
    title: 'HORIZON FESTIVAL 2024',
    date: '25-27/10/2024',
    location: 'Allianz Parque, São Paulo, SP',
    description:
      'Experience the ultimate music festival featuring top artists, art installations, and immersive experiences at the heart of São Paulo. Join us for three unforgettable days of music, food, and community.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920',
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
        status: 'limited',
        statusText: '5 Restantes',
      },
      {
        id: 'general',
        name: 'GENERAL ADMISSION',
        price: 1299,
        status: 'selling-fast',
        statusText: 'Vendendo Rápido',
      },
      {
        id: 'vip',
        name: 'VIP EXPERIENCE',
        price: 2599,
        status: 'available',
        statusText: 'Disponibilidade Limitada',
      },
    ],
  },
  {
    id: '2',
    title: 'Neon Dreams Music Festival',
    date: '15/10/2024',
    location: 'Parque Ibirapuera, São Paulo, SP',
    description:
      'Uma experiência musical única com artistas eletrônicos de renome mundial. Prepare-se para uma noite inesquecível com luzes neon, música eletrônica de alta qualidade e uma atmosfera vibrante.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920',
    lineup: [
      {
        name: 'Deadmau5',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'Skrillex',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
      {
        name: 'Martin Garrix',
        image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=200',
      },
    ],
    tickets: [
      {
        id: 'general',
        name: 'GENERAL ADMISSION',
        price: 250,
        status: 'selling-fast',
        statusText: 'Vendendo Rápido',
      },
      {
        id: 'vip',
        name: 'VIP EXPERIENCE',
        price: 500,
        status: 'available',
        statusText: 'Disponível',
      },
    ],
  },
  {
    id: '3',
    title: 'Abstract Art Workshop',
    date: '10/10/2024',
    location: 'Centro Cultural, Rio de Janeiro, RJ',
    description:
      'Workshop prático de arte abstrata com artistas renomados. Aprenda técnicas avançadas de pintura, composição e expressão artística. Material incluso.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920',
    lineup: [
      {
        name: 'Maria Silva',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'João Santos',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
    ],
    tickets: [
      {
        id: 'workshop',
        name: 'WORKSHOP COMPLETO',
        price: 150,
        status: 'available',
        statusText: 'Disponível',
      },
    ],
  },
  {
    id: '4',
    title: 'City Rooftop Party',
    date: '30/10/2024',
    location: 'Rooftop Bar, São Paulo, SP',
    description:
      'Festa exclusiva no rooftop com vista panorâmica da cidade. DJs residentes, open bar premium e ambiente sofisticado. Dress code: elegante casual.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920',
    lineup: [
      {
        name: 'DJ Anderson',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'DJ Maria',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
    ],
    tickets: [
      {
        id: 'general',
        name: 'ENTRADA GERAL',
        price: 180,
        status: 'selling-fast',
        statusText: 'Últimos ingressos',
      },
      {
        id: 'vip',
        name: 'VIP TABLE',
        price: 800,
        status: 'limited',
        statusText: '3 Mesas restantes',
      },
    ],
  },
  {
    id: '5',
    title: 'Jazz Night Experience',
    date: '15/10/2024',
    location: 'Teatro Municipal, Belo Horizonte, MG',
    description:
      'Uma noite especial de jazz com artistas consagrados. Ambiente intimista e acústica perfeita para apreciar os melhores sons do jazz contemporâneo e clássico.',
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920',
    lineup: [
      {
        name: 'Jazz Quartet',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'Smooth Jazz Band',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
    ],
    tickets: [
      {
        id: 'general',
        name: 'INGRESSO GERAL',
        price: 120,
        status: 'available',
        statusText: 'Disponível',
      },
      {
        id: 'premium',
        name: 'ASSENTO PREMIUM',
        price: 200,
        status: 'limited',
        statusText: 'Poucos disponíveis',
      },
    ],
  },
  {
    id: '6',
    title: 'Tech Conference 2024',
    date: '20/10/2024',
    location: 'Centro de Convenções, São Paulo, SP',
    description:
      'Conferência de tecnologia com palestrantes internacionais. Explore as últimas tendências em IA, desenvolvimento, cloud computing e inovação. Networking e workshops incluídos.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920',
    lineup: [
      {
        name: 'Tech Leaders Panel',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'AI Innovation Talk',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
    ],
    tickets: [
      {
        id: 'early-bird',
        name: 'EARLY BIRD',
        price: 350,
        status: 'limited',
        statusText: 'Últimos dias',
      },
      {
        id: 'general',
        name: 'INGRESSO GERAL',
        price: 450,
        status: 'available',
        statusText: 'Disponível',
      },
      {
        id: 'vip',
        name: 'VIP PASS',
        price: 800,
        status: 'available',
        statusText: 'Disponível',
      },
    ],
  },
  {
    id: '7',
    title: 'Food & Wine Festival',
    date: '28/10/2024',
    location: 'Parque Villa-Lobos, São Paulo, SP',
    description:
      'Festival gastronômico com os melhores chefs e sommeliers do país. Degustações, workshops de culinária e harmonização de vinhos. Uma experiência para os sentidos.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920',
    lineup: [
      {
        name: 'Chef Renomado',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200',
      },
      {
        name: 'Sommelier Expert',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200',
      },
    ],
    tickets: [
      {
        id: 'general',
        name: 'INGRESSO GERAL',
        price: 200,
        status: 'selling-fast',
        statusText: 'Vendendo rápido',
      },
      {
        id: 'premium',
        name: 'EXPERIÊNCIA PREMIUM',
        price: 400,
        status: 'available',
        statusText: 'Disponível',
      },
    ],
  },
]

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}
