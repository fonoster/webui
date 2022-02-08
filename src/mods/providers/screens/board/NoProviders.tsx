import { ButtonProps } from '@supabase/ui/dist/cjs/components/Button/Button'
import React from 'react'

import { Empty } from '@/ui'

import { useCreationEditingProvider } from '../../components/creation-editing'

export const NoProviders: React.FC<{ buttonProps?: ButtonProps }> = ({
  buttonProps,
}) => {
  const { open: onClick } = useCreationEditingProvider()

  return (
    <Empty
      title="No Providers"
      message="You haven’t created a Provider yet. You must add a Provider prior to creating a Number."
      buttonProps={{
        text: 'New Provider',
        onClick,
        ...buttonProps,
      }}
    />
  )
}
