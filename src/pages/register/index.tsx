import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'
import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { FormContainer, ScrollToError } from 'components/forms'
import { FormInput, InputError } from 'components/input'
import { Button } from 'components/button'
import { FormikValidation } from 'helpers'
import { refreshVerifCode, registerUser, verifyUser } from 'api'
import { useApiPost, useUser } from 'hooks'
import { Loading } from 'components/loading'

import { RegFormType, UserInfo, RequiredFiles } from 'constant'

import { UserStatus } from 'entities'
import { UserRequiredFields } from 'components/user-admin-comps'
import { CustomModal } from 'components/modal'
import { Checkbox, FormControlLabel } from '@mui/material'
import { ListContainer, ListItem } from 'components/ul'

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
    if (isSuccess) refetch(true)
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

export default function RegisterUser() {
  const { refetch, user, logout } = useUser()
  const { callApi, isSuccess, isFetching, error } = useApiPost<
    any,
    UserInfo & RequiredFiles
  >(registerUser)

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

  useEffect(() => {
    logout()
  }, [])

  return (
    <Flex sx={{ flexDirection: 'column', gap: 4, padding: 4, flex: 1 }}>
      {user?.status === UserStatus.PENDING ? (
        <ValidateEmail />
      ) : (
        <Formik<RegFormType & { checked: boolean; brgy: string; home: string }>
          key={1}
          initialValues={{
            fname: '',
            lname: '',
            email: '',
            home: '',
            address: '',
            brgy: '',
            checked: false,
          }}
          validationSchema={FormikValidation.createNewUser}
          onSubmit={(values, { setSubmitting }) => {
            delete (values as any).checked

            const completeAddress =
              values.home + ', ' + values.address + ', ' + values.brgy
            delete (values as any).home
            delete (values as any).address
            delete (values as any).brgy

            setSubmitting(true)

            callApi({ ...(values as any), address: completeAddress })
            setSubmitting(false)
          }}
          validateOnMount={true}
          validateOnChange={true}
        >
          {({
            values,
            isSubmitting,
            setFieldValue,
            errors,
            isValid,
            submitForm,
          }) => (
            <FormContainer
              flex={1}
              label={`Sign up for scholar`}
              labelProps={{ sx: { justifyContent: 'left' } }}
              flexProps={{ sx: { gap: 20, mb: 30 } }}
            >
              {(isSubmitting || isFetching) && <Loading />}

              <Flex sx={{ flexDirection: ['column', 'column', 'row'], gap: 2 }}>
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
              <Text as={'h3'}>Address</Text>
              <Flex
                flexDirection={'column'}
                sx={{
                  gap: 2,
                  p: 4,
                  pr: 2,
                  pl: 2,
                  borderTop: '1px solid black',
                  borderBottom: '1px solid black',
                  borderRadius: '2',
                }}
              >
                <FormInput
                  name="home"
                  label={'House number'}
                  placeholder={'House number'}
                  containerProps={{ flex: 1 }}
                  sx={{ flex: 1 }}
                />
                <FormInput
                  name="address"
                  label={'Street'}
                  placeholder={'Street'}
                  containerProps={{ flex: 1 }}
                  sx={{ flex: 1 }}
                />
                <FormInput
                  name="brgy"
                  label={'Barangay'}
                  placeholder={'Barangay'}
                  containerProps={{ flex: 1 }}
                  sx={{ flex: 1 }}
                />
              </Flex>
              <UserRequiredFields
                onAnyChange={setFieldValue}
                fields={values as any}
                errors={errors}
                isUser={true}
              />
              <ScrollToError>
                {(scroll) => (
                  <CustomModal
                    onClose={scroll}
                    title={'Please fill up all required fields'}
                    titleProps={{ as: 'h3' }}
                    modalChild={({ setOpen }) => {
                      return (
                        <Flex flexDirection={'column'} sx={{ gap: 2, mt: 2 }}>
                          <Button
                            style={{ width: 300 }}
                            onClick={() => setOpen(false)}
                          >
                            Ok
                          </Button>
                        </Flex>
                      )
                    }}
                    maxWidth={350}
                  >
                    {({ isOpen, setOpen }) => (
                      <Flex
                        flexDirection={'column'}
                        alignSelf={'flex-end'}
                        sx={{ gap: 2 }}
                      >
                        <CustomModal
                          title="Terms and Condition"
                          titleProps={{ as: 'h3' }}
                          modalChild={() => {
                            return (
                              <Flex flexDirection={'column'}>
                                <Text>
                                  By applying to the Lao Foundation Inc.
                                  scholarship program, the applicant agrees that
                                  the Lao Foundation Inc. will be collecting,
                                  storing, and processing their personal data
                                  and is not limited to their:
                                </Text>
                                <ListContainer>
                                  {[
                                    'Full Name',
                                    'Email',
                                    'Address',
                                    'ID Picture (2x2)',
                                    'Photocopy of National Career  Assessment Examination(NCAE)',
                                    'Certificate of Indigency',
                                    'Photocopy of Pantawid ID',
                                    'Grade Slip',
                                    'Photocopy of PSA Birth Certificate',
                                    'Autobiography',
                                    'Sketch of Home Address',
                                    'Water Bill',
                                    'Electric Bill',
                                    'Wifi Bill',
                                  ].map((v, i) => (
                                    <ListItem key={i}>{v}</ListItem>
                                  ))}
                                </ListContainer>
                                <Text>
                                  The foundation will use this information to
                                  assess your application and if the applicant
                                  is to be given the merit of scholarship; hence
                                  the information gathered will not be used and
                                  shared publicly but within Lao Foundation Inc.
                                  only.
                                </Text>
                              </Flex>
                            )
                          }}
                        >
                          {({ setOpen }) => (
                            <Flex
                              flexDirection={'column'}
                              width={'100%'}
                              mb={2}
                            >
                              <Flex
                                flexDirection={'row'}
                                alignItems={'center'}
                                name="checked"
                              >
                                <Checkbox
                                  checked={values.checked}
                                  style={{ pointerEvents: 'auto' }}
                                  onClick={() => {
                                    setFieldValue('checked', !values.checked)
                                  }}
                                />{' '}
                                <Text>
                                  By clicking this checkbox, you agree to our{' '}
                                  <span
                                    style={{
                                      textDecoration: 'underline',
                                      color: theme.colors.green,
                                      cursor: 'pointer',
                                      pointerEvents: 'auto',
                                    }}
                                    onClick={() => setOpen(true)}
                                  >
                                    terms and conditions
                                  </span>
                                </Text>
                              </Flex>
                              <Flex
                                justifyContent={'flex-end'}
                                alignItems={'flex-end'}
                                width={'100%'}
                                flexDirection={'column'}
                                textAlign={'end'}
                              >
                                <InputError error={errors.checked} />
                              </Flex>
                            </Flex>
                          )}
                        </CustomModal>
                        <Button
                          style={{ width: 120, alignSelf: 'flex-end' }}
                          type="submit"
                          disabled={
                            isSubmitting || Object.keys(errors).length > 0
                          }
                          onClick={() => {
                            if (!isValid) {
                              setOpen(true)
                            }
                          }}
                        >
                          Sign up
                        </Button>
                      </Flex>
                    )}
                  </CustomModal>
                )}
              </ScrollToError>
            </FormContainer>
          )}
        </Formik>
      )}
    </Flex>
  )
}
