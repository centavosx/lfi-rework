import { Flex, Image, Link, Text } from 'rebass'
import Wave from 'react-wavify'
import { theme } from 'utils/theme'

import { useState, useEffect, useCallback } from 'react'
import { Formik } from 'formik'
import { FormContainer } from 'components/forms'
import { FormInput, InputError } from 'components/input'
import { Button } from 'components/button'
import { FormikValidation } from 'helpers'
import {
  loginUser,
  refreshVerifCode,
  registerUser,
  resetPass,
  verifyUser,
} from 'api'
import { useUser } from 'hooks'
import { Loading } from 'components/loading'

const ValidateEmail = () => {
  const { refetch } = useUser()
  const [error, setError] = useState('')

  const [time, setTime] = useState(180)
  const [isSubmitRefresh, setIsSubmitRefresh] = useState(false)

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((i) => (i > 0 ? i - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [setTime, time])

  const refreshCode = useCallback(() => {
    setIsSubmitRefresh(true)
    refreshVerifCode()
      .then(() => setTime(180))
      .finally(() => setIsSubmitRefresh(false))
  }, [setTime, setIsSubmitRefresh])

  return (
    <Formik
      key={3}
      initialValues={{ code: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        if (time > 0)
          return verifyUser(values)
            .then(async () => await refetch())
            .catch((v) => alert(v.response.data.message || 'Invalid code'))
            .finally(() => {
              setSubmitting(false)
            })
        setSubmitting(false)
        return setError(
          'Your verification code is now expired, please resend new verification code.'
        )
      }}
      validationSchema={FormikValidation.code}
    >
      {({ values, isSubmitting }) => (
        <FormContainer
          flex={1}
          label="Verify your account"
          labelProps={{ sx: { justifyContent: 'center' } }}
          flexProps={{ sx: { gap: 20 } }}
        >
          <FormInput
            name="code"
            type={'text'}
            placeholder="Verification Code"
            value={values.code}
          />
          {(isSubmitting || isSubmitRefresh) && <Loading />}
          <Flex sx={{ flexDirection: 'column', gap: 2, width: '100%' }}>
            <Flex
              alignSelf={'end'}
              alignItems={'end'}
              sx={{ gap: 1, width: '100%' }}
            >
              {time > 0 && (
                <Text textAlign={'right'} flex={1} sx={{ color: 'black' }}>
                  {time}s
                </Text>
              )}
              <Text
                sx={{
                  color: 'blue',
                  flex: [],
                  width: time === 0 ? '100%' : 'auto',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
                onClick={refreshCode}
              >
                Resend
              </Text>
            </Flex>
          </Flex>
          <InputError error={error} />
          <Button
            type="submit"
            fullWidth={false}
            style={{ width: 120, alignSelf: 'flex-end' }}
            disabled={isSubmitting || isSubmitRefresh}
          >
            Submit
          </Button>
        </FormContainer>
      )}
    </Formik>
  )
}

const ResetPassword = ({ onSubmit }: { onSubmit?: () => void }) => {
  return (
    <Formik
      key={4}
      initialValues={{ email: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        resetPass(values.email)
          .then(() => {
            alert('Reset password link has been sent.')
            onSubmit?.()
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
      validationSchema={FormikValidation.forgot}
    >
      {({ values, isSubmitting }) => (
        <FormContainer
          flex={1}
          label="Forgot Password"
          labelProps={{ sx: { justifyContent: 'center' } }}
          flexProps={{ sx: { gap: 20 } }}
        >
          {isSubmitting && <Loading />}
          <FormInput
            name="email"
            type={'email'}
            placeholder="Enter your email"
            value={values.email}
          />

          <Flex>
            <Flex flex={1}>
              <Button
                fullWidth={false}
                style={{ width: 120, alignSelf: 'flex-end' }}
                disabled={isSubmitting}
                onClick={onSubmit}
              >
                Back
              </Button>
            </Flex>

            <Button
              type="submit"
              fullWidth={false}
              style={{ width: 120, alignSelf: 'flex-end' }}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

export default function Login() {
  const { width, height } = useWindowSize()
  const { refetch } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [isReset, setIsReset] = useState(false)

  let rotatedWidth = 0,
    rotatedHeight = 0,
    scale = 0,
    yshift = 0

  if (width !== undefined && height !== undefined) {
    var rad = (90 * Math.PI) / 180,
      sin = Math.sin(rad),
      cos = Math.cos(rad)

    rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin)
    rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos)
    scale = width > height ? height / width : 1
    yshift = -100 * scale
  }

  return (
    <Flex
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor:
          !!width && !!height && width >= height
            ? theme.colors.pink
            : theme.colors.blackgray,
      }}
    >
      {!!width && !!height && width >= height ? (
        <Wave
          fill={theme.colors.blackgray}
          paused={false}
          options={{
            height: height * (scale * 0.2),
            amplitude: 50,
            speed: 0.5,
            points: 8,
          }}
          style={{
            height:
              Number(
                rotatedWidth +
                  (scale < 0.6
                    ? (rotatedWidth * 35) / 100
                    : scale >= 0.6 && scale < 0.7
                    ? (rotatedWidth * 15) / 100
                    : scale >= 0.7 && scale < 0.8
                    ? -(rotatedWidth * 5) / 100
                    : scale >= 0.8 && scale < 0.9
                    ? -(rotatedWidth * 10) / 100
                    : -(rotatedWidth * 20) / 100)
              ).toFixed(1) + 'px',
            transform: `rotate(0.25turn) translateY(${yshift}%) scale(${scale})`,
            transformOrigin: 'top left',
            width: Number(rotatedHeight).toFixed(1) + 'px',
            position: 'absolute',
          }}
        />
      ) : (
        <Wave
          fill={theme.colors.pink}
          paused={false}
          options={{
            height: (width ?? 0) < 450 ? 220 : 250,
            amplitude: 50,
            speed: 0.5,
            points: 8,
          }}
          style={{
            height: Number(height).toFixed(1) + 'px',
            width: Number(width).toFixed(1) + 'px',
            position: 'absolute',
            top: 0,
          }}
        />
      )}
      <Flex
        sx={{
          position: 'absolute',
          flexDirection:
            !!width && !!height && width >= height ? 'row' : 'column',
          gap: 4,
          width: '100%',
          alignItems: 'center',
          height: '100%',
          padding: 30,
        }}
      >
        <Flex
          flex={!!width && !!height && width >= height ? 1 : 'unset'}
          mb={!!width && !!height && width >= height ? 0 : '120px'}
        >
          <Flex
            alignItems={'center'}
            sx={{
              gap: 2,
              flexDirection:
                !!width && !!height && width >= height ? 'row' : 'column',
            }}
          >
            <Image
              src={'/assets/logo.png'}
              width={!!width && !!height && width >= height ? 150 : 80}
              height={!!width && !!height && width >= height ? 150 : 80}
              minWidth={'auto'}
              alt="image"
            />
            <Flex flexDirection={'column'} textAlign={'center'}>
              <Text
                sx={{
                  fontSize: !!width && !!height && width >= height ? 24 : 18,
                  fontWeight: 600,
                  fontFamily: 'Castego',
                  color: theme.colors.pink,
                }}
              >
                MANILA FELINE CENTER
              </Text>
              <hr style={{ width: '100%', background: 'blue' }} />
              <Text
                sx={{
                  fontSize: !!width && !!height && width >= height ? 18 : 14,
                  fontWeight: 600,
                  fontFamily: 'Castego',
                  color: theme.colors.pink,
                }}
              >
                Care, compassion and care for cats
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {isLogin ? (
          !isReset ? (
            <Formik
              key={1}
              initialValues={{ email: '', password: '' }}
              validationSchema={FormikValidation.login}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                loginUser(values)
                  .then(async () => await refetch())
                  .catch((v) =>
                    alert(v.response.data.message || 'Invalid user')
                  )
                  .finally(() => {
                    setSubmitting(false)
                  })
              }}
            >
              {({ values, isSubmitting }) => (
                <FormContainer
                  flex={1}
                  label="Login to your Account"
                  labelProps={{ sx: { justifyContent: 'center' } }}
                  flexProps={{ sx: { gap: 20 } }}
                >
                  {isSubmitting && <Loading />}
                  <FormInput
                    name="email"
                    type={'email'}
                    placeholder="Email"
                    value={values.email}
                  />
                  <FormInput
                    name="password"
                    type={'password'}
                    placeholder="Password"
                    value={values.password}
                  />
                  <Link
                    sx={{ textAlign: 'right', cursor: 'pointer' }}
                    onClick={() => setIsReset(true)}
                  >
                    Forgot Password?
                  </Link>
                  <Button
                    style={{ width: 120, alignSelf: 'center' }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                  <Text
                    as={'h3'}
                    sx={{
                      textAlign: 'center',
                      mt: 45,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    New user?
                    <Text
                      sx={{
                        textDecoration: 'underline',
                        color: 'blue',
                        cursor: 'pointer',
                      }}
                      onClick={() => setIsLogin(false)}
                    >
                      Create your account
                    </Text>
                  </Text>
                </FormContainer>
              )}
            </Formik>
          ) : (
            <ResetPassword
              onSubmit={() => {
                setIsReset(false)
              }}
            />
          )
        ) : registered ? (
          <ValidateEmail />
        ) : (
          <Formik
            key={2}
            initialValues={{ name: '', email: '', password: '', confirm: '' }}
            onSubmit={(values, { setSubmitting }) => {
              let dataUser = { ...values, confirm: undefined }
              setSubmitting(true)
              registerUser(dataUser)
                .then(() => setRegistered(true))
                .catch((v) => {
                  alert(v.response.data.message || 'Invalid credentials')
                })
                .finally(() => {
                  setSubmitting(false)
                })
            }}
            validationSchema={FormikValidation.register}
          >
            {({ values, isSubmitting }) => (
              <FormContainer
                flex={1}
                label="Create an Account"
                labelProps={{ sx: { justifyContent: 'center' } }}
                flexProps={{ sx: { gap: 20 } }}
              >
                {isSubmitting && <Loading />}
                <FormInput
                  name="name"
                  type={'text'}
                  placeholder="Name"
                  value={values.email}
                />
                <FormInput
                  name="email"
                  type={'email'}
                  placeholder="Email"
                  value={values.email}
                />
                <FormInput
                  name="password"
                  type={'password'}
                  placeholder="Password"
                  value={values.password}
                />
                <FormInput
                  name="confirm"
                  type={'password'}
                  placeholder="Confirm Password"
                  value={values.confirm}
                />
                <Button
                  style={{ width: 120, alignSelf: 'center' }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create
                </Button>
                <Text
                  as={'h3'}
                  sx={{
                    textAlign: 'center',
                    mt: 45,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  Already have an account?{' '}
                  <Text
                    sx={{
                      textDecoration: 'underline',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </Text>
                </Text>
              </FormContainer>
            )}
          </Formik>
        )}
      </Flex>
    </Flex>
  )
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width?: number
    height?: number
  }>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
