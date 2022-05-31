import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ButtonProps } from '@supabase/ui/dist/cjs/components/Button/Button'
import React, { Fragment } from 'react'

import { Button, Text, Title } from '@/ui'

interface Props {
  close: () => void
  isOpen: boolean
  title: string
  description?: string
  saveButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
}

export const Panel: React.FC<Props> = ({
  isOpen,
  close,
  children,
  title,
  description,
  saveButtonProps,
  cancelButtonProps,
}) => (
  <Transition.Root show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="dark fixed inset-0 overflow-hidden"
      onClose={close}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Dialog.Overlay className="absolute inset-0 bg-gray-800 bg-opacity-50" />

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="w-screen max-w-xl">
              <div className="h-full flex flex-col bg-white bg-gray-700 shadow-xl">
                <div className="min-h-0 flex-1 flex flex-col pt-8 pb-6 overflow-y-auto">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Title level={3} className="mb-6">
                          {title}
                        </Title>

                        {description && (
                          <Text className="mb-6">{description}</Text>
                        )}
                      </div>

                      <div className="ml-4 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white bg-gray-700 rounded-md text-gray-300 focus:outline-none"
                          onClick={close}
                          data-intent={title}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-4 sm:px-6">
                    <div
                      className="h-full"
                      aria-hidden="true"
                      {...{ children }}
                    />
                  </div>
                </div>
                {saveButtonProps && (
                  <div className="flex-shrink-0 px-8 pt-6 pb-8 flex justify-end">
                    <Button
                      type="secondary"
                      onClick={close}
                      data-intent={title}
                      {...{
                        ...cancelButtonProps,
                        children: cancelButtonProps?.children ?? 'Cancel',
                      }}
                    />
                    <Button
                      className="ml-4"
                      data-intent={title}
                      {...saveButtonProps}
                    />
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
)
