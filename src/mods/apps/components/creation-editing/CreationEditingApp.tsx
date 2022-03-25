import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCreationEditingSecret } from '@/mods/secrets/components/creation-editing'
import { useSecrets } from '@/mods/secrets/hooks/useSecrets'
import { Notifier } from '@/mods/shared/components/Notification'
import { voices } from '@/mods/shared/constants/voices'
import { wait } from '@/mods/shared/helpers/wait'
import { Button, Checkbox, Input, Panel, Select, Spinner } from '@/ui'

import { useCreateApp } from '../../hooks/useCreateApp'
import { useEditApp } from '../../hooks/useEditApp'
import { useCreationEditingApp } from './useCreationEditingApp'

export const CreationEditingApp: React.FC = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [intensConfigType, setIntentsConfigType] = useState('')

  const { isOpen, isEdit, defaultValues, close } = useCreationEditingApp()
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    reset(
      isEdit
        ? defaultValues
        : {
            activationTimeout: 10_000,
            interactionTimeout: 10_000,
            transferConfig: {
              message: 'Please wait while we transfer you',
            },
          }
    )
  }, [isEdit, defaultValues, reset])

  const { mutate: create, isLoading: isCreateLoading } = useCreateApp()
  const { mutate: edit, isLoading: isEditLoading } = useEditApp()

  const isLoading = useMemo(
    () => isCreateLoading || isEditLoading,
    [isCreateLoading, isEditLoading]
  )

  const { secrets, isSuccess } = useSecrets()

  const { open } = useCreationEditingSecret()

  const onClose = useCallback(() => {
    setIntentsConfigType('')
    close()
    wait(reset)
  }, [close, reset])

  const onSave = useCallback(
    application => {
      isEdit
        ? edit(application, {
            onSuccess() {
              onClose()

              Notifier.success('Your Application has been successfully edited.')
            },
          })
        : create(application, {
            onSuccess() {
              onClose()

              Notifier.success(
                'Your new Application has been successfully created.'
              )
            },
          })
    },
    [create, edit, isEdit, onClose]
  )

  const hasSecrets = useMemo(() => secrets.length !== 0, [secrets])

  const headings = useMemo(
    () => ({
      title: isEdit
        ? 'Edit the Application'
        : 'Create a Fonoster App to connect your Telephony infrastructure with your Dialogflow Bots.',
      description:
        'Use the following form to configure your Intents and Engine (DialogFlow) and your Speech API.',
      buttonText: isEdit ? 'Save' : 'Create App',
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
      {isSuccess ? (
        <>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Input
                className="mb-4"
                label="Application Name"
                placeholder="Type a friendly name"
                disabled={isLoading}
                error={
                  errors?.name &&
                  'You must enter a name for your Application, try something friendly.'
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
            name="speechConfig.secretName"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Select
                className={hasSecrets ? 'mb-4' : 'mb-0'}
                label="Speech Config Secret"
                disabled={!hasSecrets || isLoading}
                error={
                  !hasSecrets
                    ? 'Before adding a Application you must create a Secret'
                    : errors?.speechConfig?.secretName &&
                      'You must enter a Secret'
                }
                {...{
                  name,
                  onBlur,
                  onChange,
                  value,
                }}
              >
                <Select.Option value="">Choose a Secret</Select.Option>
                {secrets.map(({ name }) => (
                  <Select.Option key={name} value={name}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />

          {!hasSecrets && (
            <Button
              type="secondary"
              block
              className="mb-4"
              onClick={() => {
                onClose()

                open()
              }}
            >
              Add Secret
            </Button>
          )}

          <Controller
            name="speechConfig.voice"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Select
                className={hasSecrets ? 'mb-4' : 'mb-0'}
                label="Voice name"
                disabled={isLoading}
                error={
                  errors?.speechConfig?.voice &&
                  'You must enter a voice for your Application.'
                }
                {...{
                  name,
                  onBlur,
                  onChange,
                  value,
                }}
              >
                <Select.Option value="">Choose a voice name</Select.Option>
                {voices.map(voice => (
                  <Select.Option key={voice} value={voice}>
                    {voice}
                  </Select.Option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="intentsEngineConfig.welcomeIntentId"
            control={control}
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Input
                className="mb-4"
                label="Type the welcome intent ID"
                placeholder="(e.g. WELCOME)"
                disabled={isLoading}
                {...{
                  name,
                  onBlur,
                  onChange,
                  value,
                }}
              />
            )}
          />

          {!isEdit && (
            <Select
              className="mb-4"
              label="Select Intents Engine Type"
              disabled={isLoading}
              value={intensConfigType}
              onChange={({ target: { value } }) => setIntentsConfigType(value)}
            >
              <Select.Option value="">Choose a Engine</Select.Option>
              {[{ name: 'DialogflowES' }].map(({ name }) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          )}

          {(intensConfigType || isEdit) && (
            <>
              <Controller
                name="intentsEngineConfig.projectId"
                control={control}
                rules={{ required: true }}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input
                    className="mb-4"
                    label="Type a project ID"
                    placeholder="(e.g my-gcp-project)"
                    disabled={isLoading}
                    error={
                      errors?.intentsEngineConfig?.projectId &&
                      'You must enter a project ID for your Application.'
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
                name="intentsEngineConfig.secretName"
                control={control}
                rules={{ required: true }}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Select
                    className={hasSecrets ? 'mb-4' : 'mb-0'}
                    label="Intents Engine Secret"
                    disabled={!hasSecrets || isLoading}
                    error={
                      !hasSecrets
                        ? 'Before adding a Application you must create a Secret'
                        : errors?.speechConfig?.secretName &&
                          'You must enter a Secret'
                    }
                    {...{
                      name,
                      onBlur,
                      onChange,
                      value,
                    }}
                  >
                    <Select.Option value="">Choose a Secret</Select.Option>
                    {/* eslint-disable-next-line sonarjs/no-identical-functions */}
                    {secrets.map(({ name }) => (
                      <Select.Option key={name} value={name}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />

              {intensConfigType === 'DialogflowCX' && (
                <>
                  <Controller
                    name="intentsEngineConfig.agent"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { name, onBlur, onChange, value } }) => (
                      <Input
                        className="mb-4"
                        label="Type a agent"
                        placeholder="(e.g. Joe)"
                        disabled={isLoading}
                        error={
                          errors?.intentsEngineConfig?.agent &&
                          'You must enter a agent'
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
                    name="intentsEngineConfig.location"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { name, onBlur, onChange, value } }) => (
                      <Input
                        className="mb-4"
                        label="Type a location"
                        placeholder="(e.g. ...)"
                        error={
                          errors?.intentsEngineConfig?.location &&
                          'You must enter a location'
                        }
                        disabled={isLoading}
                        {...{
                          name,
                          onBlur,
                          onChange,
                          value,
                        }}
                      />
                    )}
                  />
                </>
              )}
            </>
          )}

          <Checkbox
            label="Show advance options"
            description="You can configure more options for your Application."
            disabled={isLoading}
            checked={showMoreOptions}
            onChange={e => setShowMoreOptions(e.target.checked)}
          />

          {showMoreOptions && (
            <>
              <Controller
                name="initialDtmf"
                control={control}
                rules={{ pattern: /^[0-9*#]*$/ }}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input
                    className="mb-4"
                    label="Initial DTMF"
                    placeholder="It’s a string that allows 1234567890#*"
                    disabled={isLoading}
                    error={errors?.initialDtmf && 'You must enter valid DTMF'}
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
                name="activationIntentId"
                control={control}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input
                    className="mb-4"
                    label="Type the activation intent ID"
                    descriptionText="If set it will require the user to say the activation phrase (eg. Hey Alexa) You will typically use this in the browser."
                    placeholder="(e.g. HEY_ROX)"
                    disabled={isLoading}
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
                name="activationTimeout"
                control={control}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input
                    className="mb-4"
                    type="number"
                    label="Type the activation timeout"
                    placeholder="(e.g. 15000)"
                    disabled={isLoading}
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
                name="interactionTimeout"
                control={control}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input
                    className="mb-4"
                    type="number"
                    label="Type the interaction timeout"
                    placeholder="(e.g. 10000)"
                    disabled={isLoading}
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
                name="transferConfig.message"
                control={control}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Input.TextArea
                    className="mb-4"
                    label="Type a transfer message"
                    rows={8}
                    labelOptional="Plain text to SSML"
                    placeholder="(e.g. Please wait while we transfer you)"
                    disabled={isLoading}
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
                name="intentsEngineConfig.emulateTelephonyPlatform"
                control={control}
                render={({ field: { name, onBlur, onChange, value } }) => (
                  <Checkbox
                    label="Emulate Telephony Platform"
                    description="Emulate the Telephony Platform for testing purposes."
                    disabled={isLoading}
                    checked={Boolean(value)}
                    {...{
                      name,
                      onBlur,
                      onChange,
                    }}
                  />
                )}
              />
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </Panel>
  )
}
