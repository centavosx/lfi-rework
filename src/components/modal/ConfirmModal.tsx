import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import { Button } from 'components/button'
import { FormContainer } from 'components/forms'
import { FormInput, SearchableInput } from 'components/input'
import { Text } from 'components/text'

import { Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import { ButtonModal } from './ModalButton'
import { Loading } from 'components/loading'
import { useApiPost } from 'hooks'

type InputFieldProp<T extends object = object> = {
  field?: keyof T
  type?: string
  label?: string
  placeHolder?: string
  important?: {
    onSearch: (val: string) => Promise<any>
  }
  custom?: {
    Jsx: (d: {
      onChange: (v: string) => void
      error?: any
      onAnyChange: (key: keyof T, value: any) => void
      fields: T
    }) => ReactNode
  }
}

export type ModalFlexProps<
  T extends object = any,
  A extends object = any,
  AO extends object = any
> = {
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>,
    fetch: (v: A) => void
  ) => void | Promise<any>
  modalText?: string
  fields?: InputFieldProp<T>[]
  initial: T
  availableText?: string
  validationSchema?: any
  isError?: boolean
  api: (o?: A) => Promise<AO>
  onSuccess?: (v?: AO) => void
  onError?: (v: any) => void
}

export function CreateModalFlex<
  T extends object = object,
  A extends object = any,
  AO extends object = any
>({
  onSubmit,
  validationSchema,
  modalText,
  fields,
  initial,
  availableText,
  isError,
  api,
  onSuccess,
  onError,
}: ModalFlexProps<T, A, AO>) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { isFetching, isSuccess, data, error, callApi } = useApiPost<AO, A>(
    api!
  )

  const onSearch =
    (onChangeValue?: (val: string) => Promise<any>) => async (val?: string) => {
      if (!isSearching) {
        setIsSearching(true)
        onChangeValue?.(val ?? '')
          .then(() => setIsAvailable(true))
          .catch(() => setIsAvailable(false))
          .finally(() => setIsSearching(false))
      }
    }

  useEffect(() => {
    if (!!isSuccess) onSuccess?.(data)
  }, [isSuccess])

  useEffect(() => {
    if (!!error) onError?.(error)
  }, [error])

  return (
    <Formik<T>
      initialValues={initial}
      onSubmit={async (v, helpers) => {
        await onSubmit(v, helpers, (v) => callApi(v))
      }}
      validationSchema={validationSchema}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({
        isSubmitting,
        values,
        handleChange,
        submitForm,
        errors,
        setFieldError,
        setFieldValue,
        ...other
      }) => (
        <FormContainer
          label={modalText}
          flexProps={{
            flex: 1,
            sx: { gap: 10 },
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 20,
            width: '100%',
            height: '100%',
          }}
        >
          {(isSubmitting || isFetching) && <Loading />}
          <Flex
            sx={{
              gap: [10],
              flexDirection: 'column',
              width: '100%',
              alignSelf: 'center',
              overflow: 'auto',
            }}
          >
            {[fields?.find((d) => !!d.important)].map(
              (d, key) =>
                !!d &&
                !!d.field && (
                  <SearchableInput
                    key={key}
                    label={d?.label!}
                    type={d?.type}
                    value={
                      !!d?.field
                        ? (values?.[d.field as keyof T] as string)
                        : undefined
                    }
                    placeHolder={d?.placeHolder}
                    onSearch={onSearch(d?.important?.onSearch)}
                    onChange={(e) =>
                      setFieldValue(d?.field as string, e.target.value)
                    }
                  />
                )
            )}

            {!isAvailable ? (
              <>
                {fields
                  ?.filter((d) => !d.important)
                  .map((d, i) =>
                    !!d.custom
                      ? d.custom.Jsx({
                          onChange: (v) => setFieldValue(d.field as string, v),
                          error: errors[d.field],
                          onAnyChange: (k, v) => {
                            setFieldValue(k as string, v)
                          },
                          fields: values,
                        })
                      : !!d.field && (
                          <FormInput
                            key={i}
                            type={d.type}
                            name={d.field as string}
                            label={d.label}
                            placeholder={d.placeHolder}
                            inputcolor={{
                              labelColor: 'gray',
                              backgroundColor: 'white',
                              borderBottomColor: theme.colors.darkGreen,
                              color: 'black',
                            }}
                            variant="filled"
                            sx={{ color: 'black', width: '100%' }}
                          />
                        )
                  )}
              </>
            ) : (
              <Text sx={{ color: isError ? 'red' : 'green' }}>
                {availableText}
              </Text>
            )}
          </Flex>

          <Flex
            width={'100%'}
            justifyContent={'center'}
            mt={[10, 20, 30]}
            flex={1}
          >
            <ButtonModal
              disabled={
                Object.keys(errors)?.some((v) =>
                  isAvailable && v === 'password' ? false : !!v
                ) ||
                isSubmitting ||
                isSearching ||
                (isError ? isAvailable : undefined)
              }
              style={{ width: '200px' }}
              modalChild={({ onSubmit, setOpen }) => {
                return (
                  <AreYouSure
                    cancelText="No"
                    confirmText="Yes"
                    onSubmit={() => {
                      onSubmit()
                    }}
                    setOpen={setOpen}
                  />
                )
              }}
              onSubmit={async () => {
                if (isAvailable)
                  return await onSubmit(
                    values,
                    {
                      ...(other as unknown as FormikHelpers<any>),
                    },
                    callApi
                  )
                return await submitForm()
              }}
            >
              Submit
            </ButtonModal>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

type Props = {
  refetch: () => void

  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  modalText?: string
}

export const AreYouSure = ({
  setOpen,
  onSubmit,
  cancelText,
  confirmText,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: () => void
  cancelText: string
  confirmText: string
}) => {
  return (
    <Flex
      sx={{ gap: 10 }}
      justifyContent={'center'}
      alignItems="center"
      flexDirection="column"
    >
      <Text
        width={'100%'}
        textAlign={'center'}
        sx={{
          fontSize: 24,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        Are you sure?
      </Text>
      <Flex sx={{ gap: 10 }}>
        <Button
          style={{ padding: 12 }}
          backgroundcolor="red"
          textcolor="white"
          hovercolor="#B22222"
          activecolor="#FF2400"
          hovertextcolor="white"
          activetextcolor="white"
          onClick={() => setOpen(false)}
        >
          {cancelText}
        </Button>
        <Button style={{ padding: 12 }} onClick={onSubmit}>
          {confirmText}
        </Button>
      </Flex>
    </Flex>
  )
}

type ModalUpdateType = {
  field: string
  label: string
  type: string
  disabled: boolean
  placeHolder: string
}[]

type FieldEditProp<T> = {
  initial: T
  title: string
  data: ModalUpdateType
}

type ModalEdit<T> = {
  data: FieldEditProp<T>[]
  onSubmit: (v: T, formikHelpers: FormikHelpers<T>) => Promise<void>
  schema?: any
}

function UserUpdate<T extends FormikValues>({
  data,
  initial,
  onSubmit,
  schema,
  title,
}: {
  data: ModalUpdateType
  initial: T
  onSubmit: (v: T, formikHelpers: FormikHelpers<T>) => Promise<void>
  schema?: any
  title: string
}) {
  return (
    <Formik<T>
      initialValues={initial}
      onSubmit={onSubmit}
      validationSchema={schema}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, errors, submitForm }) => (
        <FormContainer
          label={title}
          flexProps={{
            sx: { gap: 10 },
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 20,
            width: '100%',
            height: '100%',
          }}
        >
          {isSubmitting && <Loading />}
          <Flex
            sx={{
              gap: [10],
              flexDirection: 'column',
              width: '100%',
              alignSelf: 'left',
              overflow: 'auto',
            }}
          >
            {data.map((d, i) => {
              return (
                <FormInput
                  key={i}
                  type={d.type}
                  name={d.field}
                  label={d.label}
                  placeholder={d.placeHolder}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                  disabled={d.disabled}
                />
              )
            })}
          </Flex>
          <Flex width={'100%'} justifyContent={'right'} mt={[10, 20, 30]}>
            <ButtonModal
              disabled={
                Object.keys(errors)?.some((v) =>
                  v === 'password' ? false : !!v
                ) || isSubmitting
              }
              style={{ width: '200px' }}
              modalChild={({ onSubmit: sub, setOpen }) => {
                return (
                  <AreYouSure
                    cancelText="No"
                    confirmText="Yes"
                    onSubmit={() => {
                      sub()
                    }}
                    setOpen={setOpen}
                  />
                )
              }}
              onSubmit={async () => {
                return await submitForm()
              }}
            >
              Save
            </ButtonModal>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

export function ConfirmationModal<
  K extends object = object,
  A extends object = any,
  AO extends object = any
>({
  refetch,
  selected,
  setSelected,
  modalCreate,
  onRemove,
  modalEdit,
}: Props & {
  modalCreate?: ModalFlexProps<K, A, AO>
  onRemove: () => Promise<void>
  modalEdit?: ModalEdit<K>
}) {
  const {
    onSubmit: modalSubmit,
    initial,
    api,
    ...others
  } = modalCreate ?? {
    onSubmit: undefined,
    onSuccess: undefined,
  }
  return (
    <Flex p={10} alignItems={'end'} width={'100%'} sx={{ gap: 10 }}>
      {!!modalCreate && (
        <ButtonModal
          height={'auto'}
          modalChild={({ onSubmit }) => {
            return (
              <CreateModalFlex<K, A, AO>
                api={api as any}
                initial={initial!}
                onSubmit={async (values, helpers, fetch) => {
                  await modalSubmit?.(values, helpers, fetch)
                }}
                {...others}
                onSuccess={(v) => {
                  onSubmit()
                  others?.onSuccess?.(v)
                }}
              />
            )
          }}
          onSubmit={refetch}
        >
          Add
        </ButtonModal>
      )}
      {!!modalEdit && selected.length > 0 && (
        <ButtonModal
          style={{
            alignSelf: 'end',
            borderWidth: 0.5,
            borderColor: 'gray',
            borderStyle: 'solid',
          }}
          width={'85%'}
          height={'90%'}
          isSecondary={true}
          modalChild={() => {
            return (
              <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                {modalEdit.data.map((v) => (
                  <UserUpdate<K>
                    key={JSON.stringify(v.initial)}
                    data={v.data}
                    initial={v.initial}
                    onSubmit={modalEdit.onSubmit}
                    schema={modalEdit.schema}
                    title={v.title}
                  />
                ))}
              </Flex>
            )
          }}
          onSubmit={refetch}
          onClose={refetch}
        >
          Edit
        </ButtonModal>
      )}
      {selected.length > 0 && (
        <ButtonModal
          backgroundcolor="red"
          textcolor="white"
          hovercolor="#B22222"
          activecolor="#FF2400"
          hovertextcolor="white"
          activetextcolor="white"
          modalChild={({ onSubmit, setOpen }) => {
            return (
              <AreYouSure
                cancelText="Cancel"
                confirmText="Remove"
                onSubmit={() => {
                  onRemove().finally(() => {
                    setSelected([])
                    onSubmit()
                  })
                }}
                setOpen={setOpen}
              />
            )
          }}
          onSubmit={refetch}
        >
          Remove
        </ButtonModal>
      )}
    </Flex>
  )
}
