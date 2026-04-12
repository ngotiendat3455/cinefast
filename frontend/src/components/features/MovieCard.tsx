import { Link } from 'react-router-dom'
import type { MovieListItem } from '../../types/movie'

interface MovieCardProps {
  movie: MovieListItem
}

export default function MovieCard({ movie }: MovieCardProps) {
  const releaseDate = new Date(movie.release_date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950/90 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-4">
          <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-zinc-100">
            {movie.rating}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">{movie.title}</h3>
          <p className="text-sm text-zinc-400">{movie.genre}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>{movie.duration_min} min</span>
          <span>{releaseDate}</span>
        </div>
      </div>
    </Link>
  )
}
