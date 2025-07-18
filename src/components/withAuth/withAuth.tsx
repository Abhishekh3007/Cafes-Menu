// components/withAuth.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login')
      }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
      // You can return a loader or null here
      return null
    }

    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth
