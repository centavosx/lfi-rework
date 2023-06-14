import {
  useState,
  memo,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import { getUserInfo, updateUser } from 'api'
import { Button, SecondaryButton, UploadProcess } from 'components/button'
import { FormContainer, ScrollToError } from 'components/forms'
import { FormInput, InputError } from 'components/input'
import { Loading } from 'components/loading'
import { Select, SelectV2 } from 'components/select'
import {
  COLLEGE_PROGRAMS,
  DISPLAY_FILES,
  Level,
  RegFormType,
  SCHOOL_LEVEL,
  SHS_PROGRAMS,
} from 'constant'
import { Roles, User, UserStatus } from 'entities'
import { Formik } from 'formik'
import { FormikValidation } from 'helpers'
import { useApi, useApiPost } from 'hooks'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import { AreYouSure, ButtonModal } from 'components/modal'

const Editable = memo(
  ({
    children,
  }: {
    children: (
      edit: boolean,
      setEdit: Dispatch<SetStateAction<boolean>>
    ) => ReactNode
  }) => {
    const [isEdit, setIsEdit] = useState(false)
    return <>{children(isEdit, setIsEdit)}</>
  }
)
Editable.displayName = 'Editable'

export const UserInformation = memo(
  ({
    id,
    onSuccess,
    isDisabled,
    isAcceptReject,
  }: {
    id: string
    onSuccess?: () => void
    isDisabled?: boolean
    isAcceptReject?: boolean
  }) => {
    const { data, isFetching, refetch } = useApi<User>(getUserInfo, false, id)

    const {
      isSuccess,
      isFetching: isUpdating,
      callApi,
    } = useApiPost(updateUser)

    useEffect(() => {
      if (isSuccess) onSuccess?.()
    }, [isSuccess])

    return (
      <Flex flexDirection={'column'}>
        {isFetching ? (
          <Loading />
        ) : (
          !!data && (
            <Formik<RegFormType & { status: UserStatus; role: Roles[] }>
              initialValues={{
                ...(data as any),
              }}
              validationSchema={FormikValidation.register}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                callApi(values as any)
                setSubmitting(false)
              }}
            >
              {({
                values,
                isSubmitting,
                setFieldValue,
                errors,
                submitForm,
              }) => {
                const findPrograms = [
                  {
                    label: 'Select Program...',
                    value: undefined,
                  },
                  ...((values.level === Level.SHS
                    ? SHS_PROGRAMS
                    : COLLEGE_PROGRAMS) as any[]),
                ].find((v) => v.value === values.program)

                return (
                  <FormContainer
                    flex={1}
                    // image="/assets/logo.png"
                    // imageProps={{ height: 100, width: 100, margin: 'none' }}
                    labelProps={{ sx: { justifyContent: 'left' } }}
                    flexProps={{ sx: { gap: 20, mb: 30, mt: 2 } }}
                  >
                    {(isSubmitting || isFetching || isUpdating) && <Loading />}

                    <Flex
                      sx={{
                        flexDirection: ['column', 'column', 'row'],
                        gap: 2,
                      }}
                    >
                      <Flex
                        sx={{ flexDirection: ['column', 'row', 'row'], gap: 2 }}
                        flex={2}
                      >
                        <FormInput
                          containerProps={{ flex: 1 }}
                          name="fname"
                          type={'text'}
                          placeholder="First Name"
                          label={'First Name'}
                          variant="outlined"
                          disabled={isDisabled}
                        />
                        <FormInput
                          containerProps={{ flex: 1 }}
                          name="mname"
                          type={'text'}
                          label={'Middle Name (Optional)'}
                          placeholder="Middle Name (Optional)"
                          sx={{ flex: 1 }}
                          disabled={isDisabled}
                        />
                      </Flex>
                      <FormInput
                        containerProps={{ flex: 1 }}
                        name="lname"
                        type={'text'}
                        label={'Last Name'}
                        placeholder="Last Name"
                        sx={{ flex: 1 }}
                        disabled={isDisabled}
                      />
                    </Flex>
                    <FormInput
                      containerProps={{ flex: 1 }}
                      name="email"
                      type={'email'}
                      placeholder="Email"
                      label="Email"
                      sx={{ flex: 1 }}
                      disabled={isDisabled}
                    />
                    <Flex
                      flexDirection={'column'}
                      sx={{ width: '100%', gap: 2 }}
                    >
                      <SelectV2
                        label="Level"
                        options={SCHOOL_LEVEL}
                        isDisabled={isDisabled}
                        value={
                          SCHOOL_LEVEL.find(
                            (v) => v.value === values.level
                          ) as any
                        }
                        onChange={(v) => {
                          if (v === null) {
                            setFieldValue('level', undefined)
                          } else {
                            setFieldValue('level', v.value)
                          }
                          setFieldValue('program', undefined)
                        }}
                        placeholder="Select School Level"
                      />
                      <InputError error={errors.level} />
                    </Flex>

                    {!!values.level && (
                      <Flex
                        flexDirection={'column'}
                        sx={{ width: '100%', gap: 2 }}
                      >
                        <SelectV2
                          isDisabled={isDisabled}
                          label="Program"
                          placeholder="Select School program"
                          options={[
                            { label: 'Select Program...', value: undefined },
                            { label: 'Others', value: 'Other' },
                            ...((values.level === Level.SHS
                              ? SHS_PROGRAMS
                              : COLLEGE_PROGRAMS) as any[]),
                          ]}
                          value={
                            !!findPrograms
                              ? findPrograms
                              : !!values.program || values.program === null
                              ? { label: 'Others', value: 'Other' }
                              : (undefined as any)
                          }
                          onChange={(v) => {
                            if (v === null) {
                              setFieldValue('program', undefined)
                              return
                            }

                            if ((v as any).value === 'Other') {
                              setFieldValue('program', null)
                              return
                            }
                            setFieldValue('program', (v as any).value)
                          }}
                        />

                        <InputError error={errors.program} />
                      </Flex>
                    )}
                    {!findPrograms &&
                      (!!values.program || values.program === null) && (
                        <FormInput
                          name={'program'}
                          label={'Others'}
                          placeholder={'Please type program'}
                          value={values.program}
                        />
                      )}
                    <FormInput
                      name="address"
                      label={'Address'}
                      multiline={true}
                      variant="outlined"
                      inputcolor={{
                        labelColor: 'gray',
                        backgroundColor: 'white',
                        borderBottomColor: theme.mainColors.first,

                        color: 'black',
                      }}
                      disabled={isDisabled}
                      placeholder={'Address'}
                      maxRows={2}
                      padding={20}
                      paddingBottom={15}
                      sx={{ color: 'black', width: '100%' }}
                    />
                    {/* <UploadButton>dwa</UploadButton> */}
                    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                      {DISPLAY_FILES.map((v, i) => {
                        return (
                          <Editable key={v.name}>
                            {(isEdit, setEdit) => (
                              <UploadProcess
                                name={v.name}
                                disabled={isDisabled}
                                title={v.title}
                                isNew={
                                  !!(
                                    !isEdit &&
                                    values[
                                      v.name as unknown as keyof typeof values
                                    ] &&
                                    data[v.name as unknown as keyof typeof data]
                                  )
                                }
                                newChildren={(deleteF) =>
                                  isEdit ? (
                                    <SecondaryButton
                                      onClick={() => {
                                        deleteF()
                                        setFieldValue(
                                          v.name as keyof typeof values,
                                          data[v.name as unknown as keyof User]
                                        )
                                        setEdit((v) => !v)
                                      }}
                                    >
                                      Cancel
                                    </SecondaryButton>
                                  ) : (
                                    !!values[
                                      v.name as unknown as keyof typeof values
                                    ] &&
                                    !!data[
                                      v.name as unknown as keyof typeof data
                                    ] && (
                                      <Flex
                                        flexDirection={'row'}
                                        sx={{ gap: 2 }}
                                      >
                                        <Button
                                          onClick={() =>
                                            !!window &&
                                            window.open(
                                              values[
                                                v.name as unknown as keyof typeof values
                                              ] as any
                                            )
                                          }
                                        >
                                          View
                                        </Button>
                                        {!isDisabled && (
                                          <SecondaryButton
                                            onClick={() => setEdit((v) => !v)}
                                          >
                                            Edit
                                          </SecondaryButton>
                                        )}
                                      </Flex>
                                    )
                                  )
                                }
                                textProps={{
                                  fontWeight: 'bold',
                                  justifyContent: 'center',
                                }}
                                errorString={
                                  errors[v.name as keyof typeof errors] as any
                                }
                                width={150}
                                onChange={(link) =>
                                  link !== null && setFieldValue(v.name, link)
                                }
                              >
                                {!!values[
                                  v.name as unknown as keyof typeof values
                                ]
                                  ? 'Upload New'
                                  : 'Upload'}
                              </UploadProcess>
                            )}
                          </Editable>
                        )
                      })}
                    </Flex>
                    <Flex sx={{ gap: 2, justifyContent: 'flex-end' }}>
                      {isAcceptReject ? (
                        <>
                          <ButtonModal
                            isSecondary={true}
                            title="Reject user?"
                            titleProps={{
                              as: 'h3',
                              width: 'auto',
                            }}
                            width={['60%', '50%', '40%', '30%']}
                            style={{ alignSelf: 'flex-end' }}
                            disabled={isUpdating || isSubmitting}
                            modalChild={({ setOpen }) => (
                              <AreYouSure
                                cancelText="No"
                                confirmText="Yes"
                                onSubmit={() =>
                                  callApi({
                                    id: data.id,
                                    status: UserStatus.CANCELED,
                                  })
                                }
                                setOpen={setOpen}
                              />
                            )}
                          >
                            Reject
                          </ButtonModal>
                          <ButtonModal
                            title="Accept user?"
                            titleProps={{
                              as: 'h3',
                              width: 'auto',
                            }}
                            width={['60%', '50%', '40%', '30%']}
                            style={{ alignSelf: 'flex-end' }}
                            disabled={isUpdating || isSubmitting}
                            modalChild={({ setOpen }) => (
                              <AreYouSure
                                cancelText="No"
                                confirmText="Yes"
                                onSubmit={() =>
                                  callApi({
                                    id: data.id,
                                    status: UserStatus.ACTIVE,
                                  })
                                }
                                setOpen={setOpen}
                              />
                            )}
                          >
                            Accept
                          </ButtonModal>
                        </>
                      ) : (
                        <>
                          {!isDisabled && (
                            <ButtonModal
                              isSecondary={true}
                              title="Move to application?"
                              titleProps={{
                                as: 'h3',
                                width: 'auto',
                              }}
                              width={['60%', '50%', '40%', '30%']}
                              style={{ alignSelf: 'flex-end' }}
                              disabled={
                                isSubmitting || isUpdating || isDisabled
                              }
                              modalChild={({ setOpen }) => (
                                <AreYouSure
                                  cancelText="No"
                                  confirmText="Yes"
                                  onSubmit={() =>
                                    callApi({
                                      id: data.id,
                                      status: UserStatus.VERIFIED,
                                    })
                                  }
                                  setOpen={setOpen}
                                />
                              )}
                            >
                              Move to applications
                            </ButtonModal>
                          )}
                          <ButtonModal
                            title="Update user information?"
                            titleProps={{
                              as: 'h3',
                              width: 'auto',
                            }}
                            width={['60%', '50%', '40%', '30%']}
                            style={{ width: 120, alignSelf: 'flex-end' }}
                            disabled={isSubmitting || isUpdating || isDisabled}
                            modalChild={({ setOpen }) => (
                              <AreYouSure
                                cancelText="No"
                                confirmText="Yes"
                                onSubmit={() => submitForm()}
                                setOpen={setOpen}
                              />
                            )}
                          >
                            Save
                          </ButtonModal>
                        </>
                      )}
                    </Flex>
                  </FormContainer>
                )
              }}
            </Formik>
          )
        )}
      </Flex>
    )
  }
)

UserInformation.displayName = 'UserInfo'
