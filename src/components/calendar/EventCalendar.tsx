import {
  memo,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react'
import { ListItem } from 'components/ul'
import { Flex, Text } from 'rebass'
import { colorFromBg, generateColor, rgbStringToHex } from 'helpers'
import { theme } from 'utils/theme'
import { Calendar as CustomCalendar } from '.'
import Holidays from 'date-holidays'
import { MobileView, WebView } from 'components/views'
import { DownArrow, SecondaryButton } from 'components/button'
import { useOnScreen } from 'hooks'

export const Event = ({
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

export const EventCalendar = memo(
  ({
    setSelectedDate,
    isOpen,
    setOpen,
    isEditable = false,
  }: {
    setSelectedDate: Dispatch<SetStateAction<Date>>
    setOpen: (v: boolean) => void
    isOpen: boolean
    isEditable?: boolean
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
          locale="en-US"
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

EventCalendar.displayName = 'Calendar'
