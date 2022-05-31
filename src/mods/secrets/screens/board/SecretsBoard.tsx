import { KeyIcon } from '@heroicons/react/outline'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useCallback, useLayoutEffect, useState } from 'react'
import { dehydrate } from 'react-query'

import type { AppPage } from '@/@types'
import { DeleteResource } from '@/mods/shared/components/DeleteResource'
import { InsideDocs } from '@/mods/shared/components/InsideDocs'
import { Notifier } from '@/mods/shared/components/Notification'
import { classes } from '@/mods/shared/helpers/classes'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { getQueryClient } from '@/mods/shared/libs/queryClient'
import { Button, Spinner, Text, Title } from '@/ui'

import { useDeleteSecret } from '../../hooks/useDeleteSecret'
import { useSecrets } from '../../hooks/useSecrets'
import { NoSecrets } from './NoSecrets'

const code = `
const Fonoster = require("@fonoster/sdk");
const providers = new Fonoster.Providers();

const request = {
  name: "SIP Provider",
  username: "trunk001",
  secret: "secretkey",
  host: "sip.provider.net"
};

providers.createProvider(request)
.then(result => {
  console.log(result)             // successful response
}).catch(e => console.error(e));   // an error occurred`

export const SecretsBoard: AppPage = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isInsideDocsOpen, setInsideDocsOpen] = useState(true)
  const { mutate, isLoading } = useDeleteSecret()
  const [deleteRef, setDeleteRef] = useState('')
  const { setTitle, removeGaps } = useTitle()
  const { secrets, isSuccess } = useSecrets()

  useLayoutEffect(() => {
    setTitle('Secrets Management')
    removeGaps()
  }, [setTitle, removeGaps])

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
      <div className="flex-1 flex items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto py-6 pl-6">
          {/* Primary column */}
          <section className="min-w-0 pr-6 flex-1 h-full flex flex-col lg:order-last">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="lg:w-4/6">
                <Title level={3}>Safeguard your credentials in a vault.</Title>
                <Text className="whitespace-normal">
                  Secrets are encrypted variables that you can you use in your
                  Voice Applications. Your secrets are only available for use
                  within the Project.{' '}
                  <a
                    className="term"
                    href="https://learn.fonoster.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more.
                  </a>
                </Text>
              </div>
              <div>
                <Button
                  type="text"
                  className={classes(
                    '!ring-offset-2 !ring-1 ring-opacity-5',
                    isInsideDocsOpen
                      ? '!ring-offset-primary !ring-primary'
                      : '!ring-offset-gray-600 !ring-gray-600'
                  )}
                  onClick={() => setInsideDocsOpen(!isInsideDocsOpen)}
                >
                  SDK
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {secrets.map(secret => (
                <div
                  key={secret.name}
                  className="relative rounded-lg bg-gray-500 px-4 py-4 shadow-sm flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <KeyIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <Title level={5} className="m-0">
                      {secret.name}
                    </Title>

                    <Text className="m-0 text-sm">
                      **** **** **** **** **** ****
                    </Text>
                  </div>
                  <div>
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onOpen(secret.name)}
                      className="btn-delete"
                      data-desc={`Secret name: ${secret.name}`}
                      data-intent="Delete Secret"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <InsideDocs
          show={isInsideDocsOpen}
          title="Create a Secret using our SDK"
          content={code}
          tableContent={{
            headers: ['Param', 'Description'],
            rows: [
              ['name: string', 'Friendly name'],
              ['type: enum', 'Type of value'],
              ['value: string', 'Value of secret'],
            ],
          }}
          description="You can always interact with Fonoster from your external applications with our SDK, all our features are available to allow its extensibility."
        />
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
