import { useState, useEffect } from 'react'
import { Button } from 'components/button'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Loading } from 'components/loading'
import { Main } from 'components/main'
import { Formik } from 'formik'
import { FormikValidation } from 'helpers'
import { Flex, Image, Link, Text } from 'rebass'
import { useRouter } from 'next/router'

const ResetPassword = ({ onSubmit }: { onSubmit?: () => void }) => {
  return (
    <Formik
      key={4}
      initialValues={{ email: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        // resetPass(values.email)
        //   .then(() => {
        //     alert('Reset password link has been sent.')
        //     onSubmit?.()
        //   })
        //   .finally(() => {
        //     setSubmitting(false)
        //   })
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

type User = 'Scholar' | 'Employee'

export default function Register({ who = 'Scholar' }: { who?: User }) {
  const [whoUser, setWhoUser] = useState<User>(who)
  const { asPath } = useRouter()
  const [isReset, setIsReset] = useState(false)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search)
    const whoUser = param.get('who')

    setWhoUser(
      whoUser === 'Scholar' || whoUser === 'Employee' ? whoUser : 'Scholar'
    )
  }, [asPath])

  return (
    <Main isLink={true}>
      <Flex sx={{ flexDirection: ['column', 'column', 'row'], gap: 4 }}>
        <Flex flex={1}>
          <Image
            src={'/assets/lao1.PNG'}
            margin={'auto'}
            minWidth={'auto'}
            alt="image"
          />
        </Flex>
        <Flex
          flex={1}
          sx={{
            width: '100%',
            height: ['auto', 'auto', '100vh'],
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          {!isReset ? (
            <Formik
              key={1}
              initialValues={{ email: '', password: '' }}
              validationSchema={FormikValidation.login}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                // loginUser(values)
                //   .then(async () => await refetch())
                //   .catch((v) => alert(v.response.data.message || 'Invalid user'))
                //   .finally(() => {
                //     setSubmitting(false)
                //   })
              }}
            >
              {({ values, isSubmitting }) => (
                <FormContainer
                  flex={1}
                  label={`Login as ${whoUser}`}
                  image="/assets/logo.png"
                  imageProps={{ height: 100, width: 100 }}
                  labelProps={{ sx: { justifyContent: 'center' } }}
                  flexProps={{ sx: { gap: 20, mb: 30 } }}
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
                </FormContainer>
              )}
            </Formik>
          ) : (
            <ResetPassword
              onSubmit={() => {
                setIsReset(false)
              }}
            />
          )}
        </Flex>
      </Flex>
    </Main>
  )
}

export async function getServerSideProps(context: any) {
  let who = (context.query.who ?? '') as User

  if (who !== 'Scholar' && who !== 'Employee') who = 'Scholar'

  return {
    props: { who },
  }
}
