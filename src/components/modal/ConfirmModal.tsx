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

import { Formik, FormikHelpers, FormikValues } from 'formik'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import { ButtonModal } from './ModalButton'
import { Loading } from 'components/loading'

type InputFieldProp<T extends object = object> = {
  field: keyof T
  type?: string
  label?: string
  placeHolder?: string
  important?: {
    onSearch: (val: string) => Promise<any>
  }
  custom?: {
    Jsx: React.FC<any>
  }
}

export type ModalFlexProps<T extends object = any> = {
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>
  modalText?: string
  fields?: InputFieldProp<T>[]
  initial: T
  availableText?: string
  validationSchema?: any
  isError?: boolean
}

export function CreateModalFlex<T extends object = object>({
  onSubmit,
  validationSchema,
  modalText,
  fields,
  initial,
  availableText,
  isError,
}: ModalFlexProps<T>) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

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

  return (
    <Formik<T>
      initialValues={initial}
      onSubmit={onSubmit}
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
              alignSelf: 'center',
              overflow: 'auto',
            }}
          >
            {[fields?.find((d) => !!d.important)].map(
              (d, key) =>
                !!d && (
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
                    !!d.custom ? (
                      <d.custom.Jsx
                        key={i}
                        onChange={handleChange(d.field)}
                        error={errors[d.field]}
                      />
                    ) : (
                      <FormInput
                        key={i}
                        type={d.type}
                        name={d.field as string}
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

          <Flex width={'100%'} justifyContent={'center'} mt={[10, 20, 30]}>
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
                  return await onSubmit(values, {
                    ...(other as unknown as FormikHelpers<any>),
                  })
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

export function ConfirmationModal<K extends object = object>({
  refetch,
  selected,
  setSelected,
  modalCreate,
  onRemove,
  modalEdit,
}: Props & {
  modalCreate?: ModalFlexProps<K>
  onRemove: () => Promise<void>
  modalEdit?: ModalEdit<K>
}) {
  const {
    onSubmit: modalSubmit,
    initial,
    ...others
  } = modalCreate ?? {
    onSubmit: undefined,
  }
  return (
    <Flex p={10} alignItems={'end'} width={'100%'} sx={{ gap: 10 }}>
      {!!modalCreate && (
        <ButtonModal
          style={{ alignSelf: 'end' }}
          height={'90%'}
          modalChild={({ onSubmit }) => {
            return (
              <CreateModalFlex<K>
                initial={initial!}
                onSubmit={async (values, helpers) => {
                  await modalSubmit?.(values, helpers)
                  onSubmit()
                }}
                {...others}
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
          backgroundcolor={theme.colors.white}
          textcolor={'black'}
          hovercolor={'#e0e0e0'}
          hovertextcolor={'black'}
          activetextcolor={'black'}
          activecolor={'#d6d6d6'}
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
