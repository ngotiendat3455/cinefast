import { Link, useLocation, useParams } from 'react-router-dom'
import type { ShowtimeItem } from '../types/movie'

interface SeatMapState {
  movieTitle?: string
  showtime?: ShowtimeItem
}

export default function SeatMapPage() {
  const { showtimeId } = useParams()
  const location = useLocation()
  const state = (location.state ?? {}) as SeatMapState

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">
          Seat Selection Next
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Seat map handoff confirmed</h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          This placeholder proves the discovery flow is wired correctly. The next feature can
          attach real-time seat locking and seat selection to this route.
        </p>

        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-500">Movie</p>
            <p className="mt-1 text-lg font-semibold text-white">{state.movieTitle ?? 'Selected movie'}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Showtime ID</p>
            <p className="mt-1 text-lg font-semibold text-white">{showtimeId}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Cinema</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {state.showtime?.cinema.name ?? 'Chosen from discovery'}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Start time</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {state.showtime
                ? new Date(state.showtime.start_time).toLocaleString()
                : 'Pending seat-map integration'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to discovery
          </Link>
          <Link
            to="/profile"
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
          >
            View profile
          </Link>
        </div>
      </div>
    </div>
  )
}
