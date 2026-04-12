import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMovie, useMovieShowtimes } from '../hooks/useMovies'

export default function MovieDetailPage() {
  const { movieId } = useParams()
  const parsedMovieId = Number(movieId)
  const movieQuery = useMovie(parsedMovieId)
  const showtimesQuery = useMovieShowtimes(parsedMovieId)
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const [format, setFormat] = useState('ALL')
  const [trailerOpen, setTrailerOpen] = useState(false)

  const deferredLocation = useDeferredValue(location.trim().toLowerCase())
  const allGroups = showtimesQuery.data ?? []

  const availableDates = useMemo(() => allGroups.map((group) => group.date), [allGroups])

  const filteredGroups = useMemo(
    () =>
      allGroups
        .filter((group) => !selectedDate || group.date === selectedDate)
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const matchesFormat = format === 'ALL' || item.format === format
            const matchesLocation =
              !deferredLocation || item.cinema.location.toLowerCase().includes(deferredLocation)
            return matchesFormat && matchesLocation
          }),
        }))
        .filter((group) => group.items.length > 0),
    [allGroups, deferredLocation, format, selectedDate],
  )

  const movie = movieQuery.data

  if (movieQuery.isLoading || showtimesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-center text-zinc-300">
        Loading movie details...
      </div>
    )
  }

  if (movieQuery.isError || !movie) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-center text-red-200">
        Movie not found or the backend response failed.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#09090b_0%,#111827_45%,#050816_100%)] pb-16">
      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(9,9,11,0.35), rgba(9,9,11,0.96)), url(${movie.backdrop_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[300px_1fr] md:px-8 md:py-16">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full max-w-[300px] rounded-[1.8rem] border border-white/10 object-cover shadow-2xl shadow-black/40"
          />

          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <Link to="/" className="inline-flex text-sm text-zinc-300 transition hover:text-white">
                Back to discovery
              </Link>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  <span>{movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}</span>
                  <span>{movie.rating}</span>
                  <span>{movie.duration_min} min</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                  {movie.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-zinc-200">{movie.synopsis}</p>
              </div>

              <div className="grid gap-4 text-sm text-zinc-300 md:grid-cols-3">
                <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Genre</p>
                  <p className="mt-1 font-semibold text-white">{movie.genre}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Cast</p>
                  <p className="mt-1 font-semibold text-white">{movie.cast}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Formats</p>
                  <p className="mt-1 font-semibold text-white">{movie.formats.join(' / ') || 'TBA'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {movie.trailer_url && (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
                >
                  Watch trailer
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (availableDates[0]) {
                    setSelectedDate(availableDates[0])
                  }
                }}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Jump to showtimes
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-8">
        <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-zinc-950/80 p-5 md:grid-cols-[1.1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Cinema location
            </label>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Downtown, Riverside..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-300/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
              Format
            </label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-300/40"
            >
              <option value="ALL">All formats</option>
              {movie.formats.map((itemFormat) => (
                <option key={itemFormat} value={itemFormat}>
                  {itemFormat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setLocation('')
              setFormat('ALL')
              setSelectedDate(null)
            }}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Reset filters
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedDate === null
                ? 'bg-amber-400 text-zinc-950'
                : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            All dates
          </button>
          {availableDates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedDate === date
                  ? 'bg-amber-400 text-zinc-950'
                  : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {new Date(date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filteredGroups.length ? (
            filteredGroups.map((group) => (
              <article
                key={group.date}
                className="rounded-[1.8rem] border border-white/10 bg-zinc-950/80 p-5"
              >
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                      Showtime Date
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {new Date(group.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-400">{group.items.length} sessions</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((showtime) => (
                    <button
                      key={showtime.id}
                      type="button"
                      onClick={() =>
                        navigate(`/seat-map/${showtime.id}`, {
                          state: { movieTitle: movie.title, showtime },
                        })
                      }
                      className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 text-left transition hover:border-amber-300/30 hover:bg-white/8"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                          {showtime.format}
                        </span>
                        <span className="text-sm text-zinc-300">${showtime.price}</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          {new Date(showtime.start_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </h3>
                        <p className="text-sm text-zinc-300">
                          {showtime.cinema.name} / {showtime.room.name}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {showtime.cinema.location} / {showtime.language}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/80 p-8 text-center text-zinc-300">
              No showtimes match the current filters.
            </div>
          )}
        </div>
      </section>

      {trailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-[1.6rem] border border-white/10 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="font-semibold text-white">{movie.title} trailer</h3>
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300 transition hover:bg-white/5"
              >
                Close
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                title={`${movie.title} trailer`}
                src={movie.trailer_url}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
