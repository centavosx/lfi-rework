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
import { useUser } from 'hooks'
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
} from 'constant'
import { Firebase } from 'firebaseapp'
import { StorageError, TaskState } from 'firebase/storage'

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

export default function Login() {
  const { refetch } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [isReset, setIsReset] = useState(false)

  let rotatedWidth = 0,
    rotatedHeight = 0,
    scale = 0,
    yshift = 0

  return (
    <Main isLink={true}>
      <Flex sx={{ flexDirection: 'column', gap: 4, padding: 4 }}>
        <Formik<RegFormType>
          key={1}
          initialValues={{ fname: '', lname: '', email: '', address: '' }}
          validationSchema={FormikValidation.register}
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
          {({ values, isSubmitting, setFieldValue, errors }) => (
            <FormContainer
              flex={1}
              label={`Sign up for scholar`}
              // image="/assets/logo.png"
              // imageProps={{ height: 100, width: 100, margin: 'none' }}
              labelProps={{ sx: { justifyContent: 'left' } }}
              flexProps={{ sx: { gap: 20, mb: 30 } }}
            >
              {isSubmitting && <Loading />}

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
              <Flex flexWrap={'wrap'} flexDirection={'column'} sx={{ gap: 2 }}>
                {DISPLAY_FILES.map((v) => (
                  <UploadProcess
                    name={v.name}
                    key={v.name}
                    title={v.title}
                    textProps={{
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    errorString={errors[v.name as keyof typeof errors]}
                    width={150}
                    onChange={(link) => setFieldValue(v.name, link)}
                  />
                ))}
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
      </Flex>
    </Main>
  )
}
