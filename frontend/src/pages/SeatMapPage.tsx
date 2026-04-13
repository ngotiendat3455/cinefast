import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSeatSelection } from '../hooks/useSeatSelection'
import type { SeatItem } from '../types/seat'

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getSeatClassName(state: SeatItem['state']) {
  if (state === 'selected') {
    return 'border-emerald-300/60 bg-emerald-400/20 text-emerald-100 shadow-lg shadow-emerald-950/40'
  }
  if (state === 'locked') {
    return 'cursor-not-allowed border-amber-300/20 bg-amber-500/10 text-amber-100'
  }
  if (state === 'sold') {
    return 'cursor-not-allowed border-rose-300/15 bg-rose-500/10 text-rose-100'
  }
  return 'border-white/10 bg-white/5 text-zinc-100 hover:border-sky-300/30 hover:bg-sky-400/10'
}

export default function SeatMapPage() {
  const { showtimeId } = useParams()
  const parsedShowtimeId = Number(showtimeId)
  const { layout, isLoading, isError, error, remainingSeconds, isMutating, toggleSeat, refetch } =
    useSeatSelection(parsedShowtimeId)

  const [scale, setScale] = useState(1)

  const seatsByRow = useMemo(() => {
    const rows = new Map<string, SeatItem[]>()
    for (const seat of layout?.seats ?? []) {
      const rowSeats = rows.get(seat.row) ?? []
      rowSeats.push(seat)
      rows.set(seat.row, rowSeats)
    }
    return rows
  }, [layout?.seats])

  const selectedSeats = layout?.selected_seat_labels ?? []
  const totalPrice = selectedSeats.length * Number(layout?.price_per_seat ?? 0)

  const errorMessage =
    error instanceof Error ? error.message : isError ? 'Unable to load seat map.' : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16 text-center text-zinc-300">
        Loading interactive seat map...
      </div>
    )
  }

  if (!layout || isError) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-center">
          <h1 className="text-3xl font-black text-white">Seat map unavailable</h1>
          <p className="mt-3 text-red-100">{errorMessage ?? 'Please verify the backend and retry.'}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_22%),linear-gradient(180deg,#09090b_0%,#111827_52%,#050816_100%)] px-4 pb-40 pt-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">
              <span>Interactive Seat Selection</span>
              <span>{layout.format}</span>
              <span>{layout.language}</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white md:text-5xl">{layout.movie_title}</h1>
              <p className="text-base leading-7 text-zinc-300">
                {layout.cinema_name} / {layout.cinema_location} / {layout.room_name}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
              <span>
                {new Date(layout.showtime_start).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>Seat price ${layout.price_per_seat}</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Lock timer
              </p>
              <p className="mt-2 text-4xl font-black text-amber-200">
                {remainingSeconds ? formatCountdown(remainingSeconds) : '00:00'}
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Selected seats auto-release when the countdown hits zero or when you leave this page.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">
                Selected: {selectedSeats.length}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">
                Zoom: {(scale * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setScale((currentScale) => Math.max(0.9, currentScale - 0.15))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Zoom out
              </button>
              <button
                type="button"
                onClick={() => setScale((currentScale) => Math.min(2.4, currentScale + 0.15))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Zoom in
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/80 p-5 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Legend</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-sm border border-white/10 bg-white/5" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-sm border border-emerald-300/60 bg-emerald-400/20" />
                <span>Selected by you</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-sm border border-amber-300/20 bg-amber-500/10" />
                <span>Locked by another user</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-sm border border-rose-300/15 bg-rose-500/10" />
                <span>Sold</span>
              </div>
            </div>

            <div className="mt-8 rounded-[1.2rem] border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
              <p className="font-semibold text-white">Mobile hint</p>
              <p className="mt-2 leading-6">
                Tap seats to select them. Use the zoom buttons if you need a larger view on small screens.
              </p>
            </div>

            {errorMessage && (
              <div className="mt-5 rounded-[1.2rem] border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/80 p-5 md:col-span-3">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 h-3 w-full max-w-3xl rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.15),rgba(250,204,21,0.55),rgba(56,189,248,0.15))]" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Screen this way</p>
            </div>

            <div
              className="overflow-auto rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),transparent_32%)] p-4"
            >
              <div
                className="mx-auto flex min-w-[720px] max-w-max flex-col gap-4 px-4 py-6 transition-transform duration-200"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              >
                {Array.from(seatsByRow.entries()).map(([row, rowSeats]) => (
                  <div key={row} className="grid grid-cols-[48px_1fr] items-center gap-3">
                    <div className="text-center text-sm font-bold text-zinc-400">{row}</div>
                    <div className="grid grid-cols-10 gap-2">
                      {rowSeats.map((seat) => (
                        <button
                          key={seat.label}
                          type="button"
                          disabled={seat.state === 'locked' || seat.state === 'sold' || isMutating}
                          onClick={() => void toggleSeat(seat)}
                          className={`h-12 rounded-xl border text-sm font-semibold transition ${getSeatClassName(
                            seat.state,
                          )}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500">Selected seats</p>
            <p className="text-lg font-semibold text-white">
              {selectedSeats.length ? selectedSeats.join(', ') : 'Choose seats to continue'}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="text-right">
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-2xl font-black text-amber-200">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              type="button"
              disabled={!selectedSeats.length}
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to discovery
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
