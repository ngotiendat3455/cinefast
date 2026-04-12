import { Link } from 'react-router-dom'
import type { MovieListItem } from '../../types/movie'

interface HeroCarouselProps {
  movies: MovieListItem[]
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  if (!movies.length) {
    return null
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.25),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_30%)]" />
      <div className="relative grid gap-6 p-5 md:grid-cols-[1.35fr_0.85fr] md:p-8">
        <article
          className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-cover bg-center p-6 md:p-8"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(12, 10, 9, 0.2), rgba(12, 10, 9, 0.88)), url(${movies[0].backdrop_url})` }}
        >
          <div className="flex h-full max-w-xl flex-col justify-between gap-8">
            <div className="space-y-4">
              <span className="inline-flex w-fit rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                Featured Tonight
              </span>
              <div className="space-y-3">
                <h1 className="max-w-lg text-4xl font-black tracking-tight text-white md:text-6xl">
                  {movies[0].title}
                </h1>
                <p className="max-w-lg text-sm leading-6 text-zinc-200 md:text-base">
                  {movies[0].genre} / {movies[0].rating} / {movies[0].duration_min} min
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/movies/${movies[0].id}`}
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
              >
                Explore showtimes
              </Link>
              <span className="rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm text-zinc-100">
                Cinematic booking flow starts here
              </span>
            </div>
          </div>
        </article>

        <div className="grid gap-4">
          {movies.slice(1, 3).map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group flex min-h-[170px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-900/80"
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="h-full w-28 object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
                    {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
                  </p>
                  <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                  <p className="text-sm text-zinc-400">{movie.genre}</p>
                </div>
                <p className="text-sm text-zinc-300">
                  {movie.rating} / {movie.duration_min} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
