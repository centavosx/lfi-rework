import { useState, useEffect, useMemo, memo } from 'react'
import { EventCalendar, Event } from 'components/calendar'

import { CustomModal } from 'components/modal'
import { AreYouSure } from 'components/are-you-sure'
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
import {
  deleteAnnouncement,
  getAnnouncements,
  postAnnouncement,
} from 'api/announcement.api'
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

export const DisplayEvents = memo(
  ({ date, isAdmin }: { date: Date; isAdmin?: boolean }) => {
    const {
      data: dailies,
      isFetching,
      refetch,
    } = useApi<EventProp[], { startDate: Date; endDate: Date }>(
      getDailyEvents,
      false,
      {
        startDate: startOfDay(date),
        endDate: endOfDay(date),
      }
    )

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
                    id={events[0]?.id}
                    isAdmin={isAdmin}
                    eventName={events[0].name}
                    from={format(events[0].start_date, `LLLL d'@'hh:mm a`)}
                    to={format(events[0].end_date, `LLLL d'@'hh:mm a`)}
                    description={events[0].description}
                    onDelete={() =>
                      refetch({
                        startDate: startOfDay(date),
                        endDate: endOfDay(date),
                      })
                    }
                    start={events[0].start_date}
                    end={events[0].end_date}
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
                        id={events[0].id}
                        eventName={v.name}
                        from={start}
                        to={end}
                        isAdmin={isAdmin}
                        description={v.description}
                        onDelete={() =>
                          refetch({
                            startDate: startOfDay(date),
                            endDate: endOfDay(date),
                          })
                        }
                        start={startDate}
                        end={endDate}
                      />
                    )
                  })}
              </ListContainer>
            </Flex>
          </>
        )}
      </Flex>
    )
  }
)

DisplayEvents.displayName = 'DisplayEvents'

export default function Calendar() {
  const today = new Date()
  const { roles } = useUser()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [month, setMonth] = useState(new Date())

  const { data, refetch, isFetching } = useApi<
    (EventProp & { day: number })[],
    { startDate: Date; endDate: Date }
  >(getMonthlyEvents, false, {
    startDate: startOfMonth(month),
    endDate: endOfMonth(month),
  })

  const {
    data: dailies,
    isFetching: isLoading,
    refetch: refetchDaily,
  } = useApi<EventProp[], { startDate: Date; endDate: Date }>(
    getDailyEvents,
    false,
    {
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    }
  )

  const {
    data: announcements,
    isFetching: isAnnouncementLoading,
    refetch: refetchAnnouncement,
  } = useApi<
    {
      data: { id: string; title: string; description: string }[]
      total: number
    },
    {
      page: number
      limit: number
      other: any
    }
  >(getAnnouncements, false, {
    page: 0,
    limit: 25,
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

  const refreshItems = () => {
    refetch({
      startDate: startOfMonth(month),
      endDate: endOfMonth(month),
    })
    refetchDaily({
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    })
  }

  useEffect(() => {
    refetch({
      startDate: startOfMonth(month),
      endDate: endOfMonth(month),
    })
  }, [month])

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
        onClose={() => refreshItems()}
        title={format(selectedDate, 'cccc LLLL d, yyyy')}
        titleProps={{ as: 'h3' }}
        maxHeight={'80%'}
        modalChild={
          <DisplayEvents
            date={selectedDate}
            isAdmin={roles.isSuper || roles.isAdminWrite}
          />
        }
      >
        {({ isOpen, setOpen }) => (
          <Flex flexDirection={['column']} sx={{ gap: 4 }}>
            <Flex flex={0.2} flexDirection={'column'} sx={{ gap: 3 }}>
              <Flex flex={1} flexDirection={'column'}>
                <Flex alignItems={'center'}>
                  <Text as={'h1'}>Events</Text>

                  <Flex
                    flex={1}
                    alignSelf={'center'}
                    justifyContent={'flex-end'}
                  >
                    {isLoading || isFetching ? (
                      <CircularProgress
                        size={25}
                        style={{ justifyContent: 'flex-end' }}
                      />
                    ) : (
                      <CustomModal
                        title={format(selectedDate, 'cccc LLLL d')}
                        titleProps={{ as: 'h3' }}
                        modalChild={({ setOpen }) => (
                          <CreateEvent
                            onSuccess={() => {
                              refreshItems()
                              setOpen(false)
                            }}
                          />
                        )}
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
                </Flex>
                <hr style={{ width: '100%' }} />
                <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                  <Text as={'h2'}>Today</Text>
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
                </Flex>
                <hr style={{ width: '100%' }} />
                <Flex flexDirection={'column'} maxHeight={250}>
                  <Flex alignItems={'center'}>
                    <Text as={'h2'}>Announcements</Text>

                    <Flex
                      flex={1}
                      alignSelf={'center'}
                      justifyContent={'flex-end'}
                    >
                      {isAnnouncementLoading ? (
                        <CircularProgress
                          size={25}
                          style={{ justifyContent: 'flex-end' }}
                        />
                      ) : (
                        <CustomModal
                          title={format(selectedDate, 'cccc LLLL d')}
                          titleProps={{ as: 'h3' }}
                          maxHeight={'80%'}
                          modalChild={({ setOpen }) => (
                            <CreateAnnouncement
                              onSuccess={() => {
                                refetchAnnouncement({
                                  page: 0,
                                  limit: 25,
                                  other: {
                                    sort: 'desc',
                                  },
                                })
                                setOpen(false)
                              }}
                            />
                          )}
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
                  </Flex>
                  {!!announcements && announcements.data?.length > 0 ? (
                    <Flex
                      flexDirection={'column'}
                      sx={{ gap: 2 }}
                      mt={3}
                      overflowY={'auto'}
                    >
                      {announcements?.data.map((v, i) => (
                        <Flex key={v.id} flexDirection={'column'}>
                          <Flex flexDirection={'row'}>
                            <Text as={'h4'} flex={0.98}>
                              {i + 1}. {v.title}
                            </Text>

                            <CustomModal
                              width={250}
                              modalChild={
                                <AreYouSure
                                  message="Are you sure you want to delete?"
                                  onClick={(ch) =>
                                    !!ch &&
                                    deleteAnnouncement(v.id).finally(() =>
                                      refetchAnnouncement({
                                        page: 0,
                                        limit: 25,
                                        other: {
                                          sort: 'desc',
                                        },
                                      })
                                    )
                                  }
                                />
                              }
                            >
                              {({ setOpen }) => (
                                <Text
                                  color={'red'}
                                  sx={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setOpen(true)
                                  }}
                                >
                                  Delete
                                </Text>
                              )}
                            </CustomModal>
                          </Flex>
                          <Text
                            ml={3}
                            sx={{
                              wordBreak: 'break-all',
                              whiteSpace: 'normal',
                            }}
                          >
                            {v.description}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  ) : (
                    <Text as={'h3'} fontWeight={400} mt={3}>
                      No Announcements
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Flex>
            <EventCalendar
              setSelectedDate={setSelectedDate}
              setOpen={setOpen}
              isOpen={isOpen}
              data={mappedValues}
              currentViewDate={(v) => {
                setMonth(v)
              }}
            />
          </Flex>
        )}
      </CustomModal>
    </Flex>
  )
}

export const CreateAnnouncement = memo(
  ({ onSuccess }: { onSuccess?: () => void }) => {
    const { isFetching, isSuccess, callApi } = useApiPost(postAnnouncement)

    useEffect(() => {
      if (!!isSuccess) onSuccess?.()
    }, [isSuccess])

    return (
      <Formik<{ title: string; description: string }>
        initialValues={{
          title: '',
          description: '',
        }}
        validationSchema={FormikValidation.createAnnouncement}
        validateOnMount={true}
        onSubmit={(v, { setSubmitting }) => {
          setSubmitting(true)
          callApi(v)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, values }) => (
          <FormContainer marginTop={20} flexProps={{ sx: { gap: 3 } }}>
            {isSubmitting && <Loading />}
            {isFetching ? (
              <CircularProgress style={{ margin: 'auto' }} />
            ) : (
              <>
                <FormInput
                  name="title"
                  label="Title"
                  placeholder="Type event name"
                />
                <FormInput
                  name="description"
                  label="Description"
                  placeholder="Type description"
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

                <Button type="submit" style={{ width: 150 }}>
                  Submit
                </Button>
              </>
            )}
          </FormContainer>
        )}
      </Formik>
    )
  }
)

CreateAnnouncement.displayName = 'CreateAnnoiuncement'
