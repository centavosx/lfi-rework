import {
  useState,
  useEffect,
  memo,
  SetStateAction,
  Dispatch,
  useRef,
  ReactNode,
  RefObject,
  useMemo,
} from 'react'
import { Calendar as CustomCalendar } from 'components/calendar'
import { Main } from 'components/main'
import { Flex, Text, Image, FlexProps } from 'rebass'
import Holidays from 'date-holidays'
import { startOfDay, isEqual, format } from 'date-fns'
import { ButtonModal, CustomModal } from 'components/modal'
import { Button, DownArrow, SecondaryButton } from 'components/button'
import { theme } from 'utils/theme'
import { MobileView, WebView } from 'components/views'
import { ListContainer, ListItem } from 'components/ul'
import { colorFromBg, generateColor, rgbStringToHex } from 'helpers'
import { useOnScreen } from 'hooks'

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
  const [selectedDate, setSelectedDate] = useState(new Date())

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
              <Calendar
                setSelectedDate={setSelectedDate}
                setOpen={setOpen}
                isOpen={isOpen}
              />
            </Flex>
          )}
        </CustomModal>
      </Flex>
    </Main>
  )
}

const Event = ({
  eventName,
  from,
  to,
  description,
}: {
  eventName: string
  from: string
  to: string
  description: string
}) => (
  <ListItem style={{ marginLeft: '-15px' }}>
    <Flex flexDirection={'column'} sx={{ gap: 1 }}>
      <Text as={'h4'}>
        {eventName} {!!from && to && `@ ${from} to ${to}`}
      </Text>
      <Text fontSize={14}>{description}</Text>
    </Flex>
  </ListItem>
)

const BgFlex = memo(
  ({ children, ...data }: { children: (v?: string) => ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null)

    const isVisible = useOnScreen(ref)

    return (
      <Flex
        ref={ref}
        mt={2}
        alignItems={'center'}
        justifyContent={'center'}
        style={{ backgroundColor: generateColor() }}
        sx={{ borderRadius: 8 }}
        {...data}
      >
        {isVisible &&
          !!ref.current?.style &&
          children(
            colorFromBg(
              rgbStringToHex(ref.current?.style.backgroundColor),
              theme.colors.white,
              theme.colors.black
            )
          )}
      </Flex>
    )
  }
)

BgFlex.displayName = 'BgFlex'

const Calendar = memo(
  ({
    setSelectedDate,
    isOpen,
    setOpen,
  }: {
    setSelectedDate: Dispatch<SetStateAction<Date>>
    setOpen: (v: boolean) => void
    isOpen: boolean
  }) => {
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
                    <BgFlex>
                      {(c) => (
                        <Text
                          as={'h6'}
                          color={c}
                          sx={{
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: 8,
                            width: 250,
                            pl: 10,
                            pr: 10,
                            textShadow: `0px 0px 3px  ${
                              c === theme.colors.white
                                ? theme.colors.black
                                : theme.colors.white
                            };`,
                          }}
                        >
                          Current event
                        </Text>
                      )}
                    </BgFlex>
                    <SecondaryButton
                      style={{
                        height: 8,
                        width: '50%',
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
          onClickDay={(d) => {
            if (!isOpen) {
              setOpen(true)
              setSelectedDate(d)
            }
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
      </Flex>
    )
  }
)

Calendar.displayName = 'Calendar'
