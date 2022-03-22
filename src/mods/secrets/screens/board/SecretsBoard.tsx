import { LockOpenIcon } from '@heroicons/react/outline'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useCallback, useLayoutEffect, useState } from 'react'
import { dehydrate } from 'react-query'

import type { AppPage } from '@/@types'
import { DeleteResource } from '@/mods/shared/components/DeleteResource'
import { Notifier } from '@/mods/shared/components/Notification'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { getQueryClient } from '@/mods/shared/libs/queryClient'
import { Button, Spinner, Text, Title } from '@/ui'

import { useDeleteSecret } from '../../hooks/useDeleteSecret'
import { useSecrets } from '../../hooks/useSecrets'
import { NoSecrets } from './NoSecrets'

export const SecretsBoard: AppPage = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const { mutate, isLoading } = useDeleteSecret()
  const [deleteRef, setDeleteRef] = useState('')
  const { setTitle } = useTitle()
  const { secrets, isSuccess } = useSecrets()

  useLayoutEffect(() => {
    setTitle('Project Secrets')
  }, [setTitle])

  const onOpen = useCallback((refId: string) => {
    setDeleteModalOpen(true)
    setDeleteRef(refId)
  }, [])

  const onDelete = useCallback(() => {
    mutate(deleteRef, {
      onSuccess() {
        setDeleteModalOpen(false)

        Notifier.success('Your Secret has been successfully deleted.')
      },
    })
  }, [mutate, deleteRef])

  if (isSuccess && !secrets.length) return <NoSecrets />

  return isSuccess ? (
    <>
      <div className="mb-4 lg:w-4/6">
        <Title level={3}>Secrets Management</Title>
        <Text className="whitespace-normal">
          Secrets are encrypted variables that you can you use in your Voice
          Applications. Your secrets are only available for use within the
          Project.
          <br />
          <a
            className="term"
            href="https://learn.fonoster.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about managing Project secrets.
          </a>
        </Text>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {secrets.map(secret => (
          <div
            key={secret.name}
            className="relative rounded-lg border border-gray-400 bg-gray-600 px-4 py-4 shadow-sm flex items-center space-x-4"
          >
            <div className="flex-shrink-0">
              <LockOpenIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <Title level={5} className="m-0">
                {secret.name}
              </Title>

              <Text className="m-0 text-sm">**** **** **** **** **** ****</Text>
            </div>
            <div>
              <Button
                size="small"
                type="link"
                onClick={() => onOpen(secret.name)}
                data-desc={`Secret name: ${secret.name}`}
                data-intent="Delete Secret"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteResource
        refId={deleteRef}
        title={`Delete Secret (${deleteRef})`}
        isOpen={isDeleteModalOpen}
        isLoading={isLoading}
        onDelete={onDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  ) : (
    <Spinner />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  const queryClient = getQueryClient()

  /**
   * @todo Find a way to hydrate queries on server without using fetch or axios
   * await queryClient.prefetchQuery('projects', getProjects)
   */

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

SecretsBoard.isProtected = true

export default SecretsBoard
