import { useSession } from 'next-auth/react'
import { useCallback, useLayoutEffect, useState } from 'react'

import { useRefreshSecret } from '@/mods/auth/hooks/useRefreshSecret'
import { Confirm } from '@/mods/shared/components/Confirm'
import { Notifier } from '@/mods/shared/components/Notification'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { Button, Input, Text, Title } from '@/ui'

export function Account() {
  const [isSecretConfirmOpen, setSecretConfirmOpen] = useState(false)
  const { setTitle } = useTitle()
  const { data: session } = useSession()

  const [secret, setSecret] = useState(session?.user?.accessKeySecret || '')

  const { mutate, isLoading } = useRefreshSecret()

  useLayoutEffect(() => {
    setTitle(session?.user?.name || 'Me')
  }, [setTitle, session?.user])

  const onRefreshSecret = useCallback(() => {
    mutate(undefined, {
      onSuccess({ token }) {
        setSecretConfirmOpen(false)

        Notifier.success(
          'Your secret access key has been successfully renewed.'
        )

        setSecret(token)
      },
    })
  }, [mutate])

  return (
    <>
      <div className="flex-1 relative flex overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none xl:order-first">
          <div className="absolute inset-0">
            <div>
              <div>
                <Title level={4} className="leading-6 m-0">
                  Account details
                </Title>
                <Text>
                  Use your Account credentials with the Projects API or to login into the Command-Line Tool.
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
              <div className="mt-5">
                <dl>
                  <div className="pb-4 mt-4 sm:grid sm:grid-cols-1 sm:gap-4">
                    <dd className="text-sm text-white sm:mt-0 sm:col-span-1">
                      <Input
                        name="name"
                        className="mb-4"
                        label="Name"
                        placeholder="Type your name"
                        value={session?.user.name ?? ''}
                        readOnly
                      />
                    </dd>
                  </div>

                  <div className="pt-4 sm:pt-5 sm:grid sm:grid-cols-1 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-300">
                      Access Key ID
                    </dt>
                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                      <Input readOnly copy value={session?.user?.accessKeyId} />
                    </dd>
                  </div>
                  <div className="pt-4 sm:py-5 sm:grid sm:grid-cols-1 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-300">
                      Access Key Secret
                    </dt>
                    <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2 flex flex-col items-end">
                      <Input
                        reveal
                        readOnly
                        copy
                        value={secret}
                        className="w-full"
                      />
                      <Button
                        key="refresh-secret"
                        size="small"
                        type="secondary"
                        onClick={() => setSecretConfirmOpen(true)}
                        loading={isLoading}
                        className="mt-2 text"
                      >
                        {isLoading ? 'Loading...' : 'Re-generate Secret'}
                      </Button>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Confirm
        isOpen={isSecretConfirmOpen}
        isLoading={isLoading}
        onClick={onRefreshSecret}
        onClose={() => setSecretConfirmOpen(false)}
        textToConfirm={session?.user.name || 'Confirm'}
      />
    </>
  )
}

Account.isProtected = true

export default Account
