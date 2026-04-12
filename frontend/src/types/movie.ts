export type MovieStatus = 'NOW_SHOWING' | 'COMING_SOON'
export type ShowtimeFormat = '2D' | '3D' | 'IMAX'

export interface MovieListItem {
  id: number
  title: string
  slug: string
  genre: string
  rating: string
  duration_min: number
  release_date: string
  poster_url: string
  backdrop_url: string
  status: MovieStatus
  is_featured: boolean
}

export interface MovieDetail extends MovieListItem {
  trailer_url: string | null
  synopsis: string
  cast: string
  formats: ShowtimeFormat[]
}

export interface ShowtimeCinema {
  id: number
  name: string
  location: string
}

export interface ShowtimeRoom {
  id: number
  name: string
}

export interface ShowtimeItem {
  id: number
  start_time: string
  end_time: string
  format: ShowtimeFormat
  language: string
  price: string
  cinema: ShowtimeCinema
  room: ShowtimeRoom
}

export interface MovieShowtimeGroup {
  date: string
  items: ShowtimeItem[]
}
