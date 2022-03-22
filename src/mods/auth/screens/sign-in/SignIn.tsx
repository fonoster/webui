import type { GetServerSideProps, NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

import { Button, Container, Text, Title } from '@/ui'
import { SignInIcon } from '@/ui'

import { useRedirect } from '../../hooks/useRedirect'
import { PoliciesOfUse } from './PoliciesOfUse'

export const SignIn: NextPage = () => {
  const [isLoading, setLoading] = useState(false)

  useRedirect()

  const signInGithub = useCallback(() => {
    setLoading(true)

    signIn('github')
  }, [])

  return (
    <Container>
      <div className="max-w-lg mx-auto">
        <SignInIcon />

        <Title className="my-7">Sign in to Fonoster</Title>
        <Text className="mb-7">
          Create a smart voice applications that meets your business needs
          without the clutter of unneeded features or historically burdensome
          customizations.
        </Text>

        <Button
          loading={isLoading}
          onClick={signInGithub}
          data-intent="Sign in to Fonoster with Github account"
        >
          Sign in with Github
        </Button>

        <PoliciesOfUse />
      </div>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  return {
    props: {
      session,
    },
  }
}

export default SignIn
