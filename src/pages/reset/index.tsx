import { Flex, Image, Text } from 'rebass'
import Wave from 'react-wavify'
import { theme } from 'utils/theme'

import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Button } from 'components/button'
import { FormikValidation } from 'helpers'
import { reset } from 'api'
import { Loading } from 'components/loading'
import { useRouter } from 'next/navigation'

export default function Reset({ token }: { token: string }) {
  const { replace } = useRouter()
  return (
    <Flex
      sx={{
        height: '100%',
        width: '100v%',
        padding: 18,
      }}
    >
      <Formik
        key={2}
        initialValues={{ password: '', confirm: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          try {
            await reset(token, values.password)
          } finally {
            replace('/login/')
            setSubmitting(false)
          }
        }}
        validationSchema={FormikValidation.reset}
      >
        {({ values, isSubmitting }) => (
          <FormContainer
            flex={1}
            image="/assets/surelogo.png"
            imageProps={{ height: 80, width: 80 }}
            label="Reset your password"
            labelProps={{ sx: { justifyContent: 'center' } }}
            flexProps={{ sx: { gap: 20 } }}
          >
            {isSubmitting && <Loading />}

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
              style={{ width: 180, alignSelf: 'center' }}
              type="submit"
              disabled={isSubmitting}
            >
              Reset Password
            </Button>
          </FormContainer>
        )}
      </Formik>
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

export async function getServerSideProps(context: any) {
  const token = (context.query.token ?? '') as string
  return {
    props: { token },
  }
}
