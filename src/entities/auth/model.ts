import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  refreshToken: string | null
  accessToken: string | null
  rememberMe: boolean
  login: (
    tokens: { refreshToken: string; accessToken: string },
    rememberMe: boolean
  ) => void
  logout: VoidFunction
}

export const useSessionAuthStore = create(
  persist<AuthState>(
    set => ({
      refreshToken: null,
      accessToken: null,
      rememberMe: false,
      login: ({ refreshToken, accessToken }, rememberMe) =>
        set({ refreshToken, accessToken, rememberMe }),
      logout: () => {
        set({ refreshToken: null, accessToken: null, rememberMe: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: name =>
          localStorage.getItem(name) || sessionStorage.getItem(name),
        setItem: (name, value) => {
          const { state } = JSON.parse(value)

          if (!state.accessToken && !state.refreshToken) {
            localStorage.removeItem(name)
            sessionStorage.removeItem(name)
            return
          }

          if (state.rememberMe) {
            localStorage.setItem(name, value)
            sessionStorage.removeItem(name)
          } else {
            sessionStorage.setItem(name, value)
            localStorage.removeItem(name)
          }
        },
        removeItem: name => {
          localStorage.removeItem(name)
          sessionStorage.removeItem(name)
        },
      })),
    }
  )
)
