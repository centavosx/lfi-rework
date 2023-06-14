import { useState, useEffect, useMemo, memo } from 'react'
import { EventCalendar, Event } from 'components/calendar'
import { AdminMain } from 'components/main'
import { ButtonModal, CustomModal } from 'components/modal'
import { ListContainer, ListItem } from 'components/ul'
import {
  endOfDay,
  endOfMonth,
  format,
  startOfMonth,
  startOfDay,
} from 'date-fns'
import { Flex, Text } from 'rebass'

import { AiFillPlusCircle } from 'react-icons/ai'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Formik } from 'formik'
import { StartAndEnd } from 'components/dates/StartAndEnd'
import { Button } from 'components/button'
import { FormikValidation } from 'helpers'
import { theme } from 'utils/theme'
import { EventDto } from 'constant'
import { useApi, useApiPost, useUser } from 'hooks'
import { getDailyEvents, getMonthlyEvents, postEvent } from 'api'
import { Loading } from 'components/loading'
import { getAnnouncements } from 'api/announcement.api'
import { CircularProgress } from '@mui/material'

const CreateEvent = memo(({ onSuccess }: { onSuccess?: () => void }) => {
  const { isFetching, isSuccess, callApi } = useApiPost(postEvent)

  useEffect(() => {
    if (!!isSuccess) onSuccess?.()
  }, [isSuccess])

  return (
    <Formik<EventDto<number>>
      initialValues={{
        name: '',
        description: '',
        startDate: 0,
        endDate: 0,
      }}
      validationSchema={FormikValidation.createEvent}
      validateOnMount={true}
      onSubmit={(v, { setSubmitting }) => {
        setSubmitting(true)

        const start = new Date(v.startDate)
        const end = new Date(v.endDate)

        callApi({ ...v, startDate: start, endDate: end })
        setSubmitting(false)
      }}
    >
      {({ setFieldValue, isSubmitting }) => (
        <FormContainer marginTop={20} flexProps={{ sx: { gap: 3 } }}>
          {isSubmitting && <Loading />}
          {isFetching ? (
            <CircularProgress style={{ margin: 'auto' }} />
          ) : (
            <>
              <FormInput
                name="name"
                label="Event Name"
                placeholder="Type event name"
              />
              <FormInput
                name="description"
                label="Event Description"
                placeholder="Type event description"
                multiline={true}
                variant="outlined"
                inputcolor={{
                  labelColor: 'gray',
                  backgroundColor: 'white',
                  borderBottomColor: theme.mainColors.first,

                  color: 'black',
                }}
                maxRows={7}
                padding={20}
                paddingBottom={14}
                sx={{ color: 'black', width: '100%' }}
              />
              <StartAndEnd
                onChangeDate={(d) => {
                  setFieldValue('startDate', d.start.getTime())
                  setFieldValue('endDate', d.end.getTime())
                }}
              />
              <Button type="submit" style={{ width: 150 }}>
                Submit
              </Button>
            </>
          )}
        </FormContainer>
      )}
    </Formik>
  )
})

CreateEvent.displayName = 'CreateEvent'

type EventProp = {
  start_date: string
  end_date: string
  name: string
  description: string
  id: string
  color: string
}

export const DisplayEvents = memo(({ date }: { date: Date }) => {
  const { data: dailies, isFetching } = useApi<
    EventProp[],
    { startDate: Date; endDate: Date }
  >(getDailyEvents, false, {
    startDate: startOfDay(date),
    endDate: endOfDay(date),
  })

  const events = useMemo(() => {
    if (!dailies) return []

    return dailies
      .map((v) => {
        const fDate = new Date(v.start_date)
        const eDate = new Date(v.end_date)
        return { ...v, start_date: fDate, end_date: eDate }
      })
      .sort((a, b) => {
        const fDate = a.start_date.getTime()
        const sDate = b.start_date.getTime()
        return fDate - sDate
      })
  }, [dailies])

  return (
    <Flex flexDirection={'column'} sx={{ gap: 4, mt: 3 }}>
      {isFetching ? (
        <CircularProgress style={{ margin: 'auto' }} />
      ) : (
        <>
          <Flex flexDirection={'column'} sx={{ gap: 2 }}>
            <Text as={'h4'}>Earliest Event</Text>
            <ListContainer>
              {events.length > 0 ? (
                <Event
                  eventName={events[0].name}
                  from={format(events[0].start_date, `LLLL d'@'hh:mm a`)}
                  to={format(events[0].end_date, `LLLL d'@'hh:mm a`)}
                  description={events[0].description}
                />
              ) : (
                <Text as={'h4'}>{'No items'}</Text>
              )}
            </ListContainer>
          </Flex>
          <Flex flexDirection={'column'} sx={{ gap: 2 }}>
            <Text as={'h4'}>Next Events</Text>
            <ListContainer>
              {events
                .filter((_, i) => i > 0)
                .map((v) => {
                  const startDate = new Date(v.start_date)
                  const endDate = new Date(v.end_date)

                  const start = format(startDate, `LLLL d'@'hh:mm a`)
                  const end = format(endDate, `LLLL d'@'hh:mm a`)
                  return (
                    <Event
                      key={v.id}
                      eventName={v.name}
                      from={start}
                      to={end}
                      description={v.description}
                    />
                  )
                })}
            </ListContainer>
          </Flex>
        </>
      )}
    </Flex>
  )
})

DisplayEvents.displayName = 'DisplayEvents'

export default function Calendar() {
  const today = new Date()
  const { roles } = useUser()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { data, refetch, isFetching } = useApi<
    (EventProp & { day: number })[],
    { startDate: Date; endDate: Date }
  >(getMonthlyEvents, true)

  const { data: dailies, isFetching: isLoading } = useApi<
    EventProp[],
    { startDate: Date; endDate: Date }
  >(getDailyEvents, false, {
    startDate: startOfDay(today),
    endDate: endOfDay(today),
  })

  const { data: announcements, isFetching: isAnnouncementLoading } = useApi<
    { data: { name: string; description: string }[]; total: number },
    {
      page: number
      limit: number
      other: any
    }
  >(getAnnouncements, false, {
    page: 0,
    limit: 5,
    other: {
      sort: 'desc',
    },
  })

  const mappedValues = useMemo(() => {
    const mv = new Map<
      number,
      {
        start_date: string
        name: string
        description: string
        id: string
        color: string
      }
    >()
    if (!data) return mv

    data.forEach((v) => {
      mv.set(v.day, {
        color: v.color,
        description: v.description,
        id: v.id,
        name: v.name,
        start_date: v.start_date,
      })
    })

    return mv
  }, [data])

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 4,
        padding: 4,
        width: '100%',
      }}
    >
      <CustomModal
        title={format(selectedDate, 'cccc LLLL d, yyyy')}
        titleProps={{ as: 'h3' }}
        maxHeight={'80%'}
        modalChild={<DisplayEvents date={selectedDate} />}
      >
        {({ isOpen, setOpen }) => (
          <Flex flexDirection={['column']} sx={{ gap: 4 }}>
            <Flex flex={0.2} flexDirection={'column'} sx={{ gap: 3 }}>
              <Flex flex={1} flexDirection={'column'}>
                <Flex alignItems={'center'}>
                  <Text as={'h1'} width={'100%'}>
                    Events
                  </Text>
                  {isLoading || isAnnouncementLoading ? (
                    <Flex flex={1} justifyContent={'flex-end'}>
                      <CircularProgress
                        size={24}
                        style={{ alignSelf: 'center' }}
                      />
                    </Flex>
                  ) : (
                    <CustomModal
                      title={format(selectedDate, 'cccc LLLL d')}
                      titleProps={{ as: 'h3' }}
                      maxHeight={'80%'}
                      modalChild={<CreateEvent />}
                    >
                      {({ setOpen: setO }) =>
                        (roles.isAdminWrite || roles.isSuper) && (
                          <AiFillPlusCircle
                            size={24}
                            cursor={'pointer'}
                            onClick={() => setO(true)}
                          />
                        )
                      }
                    </CustomModal>
                  )}
                </Flex>
                <hr style={{ width: '100%' }} />
                <Flex sx={{ gap: 2 }} alignItems={'center'}>
                  <Text as={'h3'}>Today</Text>
                  <Button
                    onClick={() => {
                      setSelectedDate(today)
                      setOpen(true)
                    }}
                  >
                    View
                  </Button>
                </Flex>
                {!!dailies && dailies?.length > 0 ? (
                  <ListContainer>
                    {dailies?.map((v) => {
                      const startDate = new Date(v.start_date)
                      const endDate = new Date(v.end_date)

                      const start = format(startDate, `LLLL d'@'hh:mm a`)
                      const end = format(endDate, `LLLL d'@'hh:mm a`)
                      return (
                        <ListItem
                          style={{ marginLeft: '-15px', color: 'black' }}
                          key={v.id}
                        >
                          {v.name} -{' '}
                          <span style={{ fontWeight: 500 }}>
                            {start} to {end}
                          </span>
                        </ListItem>
                      )
                    })}
                  </ListContainer>
                ) : (
                  <Text as={'h3'} fontWeight={400} mt={3}>
                    No Events Today
                  </Text>
                )}
                <hr style={{ width: '100%' }} />
                <Flex sx={{ gap: 2 }} mt={2} alignItems={'center'}>
                  <Text as={'h3'}>Announcements</Text>
                  <Button
                    onClick={() => {
                      setSelectedDate(today)
                      setOpen(true)
                    }}
                  >
                    View All
                  </Button>
                </Flex>
                {announcements?.data.map((v, i) => (
                  <Text key={i}>{v.name}</Text>
                ))}
              </Flex>
            </Flex>
            <EventCalendar
              setSelectedDate={setSelectedDate}
              setOpen={setOpen}
              isOpen={isOpen}
              data={mappedValues}
              currentViewDate={(v) => {
                refetch({
                  startDate: startOfMonth(v),
                  endDate: endOfMonth(v),
                })
              }}
            />
          </Flex>
        )}
      </CustomModal>
    </Flex>
  )
}
