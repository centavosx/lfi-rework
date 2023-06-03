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

export default function Reset({ token }: { token: string }) {
  const { width, height } = useWindowSize()

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
        <Formik
          key={2}
          initialValues={{ password: '', confirm: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
              await reset(token, values.password)
            } finally {
              setSubmitting(false)
            }
          }}
          validationSchema={FormikValidation.reset}
        >
          {({ values, isSubmitting }) => (
            <FormContainer
              flex={1}
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
