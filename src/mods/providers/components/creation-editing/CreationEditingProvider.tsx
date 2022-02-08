import type { Provider } from '@fonoster/providers/dist/client/types'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Notifier } from '@/mods/shared/components/Notification'
import { wait } from '@/mods/shared/helpers/wait'
import { Input, Panel, Radio } from '@/ui'

import { useCreateProvider } from '../../hooks/useCreateProvider'
import { useEditProvider } from '../../hooks/useEditProvider'
import { useCreationEditingProvider } from './useCreationEditingProvider'

export const CreationEditingProvider: React.FC = () => {
  const { isOpen, isEdit, defaultValues, close } = useCreationEditingProvider()
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Provider>({ defaultValues })

  useEffect(() => {
    reset(isEdit ? defaultValues : {})
  }, [isEdit, defaultValues, reset])

  const { mutate: create, isLoading: isCreateLoading } = useCreateProvider()
  const { mutate: edit, isLoading: isEditLoading } = useEditProvider()

  const isLoading = useMemo(
    () => isCreateLoading || isEditLoading,
    [isCreateLoading, isEditLoading]
  )

  const onClose = useCallback(() => {
    close()
    wait(reset)
  }, [close, reset])

  const onSave = useCallback(
    (provider: Provider) => {
      isEdit
        ? edit(provider, {
            onSuccess() {
              onClose()

              Notifier.success('Your Provider has been successfully edited.')
            },
          })
        : create(provider, {
            onSuccess() {
              onClose()

              Notifier.success(
                'Your new Provider has been successfully created.'
              )
            },
          })
    },
    [create, edit, isEdit, onClose]
  )

  const headings = useMemo(
    () => ({
      title: isEdit
        ? 'Edit a Provider to connect your SIP Network resources.'
        : 'Create a Provider to connect your SIP Network resources.',
      description:
        'Before creating a Number or using the Call Manager, you must add a Provider.',
      buttonText: isEdit ? 'Edit Provider' : 'Create Provider',
    }),
    [isEdit]
  )

  return (
    <Panel
      close={onClose}
      isOpen={isOpen}
      title={headings.title}
      description={headings.description}
      saveButtonProps={{
        children: headings.buttonText,
        loading: isLoading,
        onClick: handleSubmit(onSave),
      }}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Input
            className="mb-4"
            label="Your Provider name"
            placeholder="Type a friendly name"
            disabled={isLoading}
            error={
              errors?.name &&
              'You must enter a name for your Provider, try something friendly.'
            }
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          />
        )}
      />

      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Input
            className="mb-4"
            label="Your username"
            placeholder="Type a username"
            disabled={isLoading}
            error={
              errors?.username && 'You must enter a username for your Provider.'
            }
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          />
        )}
      />

      <Controller
        name="secret"
        control={control}
        rules={{ required: !isEdit }}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Input
            className="mb-4"
            label={isEdit ? 'Your new secret' : 'Your secret'}
            placeholder="Type a secret"
            descriptionText={
              isEdit
                ? 'If you want to update your secret, just type the new one here.'
                : ''
            }
            disabled={isLoading}
            type="password"
            error={
              errors?.secret && 'You must enter a secret for your Provider.'
            }
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          />
        )}
      />

      <Controller
        name="host"
        control={control}
        rules={{ required: true }}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Input
            className="mb-4"
            label="Hostname or IP of the Provider"
            placeholder="Type a host"
            disabled={isLoading}
            error={errors?.host && 'You must enter a host for your Provider.'}
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          />
        )}
      />

      <Controller
        name="transport"
        control={control}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Radio.Group
            className="mb-4"
            type="cards"
            label="Transport"
            labelOptional="Defaults to TCP"
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          >
            <Radio
              label="Transmission Control Protocol (TCP)"
              value="tcp"
              checked={value === 'tcp'}
              disabled={isLoading}
            />
            <Radio
              label="User Datagram Protocol (UDP)"
              value="udp"
              checked={value === 'udp'}
              disabled={isLoading}
            />
          </Radio.Group>
        )}
      />

      <Controller
        name="expires"
        control={control}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <Input
            className="mb-4"
            label="SIP registration refresh (in seconds)"
            placeholder="Type a expires"
            type="number"
            disabled={isLoading}
            error={
              errors?.secret && 'You must enter a expires for your Provider.'
            }
            {...{
              name,
              onBlur,
              onChange,
              value,
            }}
          />
        )}
      />
    </Panel>
  )
}
