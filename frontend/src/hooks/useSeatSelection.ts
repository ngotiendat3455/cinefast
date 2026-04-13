import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { seatService } from '../services/seatService'
import type { SeatAvailabilityResponse, SeatItem } from '../types/seat'

const SEAT_SESSION_STORAGE_KEY = 'cinefast-seat-session'

function getOrCreateSeatSessionId() {
  const existing = window.localStorage.getItem(SEAT_SESSION_STORAGE_KEY)
  if (existing) {
    return existing
  }

  const sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `seat-session-${Date.now()}`
  window.localStorage.setItem(SEAT_SESSION_STORAGE_KEY, sessionId)
  return sessionId
}

async function releaseSeatsKeepalive(
  apiBaseUrl: string,
  showtimeId: number,
  sessionId: string,
  seatLabels: string[],
) {
  if (!seatLabels.length) {
    return
  }

  try {
    await fetch(`${apiBaseUrl}/seats/lock`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showtime_id: showtimeId,
        seat_labels: seatLabels,
        session_id: sessionId,
      }),
      keepalive: true,
    })
  } catch {
    // best-effort cleanup on navigation away
  }
}

export function useSeatSelection(showtimeId: number) {
  const queryClient = useQueryClient()
  const sessionIdRef = useRef<string | null>(null)
  const latestLayoutRef = useRef<SeatAvailabilityResponse | null>(null)
  const hasAutoReleasedRef = useRef(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  if (!sessionIdRef.current && typeof window !== 'undefined') {
    sessionIdRef.current = getOrCreateSeatSessionId()
  }

  const sessionId = sessionIdRef.current ?? `seat-session-${showtimeId}`
  const seatQueryKey = ['seat-map', showtimeId, sessionId]

  const seatQuery = useQuery({
    queryKey: seatQueryKey,
    queryFn: () => seatService.getShowtimeSeats(showtimeId, sessionId),
    enabled: Number.isFinite(showtimeId),
    staleTime: 0,
    refetchInterval: 15_000,
  })

  const setLayoutData = (data: SeatAvailabilityResponse) => {
    latestLayoutRef.current = data
    queryClient.setQueryData(seatQueryKey, data)
  }

  const lockMutation = useMutation({
    mutationFn: (seatLabels: string[]) =>
      seatService.lockSeats({
        showtime_id: showtimeId,
        seat_labels: seatLabels,
        session_id: sessionId,
      }),
    onSuccess: setLayoutData,
  })

  const releaseMutation = useMutation({
    mutationFn: (seatLabels: string[]) =>
      seatService.releaseSeats({
        showtime_id: showtimeId,
        seat_labels: seatLabels,
        session_id: sessionId,
      }),
    onSuccess: setLayoutData,
  })

  useEffect(() => {
    if (seatQuery.data) {
      latestLayoutRef.current = seatQuery.data
      setRemainingSeconds(seatQuery.data.countdown_seconds)
      hasAutoReleasedRef.current = false
    }
  }, [seatQuery.data])

  useEffect(() => {
    const expiresAt = seatQuery.data?.lock_expires_at
    const selectedSeatLabels = seatQuery.data?.selected_seat_labels ?? []
    if (!expiresAt) {
      setRemainingSeconds(0)
      hasAutoReleasedRef.current = false
      return
    }

    const tick = () => {
      const diff = Math.max(
        0,
        Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000),
      )
      setRemainingSeconds(diff)

      if (diff === 0 && selectedSeatLabels.length && !hasAutoReleasedRef.current) {
        hasAutoReleasedRef.current = true
        releaseMutation.mutate(selectedSeatLabels)
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [releaseMutation, seatQuery.data?.lock_expires_at, seatQuery.data?.selected_seat_labels])

  useEffect(() => {
    const cleanup = () => {
      const latestLayout = latestLayoutRef.current
      if (!latestLayout?.selected_seat_labels.length) {
        return
      }

      void releaseSeatsKeepalive(
        'http://127.0.0.1:8000/api/v1',
        showtimeId,
        sessionId,
        latestLayout.selected_seat_labels,
      )
    }

    window.addEventListener('beforeunload', cleanup)
    return () => {
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [sessionId, showtimeId])

  const toggleSeat = async (seat: SeatItem) => {
    if (seat.state === 'sold' || seat.state === 'locked') {
      return
    }

    if (seat.state === 'selected') {
      await releaseMutation.mutateAsync([seat.label])
      return
    }

    await lockMutation.mutateAsync([seat.label])
  }

  return {
    layout: seatQuery.data,
    isLoading: seatQuery.isLoading,
    isError: seatQuery.isError,
    error: lockMutation.error ?? releaseMutation.error ?? seatQuery.error,
    remainingSeconds,
    isMutating: lockMutation.isPending || releaseMutation.isPending,
    toggleSeat,
    refetch: seatQuery.refetch,
  }
}
