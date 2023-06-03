import { LabelProps } from '@rebass/forms'
import { Label } from '../label'
import { Form } from 'formik'
import { Flex, FlexProps } from 'rebass'
import { CSSProperties } from 'styled-components'

export const FormContainer = ({
  label,
  children,
  flexProps,
  labelProps,
  ...others
}: CSSProperties & {
  flexProps?: FlexProps
  labelProps?: LabelProps
  label?: string
  children?: any | any[] | null
}) => {
  const { sx, ...flexOther } = flexProps ?? { sx: undefined }
  return (
    <Form style={{ width: '100%', ...others }}>
      <Flex
        sx={{ flexDirection: 'column', gap: 2, width: '100%', ...sx }}
        {...flexOther}
      >
        {!!label && (
          <Label as={'h2'} color="black" {...labelProps}>
            {label}
          </Label>
        )}
        {children}
      </Flex>
    </Form>
  )
}
