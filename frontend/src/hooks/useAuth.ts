import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/auth'

export function useAuth() {
  const { user, accessToken, setAuth, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token)
      navigate('/')
    },
  })

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token)
      navigate('/')
    },
  })

  const logout = () => {
    storeLogout()
    queryClient.clear()
    navigate('/login')
  }

  return {
    user,
    isAuthenticated: !!accessToken,
    register: registerMutation,
    login: loginMutation,
    logout,
  }
}

export function useProfile() {
  const queryClient = useQueryClient()
  const { setAuth, accessToken, refreshToken } = useAuthStore()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: !!accessToken,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser)
      if (accessToken && refreshToken) {
        setAuth(updatedUser, accessToken, refreshToken)
      }
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    update: updateMutation,
  }
}
