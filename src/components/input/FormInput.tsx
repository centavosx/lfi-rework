import { Text } from '../text'
import {
  Field,
  FieldProps as FormikFieldProps,
  FieldConfig,
  FormikValues,
} from 'formik'
import { Flex, SxStyleProp } from 'rebass'
import { Input, InputColor } from './Input'
import { TextFieldProps } from '@mui/material'

type ErrorProp = { error?: string; sx?: SxStyleProp }

export const FormInput = ({
  errorProp,
  ...props
}: {
  errorProp?: ErrorProp
} & TextFieldProps & { padding?: number } & InputColor & {
    theme?: undefined
  } & Pick<FieldConfig, 'name'>) => {
  return (
    <Field name={props.name}>
      {({
        field: { name: fieldName, value, onChange },
        form: { touched },
        meta: { error = '' },
      }: FormikFieldProps<any, FormikValues>) => (
        <Flex flexDirection="column" sx={{ gap: 2, width: '100%' }}>
          <Input
            {...{
              ...props,
              name: fieldName,
              value,
              onChange: props.onChange ?? onChange,
            }}
          />
          <InputError error={error} {...errorProp} />
        </Flex>
      )}
    </Field>
  )
}

export const InputError = ({ error, sx }: ErrorProp) =>
  (error && (
    <Text color={'red'} fontSize={[10, 12]} sx={{ ...sx }}>
      {error}
    </Text>
  )) ||
  null
