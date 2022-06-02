import { useSession } from 'next-auth/react'
import { useLayoutEffect } from 'react'

import { useTitle } from '@/mods/shared/hooks/useTitle'
import { Input, Text, Title } from '@/ui'

export function Account() {
  const { setTitle } = useTitle()
  const { data: session } = useSession()

  useLayoutEffect(() => {
    setTitle(session?.user?.name || 'Me')
  }, [setTitle, session?.user])

  return (
    <div className="flex-1 relative flex overflow-hidden">
      <main className="flex-1 relative overflow-y-auto focus:outline-none xl:order-first">
        <div className="absolute inset-0">
          <div>
            <div>
              <Title level={4} className="leading-6 m-0">
                Account details
              </Title>
              <Text>
                Learn more about the capabilities and purpose of Account in our
                docs.
              </Text>
            </div>
            <div className="mt-5">
              <dl>
                <div className="pb-4 mt-4 sm:grid sm:grid-cols-1 sm:gap-4">
                  <dd className="text-sm text-white sm:mt-0 sm:col-span-1">
                    <Input
                      name="name"
                      className="mb-4"
                      label="Project name"
                      placeholder="Type a friendly name"
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
                      value={session?.user?.accessKeySecret}
                      className="w-full"
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

Account.isProtected = true

export default Account
