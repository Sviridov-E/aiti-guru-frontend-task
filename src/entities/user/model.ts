import { create } from 'zustand'

type IdleStatus = 'initial' | 'loading' | 'done'

interface UserState {
  user: { username: string; id: number } | null
  idleStatus: IdleStatus
  startCheckUser: VoidFunction
  finishCheckUser: VoidFunction
  login: (user: NonNullable<UserState['user']>) => void
  logout: VoidFunction
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  idleStatus: 'initial',
  startCheckUser: () => set({ idleStatus: 'loading' }),
  finishCheckUser: () => set({ idleStatus: 'done' }),
  login: user => set({ user }),
  logout: () => set({ user: null, idleStatus: 'done' }),
}))
