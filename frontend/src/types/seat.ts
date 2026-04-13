export type SeatState = 'available' | 'selected' | 'locked' | 'sold'

export interface SeatMapConfig {
  rows: string[]
  seats_per_row: number
}

export interface SeatItem {
  label: string
  row: string
  number: number
  state: SeatState
}

export interface SeatAvailabilityResponse {
  showtime_id: number
  movie_title: string
  cinema_name: string
  cinema_location: string
  room_name: string
  showtime_start: string
  showtime_end: string
  format: string
  language: string
  price_per_seat: string
  seat_map: SeatMapConfig
  seats: SeatItem[]
  selected_seat_labels: string[]
  countdown_seconds: number
  lock_expires_at: string | null
}

export interface SeatLockPayload {
  showtime_id: number
  seat_labels: string[]
  session_id: string
}
