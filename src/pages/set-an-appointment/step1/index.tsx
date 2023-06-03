import { Flex } from 'rebass'

import { ReactNode, useEffect, useCallback, useMemo } from 'react'
import 'react-calendar/dist/Calendar.css'
import { Main } from '../../../components/main'
import { Calendar } from '../../../components/calendar'
import { useRouter } from 'next/router'
import { Section } from '../../../components/sections'
import { theme as colorTheme } from '../../../utils/theme'
import { Text } from '../../../components/text'
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { Option, Select } from '../../../components/select'
import { useState } from 'react'
import { useApi, useUser } from 'hooks'
import {
  AmOrPm,
  CreateAppointmentDto,
  getAllService,
  getUnavailableAppointment,
  refreshAppointment,
  saveAppoinment,
  SearchDoctorDto,
  verifyAppointment,
  VerifyAppointmentDto,
} from 'api'
import { Services as Service } from 'entities'
import { FormContainer } from 'components/forms'
import { Formik } from 'formik'
import { Loading } from 'components/loading'
import { FormInput, InputError } from 'components/input'
import { Label } from '@rebass/forms'
import { FormikValidation } from 'helpers'
import { Button } from 'components/button'

const Services = ({
  onChange,
  value,
}: {
  onChange: (v: string) => void
  value?: string
}) => {
  const { data } = useApi(async () => await getAllService())

  const services: Service[] = data?.data ?? []
  const result = services.find((d) => d.id === value)
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      isSearchable={true}
      name="color"
      value={
        !!result
          ? {
              label: result.name,
              value: result.id,
            }
          : undefined
      }
      options={[...services.map((d) => ({ label: d.name, value: d.id }))]}
      controlStyle={{
        padding: 8,
        borderColor: 'black',
        backgroundColor: 'white',
      }}
      onChange={(v) => onChange((v as Option).value)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: colorTheme.colors.lightpink,
          primary: colorTheme.colors.darkpink,
        },
      })}
    />
  )
}

const ValidateEmail = ({ appointmentId }: { appointmentId: string }) => {
  const [error, setError] = useState('')
  const { push } = useRouter()
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
    refreshAppointment(appointmentId)
      .then(() => setTime(180))
      .finally(() => setIsSubmitRefresh(false))
  }, [setTime, appointmentId, setIsSubmitRefresh])

  return (
    <Formik<VerifyAppointmentDto>
      initialValues={{
        verification: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        if (time > 0)
          return verifyAppointment(appointmentId, values)
            .then((v) => {
              push(v.data)
            })
            .catch((d) => {
              setError(
                d?.request?.status === 400
                  ? 'Invalid Code'
                  : 'An error has occured'
              )
            })
            .finally(() => setSubmitting(false))
        setSubmitting(false)
        return setError(
          'Your verification code is now expired, please resend new verification code.'
        )
      }}
      validationSchema={FormikValidation.verify}
    >
      {({ isSubmitting }) => (
        <FormContainer
          flexProps={{
            sx: { gap: 18 },
            justifyContent: 'center',
          }}
          label="Please verify"
          labelProps={{
            width: '100%',
            fontSize: 20,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {(isSubmitting || isSubmitRefresh) && <Loading />}
          <Flex sx={{ flexDirection: 'column', gap: 2, width: '100%' }}>
            <FormInput
              name="verification"
              label={'Verification Code'}
              variant="outlined"
              inputcolor={{
                labelColor: 'gray',
                backgroundColor: 'white',
                borderBottomColor: colorTheme.mainColors.first,
                color: 'black',
              }}
              sx={{ color: 'black', width: '100%' }}
              placeholder="Please type verification code"
            />
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

type Response = {
  date: string
}[]

export default function Step1() {
  const today = new Date()
  const { user: userData } = useUser()
  const [date, setDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  )
  const [currentViewDate, setCurrentViewDate] = useState(date)
  const { isFetching, data, refetch } = useApi<
    Response,
    { month: number; year: number }
  >(getUnavailableAppointment, false, {
    month: date.getMonth(),
    year: date.getFullYear(),
  })

  const [appointmentId, setAppointmentId] = useState<string>()

  useEffect(() => {
    refetch({
      month: currentViewDate.getMonth(),
      year: currentViewDate.getFullYear(),
    })
  }, [currentViewDate])

  const availableDates = useMemo(() => {
    const start = startOfMonth(currentViewDate)
    const end = endOfMonth(currentViewDate)

    const parsedDate = data?.map((v) => v.date) ?? []

    const dates: string[][] = []

    while (start < end) {
      const startDay = startOfDay(start)
      const endDay = endOfDay(start)
      const time: string[] = []
      while (startDay < endDay) {
        const timeFormat = format(startDay, 'yyyy-MM-dd HH')
        if (!parsedDate.includes(timeFormat)) {
          time.push(format(startDay, "hh:mm aaaaa'm'"))
        }
        startDay.setHours(startDay.getHours() + 1)
      }
      dates.push(time)
      start.setDate(start.getDate() + 1)
    }

    return dates
  }, [data, currentViewDate])

  const currentDateTime = availableDates[date.getDate() - 1]

  const timeLabelAndValue = currentDateTime.map((v, i) => ({
    label: v,
    value: v.split(':')[0],
  }))

  return (
    <Main isLink={true}>
      <Flex flexDirection={'column'} flex={1} width={'100%'}>
        <Section
          title="Set An Appointment"
          contentProps={{
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'start',
          }}
          textProps={{
            backgroundColor: colorTheme.colors.blackgray,
            width: '100%',
            padding: 3,
            textAlign: 'center',
            color: 'white',
          }}
          isFetching={isFetching}
        >
          <Calendar
            minDate={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1
              )
            }
            value={date}
            onChange={setDate}
            onViewChange={({ activeStartDate }) =>
              setCurrentViewDate(activeStartDate)
            }
            onActiveStartDateChange={({ activeStartDate }) =>
              setCurrentViewDate(activeStartDate)
            }
            tileDisabled={(p) => {
              return availableDates[p.date.getDate() - 1]?.length === 0
            }}
          />
          <Flex
            width={'100%'}
            sx={{
              backgroundColor: colorTheme.colors.black,
              borderRadius: 5,
              border: '0.5px solid gray',
            }}
            flexDirection={'column'}
          >
            {!!date && (
              <Text
                sx={{
                  color: colorTheme.colors.white,
                  fontSize: 18,
                  fontWeight: 'bold',
                  width: '100%',
                  position: 'relative',
                  padding: 2,
                }}
              >
                {format(date, 'cccc LLLL d, yyyy')}
              </Text>
            )}
            <Flex
              width={'100%'}
              sx={{
                backgroundColor: 'white',
                padding: 12,
                gap: 10,
              }}
              flexDirection={'column'}
            >
              {!!userData && currentDateTime?.length > 0 ? (
                <Formik<CreateAppointmentDto>
                  initialValues={{
                    serviceId: '',
                    date: new Date(date),
                    email: userData?.email ?? '',
                    name: userData?.name ?? '',

                    message: '',
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    let copy: CreateAppointmentDto<string> = structuredClone({
                      ...values,
                      time: !!values.time
                        ? values.time >= 12
                          ? AmOrPm.PM
                          : AmOrPm.AM
                        : '',
                    })
                    copy.birthDate = copy.birthDate
                      ? new Date(copy?.birthDate).toDateString()
                      : undefined
                    copy.age = Number(copy.age)
                    if (values.time) copy.date.setHours(values.time)

                    saveAppoinment(copy)
                      .then((d) => setAppointmentId(d.data.id))
                      .finally(() => setSubmitting(false))
                  }}
                  validationSchema={FormikValidation.createAppointment}
                >
                  {({
                    handleChange,
                    values,
                    errors,
                    isSubmitting,
                    setFieldValue,
                  }) => (
                    <FormContainer
                      flexProps={{
                        sx: { gap: 18 },
                        justifyContent: 'center',
                      }}
                      label="Please fill up the form"
                      labelProps={{
                        width: '100%',
                        fontSize: 20,
                        fontWeight: 600,
                        mb: 10,
                      }}
                    >
                      {isSubmitting && <Loading />}
                      <FormInput
                        name="name"
                        label={'Full name'}
                        variant="outlined"
                        inputcolor={{
                          labelColor: 'gray',
                          backgroundColor: 'white',
                          borderBottomColor: colorTheme.mainColors.first,
                          color: 'black',
                        }}
                        sx={{ color: 'black', width: '100%' }}
                        placeholder="Please type your full name"
                        disabled={true}
                      />
                      <FormInput
                        name="email"
                        type={'email'}
                        label={'Email'}
                        variant="outlined"
                        inputcolor={{
                          labelColor: 'gray',
                          backgroundColor: 'white',
                          borderBottomColor: colorTheme.mainColors.first,
                          color: 'black',
                        }}
                        sx={{ color: 'black', width: '100%' }}
                        placeholder="Please type your email"
                        disabled={true}
                      />
                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        <Label sx={{ fontWeight: 600 }}>
                          Please select time
                        </Label>
                        <InputError error={errors.time} />
                      </Flex>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="time"
                        options={timeLabelAndValue}
                        value={timeLabelAndValue.find(
                          (v) => Number(v.value) === values?.time
                        )}
                        controlStyle={{
                          padding: 8,
                          borderColor: 'black',
                          backgroundColor: 'white',
                        }}
                        onChange={(v) =>
                          setFieldValue('time', Number((v as any).value))
                        }
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: colorTheme.colors.lightpink,
                            primary: colorTheme.colors.darkpink,
                          },
                        })}
                        placeholder="Select Time"
                      />

                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        <Label sx={{ fontWeight: 600 }}>
                          Please select service
                        </Label>
                        <InputError error={errors.serviceId} />
                      </Flex>
                      <Services
                        value={values.serviceId}
                        onChange={handleChange('serviceId')}
                      />
                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        <Label sx={{ fontWeight: 800, fontSize: 20 }}>
                          Pet Information
                        </Label>
                      </Flex>
                      <FormInput
                        name="petName"
                        label={'Pet name'}
                        variant="outlined"
                        inputcolor={{
                          labelColor: 'gray',
                          backgroundColor: 'white',
                          borderBottomColor: colorTheme.mainColors.first,
                          color: 'black',
                        }}
                        sx={{ color: 'black', width: '100%' }}
                        placeholder="Please type your pet name"
                      />
                      <FormInput
                        name="age"
                        label={'Age'}
                        type="number"
                        variant="outlined"
                        inputcolor={{
                          labelColor: 'gray',
                          backgroundColor: 'white',
                          borderBottomColor: colorTheme.mainColors.first,
                          color: 'black',
                        }}
                        sx={{ color: 'black', width: '100%' }}
                        placeholder="Please type your pet age"
                      />
                      <Flex flexDirection={'column'} sx={{ gap: 1 }}>
                        <Label sx={{ fontWeight: 500 }}>Birthday</Label>
                        <FormInput
                          name="birthDate"
                          label={''}
                          variant="outlined"
                          type={'date'}
                          inputcolor={{
                            labelColor: 'gray',
                            backgroundColor: 'white',
                            borderBottomColor: colorTheme.mainColors.first,
                            color: 'black',
                          }}
                          sx={{ color: 'black', width: '100%' }}
                          placeholder="Please type your pet birthday"
                        />
                      </Flex>
                      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                        <Select
                          isSearchable={true}
                          name="gender"
                          options={[
                            {
                              label: 'Male',
                              value: 'MALE',
                            },
                            {
                              label: 'Female',
                              value: 'FEMALE',
                            },
                          ]}
                          controlStyle={{
                            padding: 8,
                            borderColor: 'black',
                            backgroundColor: 'white',
                          }}
                          value={
                            !!values.gender
                              ? [
                                  {
                                    label: 'Male',
                                    value: 'MALE',
                                  },
                                  {
                                    label: 'Female',
                                    value: 'FEMALE',
                                  },
                                ].find((v) => v.value === values.gender)!
                              : undefined
                          }
                          onChange={(v) =>
                            handleChange('gender')((v as any).value)
                          }
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: colorTheme.colors.lightpink,
                              primary: colorTheme.colors.darkpink,
                            },
                          })}
                          placeholder="Select Gender"
                        />
                        <InputError error={errors.gender} />
                      </Flex>
                      <FormInput
                        name="message"
                        label={'Message'}
                        multiline={true}
                        variant="outlined"
                        inputcolor={{
                          labelColor: 'gray',
                          backgroundColor: 'white',
                          borderBottomColor: colorTheme.mainColors.first,
                          color: 'black',
                        }}
                        minRows={12}
                        maxRows={12}
                        padding={20}
                        sx={{ color: 'black', width: '100%', mt: 2 }}
                      />
                      {!appointmentId && (
                        <Button
                          type="submit"
                          fullWidth={false}
                          style={{ width: 120, alignSelf: 'flex-end' }}
                          disabled={isSubmitting}
                        >
                          Submit
                        </Button>
                      )}
                    </FormContainer>
                  )}
                </Formik>
              ) : (
                <Text>Not available</Text>
              )}
              {!!appointmentId && (
                <ValidateEmail appointmentId={appointmentId} />
              )}
            </Flex>
          </Flex>
        </Section>
      </Flex>
    </Main>
  )
}
