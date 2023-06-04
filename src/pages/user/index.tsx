import { useState, useEffect, memo } from 'react'
import { Calendar as CustomCalendar } from 'components/calendar'
import { Main } from 'components/main'
import { Flex, Text, Image } from 'rebass'
import Holidays from 'date-holidays'
import { startOfDay, isEqual } from 'date-fns'
import { ButtonModal, CustomModal } from 'components/modal'
import { Button, DownArrow, SecondaryButton } from 'components/button'
import { theme } from 'utils/theme'
import { MobileView, WebView } from 'components/views'
import { ListContainer, ListItem } from 'components/ul'

const AreYouSure = ({
  message,
  onClick,
}: {
  message: string
  onClick?: (v: boolean) => void
}) => {
  return (
    <Flex sx={{ gap: 2 }} flexDirection={'column'}>
      <Text as={'h5'}>{message}</Text>
      <Flex sx={{ gap: 3 }}>
        <Button onClick={() => onClick?.(true)}>Yes</Button>
        <SecondaryButton onClick={() => onClick?.(false)}>No</SecondaryButton>
      </Flex>
    </Flex>
  )
}

export default function Dashboard() {
  return (
    <Main isLink={true}>
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
          <Calendar />
        </Flex>
      </Flex>
    </Main>
  )
}

const Calendar = memo(() => {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const holidays = new Holidays('PH')
  holidays.getHolidays(date.getFullYear())

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])
  return (
    <Flex flex={0.8}>
      <CustomModal>
        {({ isOpen, setOpen }) => (
          <CustomCalendar
            view="month"
            tileContent={(v) => {
              const holiday = holidays.isHoliday(v.date)
              if (!!holiday) {
                return (
                  <WebView>
                    <Text as={'h6'} mt={2} color={'red'}>
                      {holiday[0].name}
                    </Text>
                  </WebView>
                )
              }
              return !isLoaded ? (
                <></>
              ) : (
                <>
                  <Flex width={'100%'} flexDirection={'column'}>
                    <WebView>
                      <Text
                        as={'h6'}
                        mt={2}
                        color={
                          isEqual(startOfDay(today), startOfDay(v.date))
                            ? theme.colors.white
                            : undefined
                        }
                      >
                        Current event
                      </Text>
                      <SecondaryButton
                        style={{
                          height: 8,
                          width: '50%',
                          marginTop: 4,
                          padding: 0,
                          alignSelf: 'center',
                        }}
                      >
                        <DownArrow color={theme.colors.green} />
                      </SecondaryButton>
                    </WebView>
                    <MobileView>
                      <SecondaryButton
                        style={{
                          height: 8,
                          width: 35,
                          marginTop: 4,
                          padding: 1,
                          alignSelf: 'center',
                          minWidth: 0,
                        }}
                        fullWidth={false}
                      >
                        <DownArrow color={theme.colors.green} />
                      </SecondaryButton>
                    </MobileView>
                  </Flex>
                </>
              )
            }}
            onClickDay={() => {
              if (!isOpen) setOpen(true)
            }}
            onViewChange={({ activeStartDate }) => setDate(activeStartDate)}
            onActiveStartDateChange={({ activeStartDate }) =>
              setDate(activeStartDate)
            }
            tileClassName={(v) => {
              const dateTile = v.date.getMonth()
              const isHoliday = holidays.isHoliday(v.date)

              if (isHoliday) return 'holiday'

              if (
                date.getMonth() !== dateTile ||
                (v.date < date &&
                  !(
                    v.date.getDate() === date.getDate() &&
                    v.date.getMonth() === date.getMonth() &&
                    v.date.getFullYear() === date.getFullYear()
                  ))
              ) {
                return 'before-date'
              }
              return null
            }}
          />
        )}
      </CustomModal>
    </Flex>
  )
})

Calendar.displayName = 'Calendar'
