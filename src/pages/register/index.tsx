import { Flex, Image, Link, Text, TextProps } from 'rebass'
import Wave from 'react-wavify'
import { theme } from 'utils/theme'

import { useState, useEffect, useCallback, memo, useRef } from 'react'
import { Formik } from 'formik'
import { FormContainer, ScrollToError } from 'components/forms'
import { FormInput, InputError } from 'components/input'
import { Button, UploadButton, UploadProcess } from 'components/button'
import { FormikValidation } from 'helpers'
import {
  loginUser,
  refreshVerifCode,
  registerUser,
  resetPass,
  verifyUser,
} from 'api'
import { useApiPost, useUser, useUserNotVerifiedGuard } from 'hooks'
import { Loading } from 'components/loading'
import { Main } from 'components/main'
import { Option, Select } from 'components/select'
import {
  Level,
  Levels,
  ShsTrackAndStrandsEnum,
  ShsTrackAndStrands,
  CollegeEnum,
  CollegeCourses,
  RegFormType,
  DISPLAY_FILES,
  UserInfo,
  RequiredFiles,
} from 'constant'
import { Firebase } from 'firebaseapp'
import { StorageError, TaskState } from 'firebase/storage'
import { Label } from 'components/label'

const SCHOOL_LEVEL: Option<string, Level>[] = [
  {
    label: Levels[Level.SHS],
    value: Level.SHS,
  },
  {
    label: Levels[Level.COLLEGE],
    value: Level.COLLEGE,
  },
]

const SHS_PROGRAMS: Option<string, ShsTrackAndStrandsEnum | null>[] = [
  ...Object.keys(ShsTrackAndStrands).map((v) => {
    return {
      label: ShsTrackAndStrands[v as keyof typeof ShsTrackAndStrands],
      value: v as ShsTrackAndStrandsEnum,
    }
  }),
  { label: 'Others', value: null },
]

const COLLEGE_PROGRAMS: Option<string, CollegeEnum | null>[] = [
  ...Object.keys(CollegeCourses).map((v) => {
    return {
      label: CollegeCourses[v as keyof typeof CollegeCourses],
      value: v as CollegeEnum,
    }
  }),
]

const ValidateEmail = () => {
  const { user, refetch } = useUser()

  const [time, setTime] = useState(180)

  const { callApi, isSuccess, isFetching, error } = useApiPost<
    boolean,
    { code: string } | undefined
  >(verifyUser)

  const {
    isFetching: isRefreshing,
    isSuccess: isSuccessRefresh,
    callApi: refreshCode,
  } = useApiPost<boolean, undefined>(refreshVerifCode)

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((i) => (i > 0 ? i - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [setTime, time])

  useEffect(() => {
    if (isSuccess) refetch()
  }, [isSuccess])

  useEffect(() => {
    setTime(180)
  }, [isSuccessRefresh])

  return (
    <Formik
      key={3}
      initialValues={{ code: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        callApi({ code: values.code })
        setSubmitting(false)
      }}
      validationSchema={FormikValidation.code}
    >
      {({ values, isSubmitting }) => (
        <FormContainer
          flex={1}
          label="Verify your account"
          labelProps={{ sx: { justifyContent: 'center', mb: 10 } }}
          flexProps={{ sx: { gap: 10, height: '100%', flex: 1 } }}
        >
          <Flex flexDirection={'column'} sx={{ gap: 4 }}>
            <Text>
              Hi! Please verify your account to continue, here are the following
              details you used to register your account.
            </Text>
            <Text as={'h3'} sx={{ fontWeight: 300 }}>
              Name:{' '}
              <b>
                {user?.lname}, {user?.fname} {user?.mname}
              </b>
            </Text>
            <Text as={'h3'} sx={{ fontWeight: 300 }}>
              Email: <b>{user?.email}</b>
            </Text>
          </Flex>
          <FormInput
            name="code"
            type={'text'}
            placeholder="Verification Code"
            value={values.code}
          />
          {(isSubmitting || isFetching || isRefreshing) && <Loading />}
          <Flex sx={{ flexDirection: 'column', gap: 2, width: '100%' }}>
            <Flex
              alignSelf={'end'}
              alignItems={'end'}
              sx={{ gap: 1, width: '100%' }}
            >
              {time > 0 ? (
                <Text textAlign={'right'} flex={1} sx={{ color: 'black' }}>
                  {time}s
                </Text>
              ) : (
                <Text
                  sx={{
                    color: 'blue',
                    flex: [],
                    width: time === 0 ? '100%' : 'auto',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textAlign: 'right',
                  }}
                  onClick={() => refreshCode()}
                >
                  Resend
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex flexDirection="column" width={'100%'} sx={{ gap: 2 }}>
            <InputError error={error?.response?.data?.message} />
            <Button
              type="submit"
              fullWidth={false}
              style={{ width: 120, alignSelf: 'flex-end' }}
              disabled={isSubmitting || isRefreshing || isFetching}
            >
              Submit
            </Button>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

export default function Register() {
  const { refetch } = useUser()

  const { callApi, isSuccess, isFetching, error } = useApiPost<
    any,
    UserInfo & RequiredFiles
  >(registerUser)

  const isVerification = useUserNotVerifiedGuard()

  useEffect(() => {
    if (!!isSuccess) {
      refetch()
    }
  }, [isSuccess])

  useEffect(() => {
    if (!!error) {
      alert(error.response.data.message || 'Invalid user')
    }
  }, [error])

  return (
    <Main>
      <Flex sx={{ flexDirection: 'column', gap: 4, padding: 4, flex: 1 }}>
        {isVerification ? (
          <ValidateEmail />
        ) : (
          <Formik<RegFormType>
            key={1}
            initialValues={{ fname: '', lname: '', email: '', address: '' }}
            validationSchema={FormikValidation.register}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true)
              callApi(values as any)
              setSubmitting(false)
            }}
          >
            {({ values, isSubmitting, setFieldValue, errors }) => (
              <FormContainer
                flex={1}
                label={`Sign up for scholar`}
                // image="/assets/logo.png"
                // imageProps={{ height: 100, width: 100, margin: 'none' }}
                labelProps={{ sx: { justifyContent: 'left' } }}
                flexProps={{ sx: { gap: 20, mb: 30 } }}
              >
                {(isSubmitting || isFetching) && <Loading />}

                <Flex
                  sx={{ flexDirection: ['column', 'column', 'row'], gap: 2 }}
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
                    />
                    <FormInput
                      containerProps={{ flex: 1 }}
                      name="mname"
                      type={'text'}
                      label={'Middle Name (Optional)'}
                      placeholder="Middle Name (Optional)"
                      sx={{ flex: 1 }}
                    />
                  </Flex>
                  <FormInput
                    containerProps={{ flex: 1 }}
                    name="lname"
                    type={'text'}
                    label={'Last Name'}
                    placeholder="Last Name"
                    sx={{ flex: 1 }}
                  />
                </Flex>
                <FormInput
                  containerProps={{ flex: 1 }}
                  name="email"
                  type={'email'}
                  placeholder="Email"
                  label="Email"
                  sx={{ flex: 1 }}
                />
                <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
                  <Select
                    isSearchable={true}
                    name={'level'}
                    options={SCHOOL_LEVEL}
                    controlStyle={{
                      padding: 8,
                      borderColor: 'black',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    onChange={(v) => {
                      setFieldValue('level', (v as any).value)
                      setFieldValue('program', undefined)
                    }}
                    theme={(ct) => ({
                      ...ct,
                      colors: {
                        ...ct.colors,
                        primary25: theme.colors.green40,
                        primary: theme.colors.darkerGreen,
                      },
                    })}
                    placeholder="Select School Level"
                  />
                  <InputError error={errors.level} />
                </Flex>

                {!!values.level && (
                  <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
                    <Select
                      isSearchable={true}
                      name="program"
                      options={[
                        { label: 'Select Program...', value: undefined },
                        ...((values.level === Level.SHS
                          ? SHS_PROGRAMS
                          : COLLEGE_PROGRAMS) as any[]),
                      ]}
                      controlStyle={{
                        padding: 8,
                        borderColor: 'black',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                      }}
                      value={[
                        { label: 'Select Program...', value: undefined },
                        ...((values.level === Level.SHS
                          ? SHS_PROGRAMS
                          : COLLEGE_PROGRAMS) as any[]),
                      ].find((v) => v.value === values.program)}
                      onChange={(v) => {
                        setFieldValue('program', (v as any).value)
                      }}
                      theme={(ct) => ({
                        ...ct,
                        colors: {
                          ...ct.colors,
                          primary25: theme.colors.green40,
                          primary: theme.colors.darkerGreen,
                        },
                      })}
                      placeholder="Select Time"
                    />
                    <InputError error={errors.program} />
                  </Flex>
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
                  placeholder={'Address'}
                  maxRows={2}
                  padding={20}
                  paddingBottom={15}
                  sx={{ color: 'black', width: '100%' }}
                />
                {/* <UploadButton>dwa</UploadButton> */}
                <Flex
                  flexWrap={'wrap'}
                  flexDirection={'column'}
                  sx={{ gap: 2 }}
                >
                  {DISPLAY_FILES.map((_, i) => {
                    if (i % 2 === 0) {
                      const v = DISPLAY_FILES[i]
                      const v2 = DISPLAY_FILES[i + 1]
                      return (
                        <Flex
                          width="100%"
                          key={i}
                          flexDirection={['column', 'row']}
                        >
                          <Flex flex={[1, 0.51, 0.5]} alignItems={'center'}>
                            <UploadProcess
                              name={v.name}
                              key={v.name}
                              title={v.title}
                              textProps={{
                                fontWeight: 'bold',
                                justifyContent: 'center',
                              }}
                              errorString={
                                errors[v.name as keyof typeof errors]
                              }
                              width={150}
                              onChange={(link) => setFieldValue(v.name, link)}
                            />
                          </Flex>
                          {!!v2 && (
                            <Flex flex={[1, 0.49, 0.5]}>
                              <UploadProcess
                                name={v2.name}
                                key={v2.name}
                                title={v2.title}
                                textProps={{
                                  fontWeight: 'bold',
                                  justifyContent: 'center',
                                }}
                                errorString={
                                  errors[v2.name as keyof typeof errors]
                                }
                                width={150}
                                onChange={(link) =>
                                  setFieldValue(v2.name, link)
                                }
                              />
                            </Flex>
                          )}
                        </Flex>
                      )
                    }
                  })}
                </Flex>
                <ScrollToError>
                  {(scroll) => (
                    <Button
                      style={{ width: 120, alignSelf: 'flex-end' }}
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => scroll()}
                    >
                      Sign up
                    </Button>
                  )}
                </ScrollToError>
              </FormContainer>
            )}
          </Formik>
        )}
      </Flex>
    </Main>
  )
}
