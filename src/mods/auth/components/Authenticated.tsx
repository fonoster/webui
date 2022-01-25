import { NextPage } from 'next'
import { useEffect } from 'react'

import { Spinner } from '@/ui/Spinner'

import { useLoggedIn } from '../hooks/useLoggedIn'
import { useRedirect } from '../hooks/useRedirect'

export const Authenticated: NextPage = ({ children }) => {
  const { isLoading, isAuthenticated } = useLoggedIn()
  const {
    hasRedirectToChecked,
    setHasRedirectToChecked,
    redirectToSignIn,
    redirectToNextPage,
  } = useRedirect()

  useEffect(() => {
    if (isLoading) return

    isAuthenticated ? redirectToNextPage() : redirectToSignIn()

    setHasRedirectToChecked(true)
  }, [
    isLoading,
    isAuthenticated,
    redirectToSignIn,
    redirectToNextPage,
    setHasRedirectToChecked,
  ])

  return isAuthenticated && hasRedirectToChecked ? <>{children}</> : <Spinner />
}
