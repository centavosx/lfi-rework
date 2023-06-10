import { useState } from 'react'
import { Event, EventCalendar } from 'components/calendar'
import { Main } from 'components/main'
import { Flex, Text } from 'rebass'

import { format } from 'date-fns'
import { ButtonModal, CustomModal } from 'components/modal'

import { ListContainer, ListItem } from 'components/ul'
import { AreYouSure } from 'components/are-you-sure'
import { useUser } from 'hooks'
import { Loading, PageLoading } from 'components/loading'

export default function User() {
  const [selectedDate, setSelectedDate] = useState(new Date())

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
        <Text as={'h1'}>Welcome Vincent...</Text>
        <ButtonModal
          style={{ height: 50 }}
          width={250}
          title="Logout"
          titleProps={{ as: 'h3' }}
          modalChild={<AreYouSure message="Are you sure?" />}
        >
          Logout
        </ButtonModal>
      </Flex>
      <CustomModal
        title={format(selectedDate, 'cccc LLLL d, yyyy hh:mm a')}
        titleProps={{ as: 'h3' }}
        maxHeight={'80%'}
        modalChild={
          <Flex flexDirection={'column'} sx={{ gap: 4, mt: 3 }}>
            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Text as={'h4'} fontWeight={600}>
                Earliest Event
              </Text>
              <ListContainer>
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
              </ListContainer>
            </Flex>
            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Text as={'h4'}>Next Events</Text>
              <ListContainer>
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
              </ListContainer>
            </Flex>
          </Flex>
        }
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
                  Announcements
                </Text>
                <hr style={{ width: '100%' }} />
                <Text>dwadwad dawd awdad </Text>
              </Flex>
              <Flex flex={1} flexDirection={'column'}>
                <Text as={'h4'} width={'100%'}>
                  Events Today
                </Text>
                <hr style={{ width: '100%' }} />
                <ListContainer>
                  <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
                  <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
                </ListContainer>
              </Flex>
            </Flex>
            <EventCalendar
              setSelectedDate={setSelectedDate}
              setOpen={setOpen}
              isOpen={isOpen}
            />
          </Flex>
        )}
      </CustomModal>
    </Flex>
  )
}
