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
import {
  AdminWebView,
  DesktopView,
  MobileView,
  WebView,
} from 'components/views'
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
        {eventName} {!!from && to && `- ${from} to ${to}`}
      </Text>
      <Text fontSize={14}>{description}</Text>
    </Flex>
  </ListItem>
)

const BgFlex = memo(
  ({
    children,
    bgColor,
    ...data
  }: {
    children: (v?: string) => ReactNode
    bgColor?: string
  }) => {
    const ref = useRef<HTMLDivElement>(null)

    const isVisible = useOnScreen(ref)

    return (
      <Flex
        ref={ref}
        mt={2}
        alignItems={'center'}
        justifyContent={'center'}
        style={{ backgroundColor: bgColor ?? '#FFFFFF' }}
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

export const EventCalendar = memo(function ({
  setSelectedDate,
  isOpen,
  setOpen,
  isEditable = false,
  currentViewDate,
  data,
}: {
  setSelectedDate: Dispatch<SetStateAction<Date>>
  setOpen: (v: boolean) => void
  isOpen: boolean
  isEditable?: boolean
  currentViewDate?: (v: Date) => void
  data?: Map<
    number,
    {
      color: string
      description: string
      id: string
      name: string
      start_date: string
    }
  >
}) {
  const [mp, setMp] = useState<
    Map<
      number,
      {
        color: string
        description: string
        id: string
        name: string
        start_date: string
      }
    >
  >(new Map())

  const today = new Date()
  const [date, setDate] = useState<Date>(today)

  const holidays = new Holidays('PH')
  holidays.getHolidays(date.getFullYear())

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    currentViewDate?.(date)
  }, [date])

  useEffect(() => {
    if (!!data) setMp(data)
  }, [data])

  return (
    <Flex flex={0.8}>
      <CustomCalendar
        view="month"
        locale="en-US"
        tileContent={(v) => {
          const value = mp.get(v.date.getDate())

          const holiday = holidays.isHoliday(v.date)
          if (!!holiday && !value) {
            return (
              <WebView>
                <Text as={'h6'} mt={2} color={'red'}>
                  {holiday[0].name}
                </Text>
              </WebView>
            )
          }
          if (!value) return

          const dt = new Date(value.start_date)

          if (
            new Date(
              v.date.getFullYear(),
              v.date.getMonth(),
              v.date.getDate()
            ).getTime() !==
            new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
          )
            return

          return !isLoaded ? (
            <></>
          ) : (
            <>
              <Flex width={'100%'} flexDirection={'column'}>
                <BgFlex bgColor={value.color}>
                  {(c) => (
                    <Flex
                      flexDirection={'row'}
                      alignItems={'center'}
                      width={'100%'}
                      height={20}
                      pl={2}
                      pr={2}
                    >
                      <Flex flex={1} alignSelf={'center'}>
                        <AdminWebView>
                          <Text
                            as={'h6'}
                            width={'100%'}
                            color={c}
                            textAlign={'left'}
                            sx={{
                              display: 'inline-block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              pl: 10,
                              pr: 2,
                              textShadow: `0px 0px 3px  ${
                                c === theme.colors.white
                                  ? theme.colors.black
                                  : theme.colors.white
                              };`,
                            }}
                          >
                            {value.name}
                          </Text>
                        </AdminWebView>
                      </Flex>
                      <Flex justifyContent={'flex-end'}>
                        <DownArrow color={c} />
                      </Flex>
                    </Flex>
                  )}
                </BgFlex>
              </Flex>
            </>
          )
        }}
        onClickDay={(d) => {
          const value = mp.get(d.getDate())
          if (!value) return
          const dt = new Date(value.start_date)
          if (
            new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() !==
            new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
          )
            return
          if (!isOpen) {
            setOpen(true)
            setSelectedDate(d)
          }
        }}
        onViewChange={({ activeStartDate }) => {
          setMp(new Map())
          !!activeStartDate && setDate(activeStartDate)
        }}
        onActiveStartDateChange={({ activeStartDate }) => {
          setMp(new Map())
          !!activeStartDate && setDate(activeStartDate)
        }}
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
})

EventCalendar.displayName = 'Calendar'
