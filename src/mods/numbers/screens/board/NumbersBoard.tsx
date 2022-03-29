import { PhoneIcon, StatusOfflineIcon } from '@heroicons/react/outline'
import type { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useCallback, useLayoutEffect, useState } from 'react'
import { dehydrate } from 'react-query'

import type { AppPage } from '@/@types'
import { DeleteResource } from '@/mods/shared/components/DeleteResource'
import { Notifier } from '@/mods/shared/components/Notification'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { CallSessionState } from '@/mods/shared/libs/CallSessionState'
import { getQueryClient } from '@/mods/shared/libs/queryClient'
import { Button, Spinner } from '@/ui'

import { useCreationEditingNumber } from '../../components/creation-editing'
import { useDeleteNumber } from '../../hooks/useDeleteNumber'
import { useNumbers } from '../../hooks/useNumbers'
import { NoNumbers } from './NoNumbers'

export const NumbersBoard: AppPage = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const { mutate, isLoading } = useDeleteNumber()
  const [deleteRef, setDeleteRef] = useState('')
  const { setTitle } = useTitle()
  const { numbers, isSuccess } = useNumbers()

  const { openEditing } = useCreationEditingNumber()

  const [wphone, setPhoneInstance] = useState<any>(null)

  useLayoutEffect(() => {
    setTitle('SIP Network / Numbers')
  }, [setTitle])

  const onTestCall = useCallback(async (e164Number: string) => {
    Notifier.info('Test Call in progress...', { closeButton: false })

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const WPhone = require('wphone').default

    const phone = new WPhone({
      displayName: 'ACCT Test',
      domain: 'test.sip.fonoster.io',
      username: 'testacct',
      secret: 'changeit',
      audioElementId: 'remoteAudio',
      server: 'wss://api.fonoster.io:5063',
    })

    if (!phone) return

    setPhoneInstance(phone)

    await phone.connect()
    await phone.call({
      targetAOR: 'sip:voice@default',
      extraHeaders: [`X-DID-Info: ${e164Number}`],
    })

    phone.inviter.stateChange.addListener((state: CallSessionState) => {
      if (state === CallSessionState.TERMINATED) {
        phone?.disconnect()

        setPhoneInstance(null)
      }
    })
  }, [])

  const onHangup = useCallback(() => {
    if (wphone?.isConnected()) {
      const isEstablishing = [
        CallSessionState.INITIAL,
        CallSessionState.ESTABLISHING,
      ].includes(wphone.inviter.state)

      if (isEstablishing)
        return Notifier.warning('Call not established, cannot hangup')

      wphone.inviter.state === CallSessionState.TERMINATED
        ? wphone.inviter.cancel()
        : wphone?.hangup()

      wphone?.disconnect()

      setPhoneInstance(null)
    }
  }, [wphone])

  const onOpen = useCallback((refId: string) => {
    setDeleteModalOpen(true)
    setDeleteRef(refId)
  }, [])

  const onDelete = useCallback(() => {
    mutate(deleteRef, {
      onSuccess() {
        setDeleteModalOpen(false)

        Notifier.success('Your Number has been successfully deleted.')
      },
    })
  }, [mutate, deleteRef])

  if (isSuccess && !numbers.length) return <NoNumbers />

  return isSuccess ? (
    <>
      <table className="table-auto border-collapse border border-gray-500 divide-y divide-gray-400 rounded">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
            >
              Ref
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
            >
              Provider Ref
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
            >
              E164 Number
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
            >
              Webhook
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {numbers.map((num, idx) => (
            <tr
              key={num.ref}
              className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {num.ref}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {num.providerRef}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {num.e164Number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {num.ingressInfo?.webhook}
              </td>
              <td className="flex items-center px-6 py-4 whitespace-nowrap text-right text-sm font-medium justify-end">
                <Button
                  size="small"
                  type="secondary"
                  className="mr-4"
                  onClick={() => onOpen(num.ref)}
                  data-desc={`Number ID: ${num.ref}`}
                  data-intent="Delete Number"
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  type="secondary"
                  onClick={() => openEditing(num)}
                  data-desc={`Number ID: ${num.ref}`}
                  data-intent="Edit Number"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  className="ml-4"
                  icon={
                    !wphone ? (
                      <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <StatusOfflineIcon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )
                  }
                  onClick={() =>
                    wphone ? onHangup() : onTestCall(num.e164Number)
                  }
                  type={wphone ? 'outline' : 'primary'}
                  data-desc={`Number ID: ${num.ref}`}
                  data-intent={`Test call to ${num.e164Number}`}
                >
                  {wphone ? 'Hangup call' : 'Test Call'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteResource
        refId={deleteRef}
        title={`Delete Number (${deleteRef})`}
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

NumbersBoard.isProtected = true

export default NumbersBoard
