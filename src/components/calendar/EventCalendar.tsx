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
import {
  FormikValidation,
  colorFromBg,
  generateColor,
  rgbStringToHex,
} from 'helpers'
import { theme } from 'utils/theme'
import { Calendar as CustomCalendar } from '.'
import Holidays from 'date-holidays'
import {
  AdminWebView,
  DesktopView,
  MobileView,
  WebView,
} from 'components/views'
import { Button, DownArrow, SecondaryButton } from 'components/button'
import { useApiPost, useOnScreen } from 'hooks'
import { deleteEvent, patchEvent } from 'api'
import { StartAndEnd } from 'components/dates/StartAndEnd'
import { FormInput } from 'components/input'
import { CircularProgress } from '@mui/material'
import { Formik } from 'formik'
import { EventDto } from 'constant'
import { FormContainer } from 'components/forms'
import { Loading } from 'components/loading'
import { CustomModal } from 'components/modal'

const UpdateEvent = memo(
  ({
    id,
    values,
    onSuccess,
  }: {
    id: string
    values: EventDto<number>
    onSuccess?: () => void
  }) => {
    const { isFetching, isSuccess, callApi } = useApiPost(patchEvent)

    useEffect(() => {
      if (!!isSuccess) onSuccess?.()
    }, [isSuccess])

    return (
      <Formik<EventDto<number>>
        initialValues={values}
        validationSchema={FormikValidation.createEvent}
        validateOnMount={true}
        onSubmit={(v, { setSubmitting }) => {
          setSubmitting(true)

          const start = new Date(v.startDate)
          const end = new Date(v.endDate)

          callApi({ ...v, startDate: start, endDate: end, id })
          setSubmitting(false)
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => (
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
                  startD={values.startDate}
                  endD={values.endDate}
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
  }
)

UpdateEvent.displayName = 'UpdateEvent'

export const Event = ({
  id,
  eventName,
  from,
  to,
  description,
  isAdmin,
  onDelete,
  start,
  end,
}: {
  id?: string
  eventName: string
  from: string
  to: string
  description: string
  isAdmin?: boolean
  start?: Date
  end?: Date
  onDelete?: () => void
}) => (
  <ListItem style={{ marginLeft: '-15px' }}>
    <Flex flexDirection={'column'} sx={{ gap: 1 }}>
      <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
        <Text as={'h4'} flex={1}>
          {eventName} {!!from && to && `- ${from} to ${to}`}
        </Text>
        {isAdmin && id && !!start?.getTime() && !!end?.getTime() && (
          <Flex flexDirection={'row'} sx={{ gap: 2 }}>
            <CustomModal
              title="Update event"
              titleProps={{ as: 'h3' }}
              modalChild={() => (
                <UpdateEvent
                  id={id}
                  onSuccess={() => onDelete?.()}
                  values={{
                    name: eventName,
                    description: description,
                    startDate: start.getTime(),
                    endDate: end.getTime(),
                  }}
                />
              )}
            >
              {({ setOpen }) => (
                <Button
                  style={{ padding: 0, width: 50 }}
                  onClick={() => setOpen(true)}
                >
                  Edit
                </Button>
              )}
            </CustomModal>
            <SecondaryButton
              style={{ padding: 0, width: 50 }}
              onClick={() => {
                if (!!id)
                  deleteEvent(id).finally(() => {
                    onDelete?.()
                  })
              }}
            >
              Delete
            </SecondaryButton>
          </Flex>
        )}
      </Flex>
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
                      <Flex flex={1} alignSelf={'center'} overflow={'hidden'}>
                        <AdminWebView>
                          <Text
                            as={'h6'}
                            width={'100%'}
                            color={c}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',

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
