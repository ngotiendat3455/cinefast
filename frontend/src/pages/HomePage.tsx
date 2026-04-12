import { Link } from 'react-router-dom'
import HeroCarousel from '../components/features/HeroCarousel'
import MovieCard from '../components/features/MovieCard'
import { useMovies } from '../hooks/useMovies'
import { useAuthStore } from '../store/authStore'

export default function HomePage() {
  const { user, accessToken } = useAuthStore()
  const moviesQuery = useMovies()

  const movies = moviesQuery.data ?? []
  const featuredMovies = movies.filter((movie) => movie.is_featured)
  const nowShowing = movies.filter((movie) => movie.status === 'NOW_SHOWING')
  const comingSoon = movies.filter((movie) => movie.status === 'COMING_SOON')

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,83,9,0.22),transparent_28%),linear-gradient(180deg,#09090b_0%,#111827_54%,#050816_100%)] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
              Movie Discovery
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">
                Find the right film, then lock the right night.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                Browse trending releases, scan showtimes by date and cinema, and move directly
                into seat selection without the usual booking friction.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-zinc-950/70 p-5 backdrop-blur">
            <div>
              <p className="text-sm text-zinc-400">
                {accessToken ? `Signed in as ${user?.name}` : 'Guest browsing mode'}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{nowShowing.length} films on deck</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={accessToken ? '/profile' : '/register'}
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
              >
                {accessToken ? 'Open profile' : 'Create account'}
              </Link>
              {!accessToken && (
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </section>

        <HeroCarousel movies={featuredMovies.length ? featuredMovies : movies.slice(0, 3)} />

        {moviesQuery.isLoading && (
          <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/80 p-8 text-center text-zinc-300">
            Loading movies and showtimes...
          </div>
        )}

        {moviesQuery.isError && (
          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-500/10 p-8 text-center text-red-200">
            Unable to load movie discovery data. Confirm the backend is running and migrations are applied.
          </div>
        )}

        {!moviesQuery.isLoading && !moviesQuery.isError && (
          <>
            <section className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Now Showing</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Book tonight&apos;s strongest picks</h2>
                </div>
                <span className="text-sm text-zinc-400">{nowShowing.length} titles</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {nowShowing.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-amber-200">Coming Soon</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Plan ahead for the next wave</h2>
                </div>
                <span className="text-sm text-zinc-400">{comingSoon.length} titles</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {comingSoon.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
