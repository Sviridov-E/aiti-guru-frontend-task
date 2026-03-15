import { useUserStore } from '@/entities/user'
import { Spinner } from '@/shared/ui/spinner'
import { Navigate } from 'react-router-dom'
import { Dashboard } from './ui'

export const DashboardPage = () => {
  const user = useUserStore(store => store.user)
  const idleStatus = useUserStore(store => store.idleStatus)

  if (!user) {
    if (idleStatus !== 'done')
      return (
        <div className='flex items-center justify-center w-screen h-screen'>
          <Spinner className='size-16' />
        </div>
      )

    return <Navigate to='/login' />
  }

  return <Dashboard />
}
