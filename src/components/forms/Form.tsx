import { LabelProps } from '@rebass/forms'
import { Label } from '../label'
import { Form, useFormikContext } from 'formik'
import { Flex, FlexProps, ImageProps, Image } from 'rebass'
import { CSSProperties } from 'styled-components'
import { useEffect, ReactNode, useCallback } from 'react'

export const FormContainer = ({
  label,
  children,
  flexProps,
  labelProps,
  image,
  imageProps,
  custom,
  ...others
}: CSSProperties & {
  flexProps?: FlexProps
  labelProps?: LabelProps
  label?: string
  image?: string
  imageProps?: ImageProps
  children?: ReactNode | null
  custom?: ReactNode
}) => {
  const { sx, ...flexOther } = flexProps ?? { sx: undefined }
  return (
    <Form style={{ width: '100%', ...others }}>
      <Flex
        sx={{ flexDirection: 'column', gap: 2, width: '100%', ...sx }}
        {...flexOther}
      >
        {!!image && (
          <Image
            src={image}
            margin={'auto'}
            minWidth={'auto'}
            alt="image"
            {...imageProps}
          />
        )}
        <Flex flexDirection={['column', 'row', 'row']} sx={{ gap: 2 }}>
          {!!label && (
            <Label as={'h2'} color="black" flex={1} {...labelProps}>
              {label}
            </Label>
          )}
          {custom}
        </Flex>
        {children}
      </Flex>
    </Form>
  )
}

export function ScrollToError({
  children,
}: {
  children: (scrollIfError: () => void) => ReactNode
}) {
  const formik = useFormikContext()

  const scrollIfError = useCallback(() => {
    const errors = Object.keys(formik?.errors ?? {})
    if (errors.length === 0) return

    const el = document.getElementsByName(errors[0])
    el?.[0]?.scrollIntoView({ block: 'center' })
  }, [formik])

  return <>{children(scrollIfError)}</>
}
