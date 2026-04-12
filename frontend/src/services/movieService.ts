import type { MovieDetail, MovieListItem, MovieShowtimeGroup } from '../types/movie'
import api from './api'

export const movieService = {
  list: async (status?: string): Promise<MovieListItem[]> => {
    const { data } = await api.get<MovieListItem[]>('/movies', {
      params: status ? { status } : undefined,
    })
    return data
  },

  getById: async (movieId: number): Promise<MovieDetail> => {
    const { data } = await api.get<MovieDetail>(`/movies/${movieId}`)
    return data
  },

  getShowtimes: async (movieId: number): Promise<MovieShowtimeGroup[]> => {
    const { data } = await api.get<MovieShowtimeGroup[]>(`/movies/${movieId}/showtimes`)
    return data
  },
}
