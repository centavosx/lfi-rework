import { useState, useMemo } from 'react'
import { Event, EventCalendar } from 'components/calendar'
import { Main } from 'components/main'
import { Flex, Text } from 'rebass'

import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { ButtonModal, CustomModal } from 'components/modal'

import { ListContainer, ListItem } from 'components/ul'
import { AreYouSure } from 'components/are-you-sure'
import { useUser } from 'hooks'
import { Loading, PageLoading } from 'components/loading'
import { getDailyEvents, getMonthlyEvents } from 'api'
import { useApi } from '../../hooks'
import { DisplayEvents } from 'pages/admin/calendar'
import { getAnnouncements } from 'api/announcement.api'
import { CircularProgress } from '@mui/material'

type EventProp = {
  start_date: string
  end_date: string
  name: string
  description: string
  id: string
  color: string
}

export default function User() {
  const today = new Date()
  const { user, logout } = useUser()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { data, refetch } = useApi<
    {
      day: number
      start_date: string
      name: string
      description: string
      id: string
      color: string
    }[],
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
    { data: { title: string; description: string }[]; total: number },
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

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 4,
        padding: 4,
        width: '100%',
      }}
    >
      <Flex sx={{ width: '100%', gap: 4 }}>
        <Text as={'h1'}>Welcome {user?.fname}...</Text>
        <ButtonModal
          style={{ height: 50 }}
          width={250}
          title="Logout"
          titleProps={{ as: 'h3' }}
          modalChild={({ setOpen }) => (
            <AreYouSure
              message="Are you sure?"
              onClick={(v) => {
                if (v) logout()
                setOpen(false)
              }}
            />
          )}
        >
          Logout
        </ButtonModal>
        {(isLoading || isAnnouncementLoading) && (
          <Flex flex={1} justifyContent={'flex-end'}>
            <CircularProgress size={24} style={{ alignSelf: 'center' }} />
          </Flex>
        )}
      </Flex>
      <CustomModal
        title={format(selectedDate, 'cccc LLLL d, yyyy')}
        titleProps={{ as: 'h3' }}
        maxHeight={'80%'}
        modalChild={<DisplayEvents date={selectedDate} />}
      >
        {({ isOpen, setOpen }) => (
          <Flex
            flexDirection={[
              'column-reverse',
              'column-reverse',
              'column-reverse',
              'row',
            ]}
            sx={{ gap: 4 }}
          >
            <Flex flex={0.2} flexDirection={'column'} sx={{ gap: 3 }}>
              <Flex flex={1} flexDirection={'column'}>
                <Text as={'h4'} width={'100%'}>
                  Announcements ({announcements?.data.length ?? 0})
                </Text>
                <hr style={{ width: '100%' }} />
                {!!announcements && announcements.data?.length > 0 ? (
                  <Flex
                    flexDirection={'column'}
                    sx={{ gap: 2 }}
                    mt={3}
                    overflowY={'auto'}
                  >
                    {announcements?.data.map((v, i) => (
                      <Flex key={i} flexDirection={'column'}>
                        <Text as={'h4'}>
                          {i + 1}. {v.title}
                        </Text>
                        <Text
                          ml={3}
                          sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
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
              <Flex flex={1} flexDirection={'column'}>
                <Text as={'h4'} width={'100%'}>
                  Events Today
                </Text>
                <hr style={{ width: '100%' }} />
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
