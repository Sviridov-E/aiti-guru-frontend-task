import { AuthPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { Toaster } from '@/shared/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import { checkUser } from './lib/check-auth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
])

const queryClient = new QueryClient()

function App() {
  useEffect(() => {
    checkUser()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position='bottom-center' richColors />
    </QueryClientProvider>
  )
}

export default App
