import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

interface EventCardProps {
  id: string
  image: string
  title: string
  location: string
  date: string
  price: string
  badge?: string
  badgeColor?: 'blue' | 'red' | 'orange'
}

export default function EventCard({
  id,
  image,
  title,
  location,
  date,
  price,
  badge,
  badgeColor = 'blue',
}: EventCardProps) {
  const badgeColors = {
    blue: 'bg-primary-600',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
  }

  return (
    <Link
      to={`/evento/${id}`}
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300 group"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div
            className={`absolute top-3 right-3 ${badgeColors[badgeColor]} text-white px-3 py-1 rounded-lg text-xs font-semibold`}
          >
            {badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{date}</span>
          <span className="text-gray-900 font-semibold">
            {price} <span className="text-gray-500 text-sm font-normal">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
