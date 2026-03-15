import { checkAuth } from '@/entities/auth'
import { useUserStore } from '@/entities/user'

export const checkUser = async () => {
  const { startCheckUser, login, finishCheckUser, idleStatus, user } =
    useUserStore.getState()

  if (idleStatus !== 'initial' || user) return

  startCheckUser()

  try {
    const user = await checkAuth()
    if (user) {
      login(user)
    }
  } finally {
    finishCheckUser()
  }
}
