import {
  useState,
  memo,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  getUserInfo,
  renewalScholar,
  submitBill,
  updatePaid,
  updateUser,
} from 'api'
import { Button, SecondaryButton, UploadProcess } from 'components/button'
import { FormContainer, ScrollToError } from 'components/forms'
import { FormInput, Input, InputError } from 'components/input'
import { Loading } from 'components/loading'
import { SelectV2 } from 'components/select'
import {
  COLLEGE_PROGRAMS,
  DISPLAY_FILES,
  LEVEL_EDUC,
  Level,
  RegFormType,
  RequiredFiles,
  SCHOOL_LEVEL,
  SHS_LEVEL_EDUC,
  SHS_PROGRAMS,
} from 'constant'
import { Roles, User, UserStatus } from 'entities'
import { Formik, FormikProps } from 'formik'
import { FormikValidation } from 'helpers'
import { useApi, useApiPost, useUser } from 'hooks'
import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'
import { AreYouSure, ButtonModal, CustomModal } from 'components/modal'
import { enumToFileName } from 'helpers/convertFiles'
import { AiOutlineDownCircle, AiOutlineUpCircle } from 'react-icons/ai'
import { format } from 'date-fns'
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material'

const UploadReceipt = ({ onSubmit }: { onSubmit: (v: string) => void }) => {
  const [link, setLink] = useState<string | undefined>()
  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
      <UploadProcess onChange={(v) => setLink(v)} />
      {!link && <Text color={'red'}>Please upload file</Text>}
      <Button onClick={() => !!link && onSubmit(link)} disabled={!link}>
        Save
      </Button>
    </Flex>
  )
}

export const OnReject = ({
  onSubmit,
  setOpen,
  reasons,
}: {
  onSubmit: ((v: string) => Promise<void>) | ((v: string) => void)
  setOpen: (v: boolean) => void
  reasons: string[]
}) => {
  const [reason, setReason] = useState<string>(reasons[0])
  const [other, setOther] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason((event.target as HTMLInputElement).value)
  }

  return (
    <AreYouSure
      cancelText="No"
      confirmText="Yes"
      message={
        <Flex flexDirection={'column'} width={'100%'}>
          <RadioGroup value={reason} onChange={handleChange}>
            {reasons.map((v, i) => (
              <FormControlLabel
                key={i}
                value={v}
                control={<Radio />}
                label={v}
              />
            ))}
            <FormControlLabel value={''} control={<Radio />} label={'Other'} />
          </RadioGroup>
          <Input
            multiline={true}
            padding={16}
            minRows={4}
            maxRows={6}
            placeholder="Other reason..."
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
          {!(reason + other) && (
            <Text as={'h6'} color={'red'}>
              Please specify your reasons for rejecting this application
            </Text>
          )}
        </Flex>
      }
      onSubmit={async () => {
        if (!(reason + other)) return
        await onSubmit(
          !!reason && !!other
            ? reason + ': ' + other
            : !!reason && !other
            ? reason
            : other
        )
      }}
      setOpen={(v) => setOpen(v)}
    />
  )
}

const ScholarHistory = memo(
  ({
    initial,
    title,
    isDisabled,
    custom,
    isAdd,
    isAddOrCancel,
    setIsAdd,
    onSuccess,
    onSuccessLink,
    otherData,
    status,
    index,
    id,
    shsGraduated,
    collegeGraudated,
    isUser,
    isEditCheckbox,
    onCheckClick,
    isAdmin,
  }: {
    initial: {
      level?: string
      program?: string
      lastGwa?: number
      education?: string
      gradeSlip?: string
      enrollmentBill?: string
      paid?: boolean
      receipt?: string | null
    }
    otherData?: {
      created?: Date
      accepted?: Date
      ended?: Date
    }
    title?: string
    isDisabled?: boolean
    custom?: ReactNode
    isAddOrCancel?: boolean
    isAdd?: boolean
    setIsAdd?: Dispatch<SetStateAction<boolean>>
    onSuccess?: () => void
    onSuccessLink?: (link: string) => void
    status?: string
    index?: number
    id: string
    shsGraduated: boolean
    collegeGraudated: boolean
    isUser?: boolean
    isEditCheckbox?: boolean
    onCheckClick?: (id: string, link?: string) => void
    isAdmin?: boolean
  }) => {
    const ref = useRef<
      FormikProps<{
        level?: string
        program?: string
        lastGwa?: number
        education?: string
        gradeSlip?: string
        enrollmentBill?: string
      }>
    >(null)

    const { callApi, isFetching, isSuccess } = useApiPost(renewalScholar)

    useEffect(() => {
      if (isSuccess) onSuccess?.()
    }, [isSuccess])

    return (
      <>
        {!!isAddOrCancel && isUser && !collegeGraudated && (
          <Flex sx={{ gap: 2 }}>
            {(status === 'ended' || status === 'rejected') &&
              (isAdd ? (
                <SecondaryButton
                  onClick={() => setIsAdd?.((v) => !v)}
                  style={{ width: 100 }}
                >
                  Cancel
                </SecondaryButton>
              ) : (
                <Button
                  onClick={() => setIsAdd?.((v) => !v)}
                  style={{ width: 100 }}
                >
                  Add
                </Button>
              ))}
            {isAdd && (
              <Button
                onClick={() => {
                  if (ref.current?.isValid) ref.current?.submitForm()
                }}
                style={{ width: 100 }}
              >
                Submit
              </Button>
            )}
          </Flex>
        )}
        {(!isAddOrCancel || !!isAdd) && (
          <Formik<{
            level?: string
            program?: string
            lastGwa?: number
            education?: string
            gradeSlip?: string
            enrollmentBill?: string
          }>
            innerRef={ref}
            initialValues={initial}
            validateOnMount={true}
            validationSchema={FormikValidation.renewal}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true)
              callApi({ ...values, id } as any)
              setSubmitting(false)
            }}
          >
            {({ values: fields, setFieldValue: onAnyChange, errors }) => {
              const findPrograms = [
                {
                  label: 'Select Program...',
                  value: undefined,
                },

                ...((fields.level === Level.SHS
                  ? SHS_PROGRAMS
                  : COLLEGE_PROGRAMS) as any[]),
              ].find((v) => v.value === fields.program)

              return (
                <>
                  <FormContainer
                    flexProps={{ sx: { gap: 3, mb: 30, mt: 4 } }}
                    label={title}
                    labelProps={{ as: 'h4' }}
                    custom={custom}
                  >
                    {isFetching && <Loading />}
                    <FormInput
                      disabled={isDisabled}
                      name="lastGwa"
                      type="number"
                      label="General Average"
                      placeholder="Type your general average"
                      value={fields.lastGwa}
                    />
                    <Flex
                      flexDirection={'column'}
                      sx={{ width: '100%', gap: 2 }}
                    >
                      <SelectV2
                        isDisabled={isDisabled}
                        label="Education"
                        options={SCHOOL_LEVEL.filter(
                          (v) =>
                            (v.value === Level.SHS && !shsGraduated) ||
                            (v.value === Level.COLLEGE && !collegeGraudated)
                        )}
                        value={
                          SCHOOL_LEVEL.find(
                            (v) => v.value === fields.education
                          ) as any
                        }
                        onChange={(v) => {
                          if (v === null) {
                            onAnyChange('education', undefined)
                          } else {
                            onAnyChange('education', v.value)
                          }
                          onAnyChange('program', undefined)
                          onAnyChange('level', undefined)
                        }}
                        placeholder="Select School Level"
                      />

                      <InputError error={errors.education} />
                    </Flex>

                    {!!fields.education && (
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
                            ...((fields.education === Level.SHS
                              ? SHS_PROGRAMS
                              : COLLEGE_PROGRAMS) as any[]),
                          ]}
                          value={
                            !!findPrograms
                              ? findPrograms
                              : !!fields.program || fields.program === null
                              ? { label: 'Others', value: 'Other' }
                              : (undefined as any)
                          }
                          onChange={(v) => {
                            if (v === null) {
                              onAnyChange('program', undefined)
                              return
                            }

                            if ((v as any).value === 'Other') {
                              onAnyChange('program', null)
                              return
                            }
                            onAnyChange('program', (v as any).value)
                          }}
                        />

                        <InputError error={errors.program} />
                      </Flex>
                    )}
                    {!findPrograms &&
                      (!!fields.program || fields.program === null) && (
                        <FormInput
                          disabled={isDisabled}
                          name={'program'}
                          label={'Others'}
                          placeholder={'Please type program'}
                          value={fields.program}
                        />
                      )}

                    {!!fields.program && (
                      <Flex
                        flexDirection={'column'}
                        sx={{ width: '100%', gap: 2 }}
                      >
                        <SelectV2
                          isDisabled={isDisabled}
                          label="Level"
                          placeholder="Select Education Level"
                          options={[
                            {
                              label: 'Select Education Level...',
                              value: undefined,
                            },
                            ...(fields.education === Level.SHS
                              ? (SHS_LEVEL_EDUC as any)
                              : (LEVEL_EDUC as any)),
                          ]}
                          value={
                            (
                              (fields.education
                                ? SHS_LEVEL_EDUC
                                : LEVEL_EDUC) as any[]
                            ).find((v) => v.value === fields.level)!
                          }
                          onChange={(v) => {
                            if (v === null) {
                              onAnyChange('level', undefined)
                              return
                            }

                            onAnyChange('level', (v as any).value)
                          }}
                        />

                        <InputError error={errors.level} />
                      </Flex>
                    )}

                    {!!otherData && (
                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        <Text as={'h3'}>Tuition Fee Payment</Text>
                        <Flex
                          flexDirection={'row'}
                          alignItems={'center'}
                          name="checked"
                          sx={{ gap: 2 }}
                        >
                          <CustomModal
                            title="Upload Receipt"
                            titleProps={{ as: 'h3' }}
                            width={['80%', 350, 350]}
                            modalChild={({}) => {
                              return (
                                <UploadReceipt
                                  onSubmit={(v) => {
                                    onCheckClick?.(id, v)
                                  }}
                                />
                              )
                            }}
                          >
                            {({ setOpen }) => (
                              <Checkbox
                                checked={!!initial.paid}
                                disabled={!isEditCheckbox}
                                style={{ pointerEvents: 'auto' }}
                                onClick={() => {
                                  setOpen(true)
                                }}
                              />
                            )}
                          </CustomModal>
                          <Text as={'h4'}>
                            Paid
                            {!!initial.receipt && !!initial.paid && isAdmin && (
                              <Button
                                style={{ marginLeft: 14 }}
                                onClick={() =>
                                  !!window &&
                                  window.open(initial.receipt as string)
                                }
                              >
                                View
                              </Button>
                            )}
                          </Text>
                        </Flex>
                        <Flex
                          flexDirection={'row'}
                          alignItems={'center'}
                          name="checked"
                          sx={{ gap: 2 }}
                        >
                          <Checkbox
                            checked={!!!initial.paid}
                            disabled={!isEditCheckbox}
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => {
                              onCheckClick?.(id)
                            }}
                          />{' '}
                          <Text as={'h4'}>Not Paid</Text>
                        </Flex>
                      </Flex>
                    )}
                    {!!otherData && (
                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        {otherData?.created && (
                          <Text as={'h4'} color="blue">
                            Created:{' '}
                            {format(
                              new Date(otherData.created),
                              'cccc LLLL d, yyyy hh:mm a'
                            )}
                          </Text>
                        )}
                        {otherData?.accepted && (
                          <Text as={'h4'} color={'green'}>
                            Accepted:{' '}
                            {format(
                              new Date(otherData.accepted),
                              'cccc LLLL d, yyyy hh:mm a'
                            )}
                          </Text>
                        )}
                        {otherData?.ended && (
                          <Text as={'h4'} color="red">
                            Ended:{' '}
                            {format(
                              new Date(otherData.ended),
                              'cccc LLLL d, yyyy hh:mm a'
                            )}
                          </Text>
                        )}
                      </Flex>
                    )}
                    {DISPLAY_FILES.filter(
                      (v) =>
                        v.name === 'gradeSlip' || v.name === 'enrollmentBill'
                    ).map((v) => {
                      return (
                        <Editable key={v.name}>
                          {(isEdit, setEdit) => (
                            <UploadProcess
                              disabled={!!index && index > 0}
                              name={v.name}
                              title={v.title}
                              isNew={
                                !!(
                                  !isEdit &&
                                  fields[
                                    v.name as unknown as keyof typeof fields
                                  ] &&
                                  initial[
                                    v.name as unknown as keyof typeof initial
                                  ]
                                )
                              }
                              newChildren={(deleteF) => {
                                return isEdit ? (
                                  <SecondaryButton
                                    onClick={() => {
                                      deleteF()
                                      onAnyChange(
                                        v.name as keyof typeof fields,
                                        initial[
                                          v.name as unknown as keyof typeof initial
                                        ]
                                      )
                                      setEdit((v) => !v)
                                    }}
                                  >
                                    Cancel
                                  </SecondaryButton>
                                ) : (
                                  !!fields[
                                    v.name as unknown as keyof typeof fields
                                  ] &&
                                    !!initial[
                                      v.name as unknown as keyof typeof initial
                                    ] && (
                                      <Flex
                                        flexDirection={'row'}
                                        sx={{ gap: 2 }}
                                      >
                                        <Button
                                          onClick={() =>
                                            !!window &&
                                            window.open(
                                              fields[
                                                v.name as unknown as keyof typeof fields
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
                              }}
                              textProps={{
                                fontWeight: 'bold',
                                justifyContent: 'center',
                              }}
                              errorString={
                                errors[v.name as keyof typeof errors] as any
                              }
                              width={150}
                              onChange={(link) =>
                                link !== null &&
                                !!onSuccessLink &&
                                v.name !== 'gradeSlip' &&
                                !!link
                                  ? onSuccessLink(link)
                                  : onAnyChange(v.name, link)
                              }
                            >
                              {!!fields[
                                v.name as unknown as keyof typeof fields
                              ]
                                ? 'Upload New'
                                : 'Upload'}
                            </UploadProcess>
                          )}
                        </Editable>
                      )
                    })}
                  </FormContainer>
                </>
              )
            }}
          </Formik>
        )}
      </>
    )
  }
)

ScholarHistory.displayName = 'ScholarHistory'

const AddOrCancel = ({
  status,
  id,
  onSuccess,
  college,
  shs,
  isUser,
}: {
  status: string
  id: string
  onSuccess: () => void
  college: boolean
  shs: boolean
  isUser?: boolean
}) => {
  const [isAdd, setIsAdd] = useState(false)

  return (
    <Flex flexDirection={'column'}>
      <ScholarHistory
        initial={{}}
        isAddOrCancel={true}
        isUser={isUser}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        status={status}
        collegeGraudated={college}
        shsGraduated={shs}
        onSuccess={() => {
          onSuccess()
          setIsAdd(false)
        }}
        id={id}
      />
    </Flex>
  )
}

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

const DisplayOrNot = memo(
  ({ title, children }: { title: string; children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <Flex flexDirection={'column'} width="100%" sx={{ gap: 2 }}>
        <Flex
          flexDirection={'row'}
          sx={{
            gap: 3,
            alignItems: 'center',
            borderBottom: '1px solid black',
            cursor: 'pointer',
            padding: 3,
            ':hover': {
              backgroundColor: 'rgba(1,1,1,0.2)',
            },
          }}
          onClick={() => setIsOpen((v) => !v)}
        >
          <Text flex={1} as={'h3'}>
            {title}
          </Text>
          {!isOpen ? (
            <AiOutlineDownCircle
              cursor="pointer"
              size={25}
              style={{ alignItems: 'center' }}
            />
          ) : (
            <AiOutlineUpCircle
              cursor="pointer"
              size={25}
              style={{ alignItems: 'center' }}
            />
          )}
        </Flex>

        {isOpen && (
          <Flex flexDirection={'column'} p={3}>
            {children}
          </Flex>
        )}
      </Flex>
    )
  }
)

DisplayOrNot.displayName = 'displayornot'

export const UserInformation = memo(
  ({
    id,
    onSuccess,
    isDisabled,
    isAcceptReject,
    isUser,
    isApplicant,
    onAccepted,
    onRejected,
    status = UserStatus.ACTIVE,
  }: {
    id: string
    onSuccess?: () => void
    isDisabled?: boolean
    isAcceptReject?: boolean
    isUser?: boolean
    isApplicant?: boolean
    onAccepted?: () => void
    onRejected?: () => void
    status?: UserStatus
  }) => {
    const {
      data: userData,
      isFetching,
      refetch,
    } = useApi<User>(getUserInfo, false, id)

    const {
      isSuccess,
      isFetching: isUpdating,
      callApi,
      state,
    } = useApiPost(updateUser)

    const {
      isSuccess: isSuccessPaid,
      isFetching: isUpdatingPaid,
      callApi: updatePaidFunc,
    } = useApiPost(updatePaid)

    useEffect(() => {
      if (isSuccess && state === 'accepted') onAccepted?.()
      if (isSuccess && state === 'rejected') onRejected?.()
    }, [isSuccess, state])

    useEffect(() => {
      if (isSuccessPaid) refetch(id)
    }, [isSuccessPaid])

    const { user, roles } = useUser()

    const data = useMemo(() => {
      let userInfo = structuredClone(userData) as unknown as Partial<
        User | { files: undefined }
      >

      userInfo = {
        ...userInfo,
        ...(userData?.files?.reduce((before, now) => {
          return {
            ...before,
            [enumToFileName(now.type) as unknown as any]: now.link,
          }
        }, {} as Partial<RequiredFiles>) ?? {}),
      }

      delete userInfo?.files

      return userInfo as unknown as RegFormType & {
        status: UserStatus
        role: Roles[]
      }
    }, [userData])

    const sorted = useMemo(() => {
      return (
        userData?.scholar?.sort((a, b) => {
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        }) ?? []
      )
    }, [userData])

    return (
      <Flex flexDirection={'column'} width={'100%'}>
        {isFetching ? (
          <Loading />
        ) : (
          !!data && (
            <Formik<RegFormType & { status: UserStatus; role: Roles[] }>
              initialValues={{
                ...(data as any),
              }}
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
                return (
                  <FormContainer
                    flex={1}
                    // image="/assets/logo.png"
                    // imageProps={{ height: 100, width: 100, margin: 'none' }}
                    labelProps={{ sx: { justifyContent: 'left' } }}
                    flexProps={{ sx: { gap: 20, mb: 30, mt: 2 } }}
                  >
                    {(isSubmitting ||
                      isFetching ||
                      isUpdating ||
                      isUpdatingPaid) && <Loading />}
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
                          disabled={true}
                        />
                        <FormInput
                          containerProps={{ flex: 1 }}
                          name="mname"
                          type={'text'}
                          label={'Middle Name (Optional)'}
                          placeholder="Middle Name (Optional)"
                          sx={{ flex: 1 }}
                          disabled={true}
                        />
                      </Flex>
                      <FormInput
                        containerProps={{ flex: 1 }}
                        name="lname"
                        type={'text'}
                        label={'Last Name'}
                        placeholder="Last Name"
                        sx={{ flex: 1 }}
                        disabled={true}
                      />
                    </Flex>
                    <FormInput
                      containerProps={{ flex: 1 }}
                      name="email"
                      type={'email'}
                      placeholder="Email"
                      label="Email"
                      sx={{ flex: 1 }}
                      disabled={true}
                    />
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
                    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                      {userData?.shsGraduated && (
                        <Text as={'h3'}>
                          Graduated SHS:{' '}
                          {format(
                            new Date(userData?.shsGraduated),
                            'cccc LLLL d, yyyy'
                          )}
                        </Text>
                      )}
                      {userData?.collegeGraduated && (
                        <Text as={'h3'}>
                          Graduated College:{' '}
                          {format(
                            new Date(userData?.collegeGraduated),
                            'cccc LLLL d, yyyy'
                          )}
                        </Text>
                      )}
                    </Flex>
                    <Flex flexDirection={'column'} sx={{ gap: 1 }}>
                      <DisplayOrNot title="Files">
                        <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                          {DISPLAY_FILES.filter(
                            (v) =>
                              (v.name !== 'gradeSlip' &&
                                v.name !== 'enrollmentBill' &&
                                v.name !== 'homeVisitProof') ||
                              (!isUser &&
                                !isApplicant &&
                                v.name === 'homeVisitProof')
                          ).map((v, i) => {
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
                                        data[
                                          v.name as unknown as keyof typeof data
                                        ]
                                      )
                                    }
                                    newChildren={(deleteF) =>
                                      isEdit ? (
                                        <SecondaryButton
                                          onClick={() => {
                                            deleteF()
                                            setFieldValue(
                                              v.name as keyof typeof values,
                                              data[
                                                v.name as unknown as keyof typeof data
                                              ]
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
                                                onClick={() =>
                                                  setEdit((v) => !v)
                                                }
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
                                      errors[
                                        v.name as keyof typeof errors
                                      ] as any
                                    }
                                    width={150}
                                    onChange={(link) =>
                                      link !== null &&
                                      setFieldValue(v.name, link)
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
                      </DisplayOrNot>
                      <DisplayOrNot title="Scholar History">
                        <AddOrCancel
                          isUser={user?.id === userData?.id}
                          shs={!!userData?.shsGraduated}
                          college={!!userData?.collegeGraduated}
                          status={sorted?.[0]?.status}
                          id={id}
                          onSuccess={() => refetch(id)}
                        />
                        <Flex flexDirection={'column'}>
                          {sorted?.map((v, i) => {
                            return (
                              <ScholarHistory
                                onCheckClick={(_, link) =>
                                  updatePaidFunc({ id: v.id, link })
                                }
                                isAdmin={roles.isAdmin || roles.isSuper}
                                shsGraduated={!!userData?.shsGraduated}
                                collegeGraudated={!!userData?.collegeGraduated}
                                isEditCheckbox={!isUser && !isDisabled}
                                id={id}
                                index={i}
                                initial={{
                                  level: v.level as unknown as string,
                                  education: v.education!,
                                  enrollmentBill: v.enrollmentBill,
                                  gradeSlip: v.gradeSlip,
                                  lastGwa: v.lastGwa,
                                  program: v.program as string,
                                  paid: v.paid,
                                  receipt: v.receipt,
                                }}
                                otherData={{
                                  accepted: v.accepted || undefined,
                                  created: v.created,
                                  ended: v.ended || undefined,
                                }}
                                key={i}
                                title={v.education + ' - ' + v.level}
                                onSuccessLink={(link: string) =>
                                  submitBill({
                                    enrollmentBill: link,
                                    id,
                                  }).then(() => refetch(id))
                                }
                                custom={
                                  !isApplicant && (
                                    <Flex
                                      sx={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      {v.status === 'started' && !isUser ? (
                                        <ButtonModal
                                          isSecondary={true}
                                          title="End user scholarship?"
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
                                                !!userData?.id &&
                                                callApi({
                                                  id: userData.id,
                                                  scholarStatus: 'ended',
                                                })
                                              }
                                              message="Are you sure? It cannot be undone."
                                              setOpen={setOpen}
                                            />
                                          )}
                                        >
                                          End
                                        </ButtonModal>
                                      ) : v.status === ('pending' as any) &&
                                        !isUser ? (
                                        <ButtonModal
                                          title="Start user scholarship?"
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
                                                !!userData?.id &&
                                                callApi({
                                                  id: userData.id,
                                                  scholarStatus: 'started',
                                                })
                                              }
                                              message="Are you sure? It cannot be undone."
                                              setOpen={setOpen}
                                            />
                                          )}
                                        >
                                          Accept
                                        </ButtonModal>
                                      ) : (
                                        <Text
                                          fontWeight={700}
                                          color={
                                            v.status == 'ended' ||
                                            v.status === ('rejected' as any)
                                              ? 'red'
                                              : v.status === 'started'
                                              ? 'green'
                                              : 'blue'
                                          }
                                        >
                                          {v.status === 'started'
                                            ? 'ACTIVE'
                                            : v.status.toUpperCase()}
                                        </Text>
                                      )}
                                    </Flex>
                                  )
                                }
                                isDisabled={true}
                              />
                            )
                          })}
                        </Flex>
                      </DisplayOrNot>
                    </Flex>
                    <Flex sx={{ gap: 2 }}>
                      <Flex flex={1}>
                        {isApplicant && !!data && (
                          <Editable>
                            {(isEdit, setEdit) => (
                              <UploadProcess
                                name={'homeVisitProof'}
                                title={'Home Visit Proof'}
                                isNew={
                                  !!(
                                    !isEdit &&
                                    values.homeVisitProof &&
                                    data.homeVisitProof
                                  )
                                }
                                newChildren={(deleteF) => {
                                  return isEdit ? (
                                    <SecondaryButton
                                      onClick={() => {
                                        deleteF()
                                        setFieldValue(
                                          'homeVisitProof',
                                          data.homeVisitProof
                                        )
                                        setEdit((v) => !v)
                                      }}
                                    >
                                      Cancel
                                    </SecondaryButton>
                                  ) : (
                                    !!values.homeVisitProof &&
                                      !!data.homeVisitProof && (
                                        <Flex
                                          flexDirection={'row'}
                                          sx={{ gap: 2 }}
                                        >
                                          <Button
                                            onClick={() =>
                                              !!window &&
                                              window.open(values.homeVisitProof)
                                            }
                                          >
                                            View
                                          </Button>

                                          <SecondaryButton
                                            onClick={() => setEdit((v) => !v)}
                                          >
                                            Edit
                                          </SecondaryButton>
                                        </Flex>
                                      )
                                  )
                                }}
                                textProps={{
                                  fontWeight: 'bold',
                                  justifyContent: 'center',
                                }}
                                errorString={errors.homeVisitProof}
                                width={150}
                                onChange={(link) => {
                                  setFieldValue('homeVisitProof', link)
                                }}
                              >
                                {!!values.homeVisitProof
                                  ? 'Upload New'
                                  : 'Upload'}
                              </UploadProcess>
                            )}
                          </Editable>
                        )}
                        {!isAcceptReject && userData?.id !== user?.id && (
                          <Flex flexWrap={'wrap'} sx={{ gap: 2 }}>
                            <ButtonModal
                              isSecondary={!!userData?.shsGraduated}
                              title={
                                !userData?.shsGraduated
                                  ? 'Graduate SHS?'
                                  : 'Ungraduate SHS?'
                              }
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
                                    !!userData?.id &&
                                    callApi({
                                      id: userData.id,
                                      isShsGraduate: !userData?.shsGraduated,
                                    })
                                  }
                                  setOpen={setOpen}
                                />
                              )}
                            >
                              {!userData?.shsGraduated
                                ? 'SHS GRADUATE'
                                : 'UNGRADUATE SHS'}
                            </ButtonModal>
                            <ButtonModal
                              isSecondary={!!userData?.collegeGraduated}
                              title={
                                !userData?.shsGraduated
                                  ? 'Graduate College?'
                                  : 'Ungraduate College?'
                              }
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
                                    !!userData?.id &&
                                    callApi({
                                      id: userData.id,
                                      isCollegeGraduate:
                                        !userData?.collegeGraduated,
                                    })
                                  }
                                  setOpen={setOpen}
                                />
                              )}
                            >
                              {!userData?.collegeGraduated
                                ? 'COLLEGE GRADUATE'
                                : 'UNGRADUATE COLLEGE'}
                            </ButtonModal>
                          </Flex>
                        )}
                      </Flex>
                      {isAcceptReject ? (
                        <>
                          {data.status !== UserStatus.CANCELED && (
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
                                <OnReject
                                  onSubmit={(v) =>
                                    !!userData?.id &&
                                    callApi(
                                      {
                                        id: userData.id,
                                        status: UserStatus.CANCELED,
                                        scholarStatus: 'rejected',
                                        reason: v,
                                      },
                                      'rejected'
                                    )
                                  }
                                  setOpen={(v) => setOpen(v)}
                                  reasons={[
                                    "The grade does not meet the Foundation's requirements",
                                    'Incorrect Uploaded File',
                                    'Outdated Uploaded File',
                                    'Not Complete File',
                                    'After the House Visitation we noticed that the family can afford the tuition fee and other miscellaneous',
                                  ]}
                                />
                              )}
                            >
                              Reject
                            </ButtonModal>
                          )}
                          {(status === UserStatus.ACTIVE ||
                            status === UserStatus.PROCESSING) && (
                            <CustomModal
                              title="Note!"
                              titleProps={{
                                as: 'h3',
                                width: 'auto',
                              }}
                              modalChild={
                                "You can't accept an applicant without home visit proof!"
                              }
                            >
                              {({ setOpen: setReject }) => (
                                <CustomModal
                                  title={
                                    status === UserStatus.PROCESSING
                                      ? 'Process User'
                                      : 'Accept User'
                                  }
                                  titleProps={{
                                    as: 'h3',
                                    width: 'auto',
                                  }}
                                  width={['60%', '50%', '40%', '30%']}
                                  modalChild={({ setOpen }) => (
                                    <AreYouSure
                                      cancelText="No"
                                      confirmText="Yes"
                                      onSubmit={() => {
                                        !!userData?.id &&
                                          (status === UserStatus.ACTIVE
                                            ? callApi(
                                                {
                                                  id: userData.id,
                                                  status: UserStatus.ACTIVE,
                                                  scholarStatus: 'started',
                                                  homeVisitProof:
                                                    data.homeVisitProof ||
                                                    values.homeVisitProof,
                                                },
                                                'accepted'
                                              )
                                            : callApi(
                                                {
                                                  id: userData.id,
                                                  status: UserStatus.PROCESSING,
                                                },
                                                'accepted'
                                              ))
                                      }}
                                      setOpen={setOpen}
                                    />
                                  )}
                                >
                                  {({ setOpen }) => (
                                    <Button
                                      disabled={isUpdating || isSubmitting}
                                      style={{ alignSelf: 'flex-end' }}
                                      onClick={() => {
                                        if (
                                          !data.homeVisitProof &&
                                          !values.homeVisitProof &&
                                          status === UserStatus.ACTIVE
                                        ) {
                                          setReject(true)
                                          return
                                        }
                                        setOpen(true)
                                      }}
                                    >
                                      {status === UserStatus.ACTIVE
                                        ? 'Accept'
                                        : 'Process'}
                                    </Button>
                                  )}
                                </CustomModal>
                              )}
                            </CustomModal>
                          )}
                        </>
                      ) : (
                        <>
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
