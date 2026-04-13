import type { SeatAvailabilityResponse, SeatLockPayload } from '../types/seat'
import api from './api'

export const seatService = {
  getShowtimeSeats: async (
    showtimeId: number,
    sessionId: string,
  ): Promise<SeatAvailabilityResponse> => {
    const { data } = await api.get<SeatAvailabilityResponse>(`/showtimes/${showtimeId}/seats`, {
      params: { session_id: sessionId },
    })
    return data
  },

  lockSeats: async (payload: SeatLockPayload): Promise<SeatAvailabilityResponse> => {
    const { data } = await api.post<SeatAvailabilityResponse>('/seats/lock', payload)
    return data
  },

  releaseSeats: async (payload: SeatLockPayload): Promise<SeatAvailabilityResponse> => {
    const { data } = await api.delete<SeatAvailabilityResponse>('/seats/lock', {
      data: payload,
    })
    return data
  },
}
