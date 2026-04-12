import { useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => movieService.list(),
  })
}

export function useMovie(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => movieService.getById(movieId),
    enabled: Number.isFinite(movieId),
  })
}

export function useMovieShowtimes(movieId: number) {
  return useQuery({
    queryKey: ['movie-showtimes', movieId],
    queryFn: () => movieService.getShowtimes(movieId),
    enabled: Number.isFinite(movieId),
  })
}
