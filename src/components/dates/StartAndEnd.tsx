import { memo, useEffect } from 'react'

import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { InputError } from 'components/input'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Flex, Text } from 'rebass'
import { TextField } from '@mui/material'
import { addDays, addHours } from 'date-fns'

const Time = memo((props: any) => {
  const [error, setError] = useState<'date' | 'error'>()

  useEffect(() => {
    const time = props.minTime
    const date = new Date(time.toString())

    if (props.value <= date) setError('date')
    else setError(undefined)
  }, [props.minTime])

  return (
    <Flex flexDirection={'column'}>
      <TimePicker
        {...props}
        onChange={(p: any) => {
          if (p.isBefore(props.minTime)) {
            setError('date')
            return
          }
          if (!p.isValid()) {
            setError('error')
            return
          }

          setError(undefined)
          props?.onChange?.(p)
        }}
      />
      <InputError
        error={
          props?.errorMessage?.(error) ||
          (error === 'date'
            ? 'Time should be greater or equal'
            : error === 'error'
            ? 'Time is not valid'
            : undefined)
        }
      />
    </Flex>
  )
})

Time.displayName = 'Time'

const DatePick = memo((props: any) => {
  const [error, setError] = useState<'date' | 'error'>()
  useEffect(() => {
    const time = props.minDate
    const date = addDays(new Date(time.toString()), -1)

    if (props.value <= date) setError('date')
    else setError(undefined)
  }, [props.minDate])
  return (
    <Flex flexDirection={'column'}>
      <DatePicker
        {...props}
        onChange={(p: any) => {
          const d = addDays(new Date(props.minDate.toString()), -1)

          if (p.isBefore(d)) {
            setError('date')
            return
          }
          if (!p.isValid()) {
            setError('error')
            return
          }

          setError(undefined)
          props?.onChange?.(p)
        }}
      />
      <InputError
        error={
          props?.errorMessage?.(error) ||
          (error === 'date'
            ? 'Date should be greater or equal'
            : error === 'error'
            ? 'Date is not valid'
            : undefined)
        }
      />
    </Flex>
  )
})

DatePick.displayName = 'Date'

export const StartAndEnd = ({
  onChangeDate,
}: {
  onChangeDate?: (d: { start: Date; end: Date }) => void
}) => {
  const [start, setStartDate] = useState(new Date())

  const [end, setEndDate] = useState(new Date())

  useEffect(() => {
    onChangeDate?.({ start, end })
  }, [start, end])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
        <Flex flexDirection={'column'} sx={{ gap: 3 }}>
          <Text as="h4">Start Date</Text>
          <Flex sx={{ gap: 2 }}>
            <DatePick
              label="Start Date"
              value={start}
              minDate={dayjs(new Date())}
              renderInput={(params: any) => {
                return (
                  <TextField
                    error={true}
                    {...params}
                    // style={{ width: '100%' }}
                    // paddingRight={15}
                  />
                )
              }}
              errorMessage={(v: any) => {
                if (v === 'date') return 'Date should be greater than today'
                return undefined
              }}
              onChange={(newValue: any) => {
                const date = new Date(newValue.toString())

                setStartDate(date)
              }}
            />
            <Time
              label="Time"
              value={start}
              ampm={true}
              minTime={dayjs(
                new Date(
                  start.getFullYear(),
                  start.getMonth(),
                  start.getDate()
                ).getTime() > new Date().getTime()
                  ? new Date(0, 0, 0)
                  : new Date()
              )}
              closeOnSelect={true}
              renderInput={(params: any) => {
                return (
                  <TextField
                    error={true}
                    {...params}
                    // style={{ width: '100%' }}
                    // paddingRight={15}
                  />
                )
              }}
              errorMessage={(v: any) => {
                if (v === 'date') return 'Time should be greater than today'
                return undefined
              }}
              ampmInClock={false}
              views={['hours', 'minutes']}
              onChange={(newValue: any) => {
                const date = new Date(newValue.toString())

                setStartDate(date)
              }}
            />
          </Flex>
        </Flex>
        <Flex flexDirection={'column'} sx={{ gap: 3 }}>
          <Text as="h4">End Date</Text>
          <Flex sx={{ gap: 2 }}>
            <DatePick
              label="End Date"
              value={end}
              minDate={dayjs(start)}
              renderInput={(params: any) => {
                return (
                  <TextField
                    {...params}
                    error={false}
                    // style={{ width: '100%' }}
                    // paddingRight={15}
                  />
                )
              }}
              errorMessage={(v: any) => {
                if (v === 'date')
                  return 'Date should be greater than start date'
                return undefined
              }}
              onChange={(newValue: any) => {
                const date = new Date(newValue.toString())

                setEndDate(date)
              }}
            />
            <Time
              label="Time"
              value={end}
              ampm={true}
              minTime={dayjs(
                new Date(
                  end.getFullYear(),
                  end.getMonth(),
                  end.getDate()
                ).getTime() >
                  new Date(
                    start.getFullYear(),
                    start.getMonth(),
                    start.getDate()
                  ).getTime()
                  ? new Date(0, 0, 0)
                  : addHours(start, 1)
              )}
              closeOnSelect={true}
              renderInput={(params: any) => {
                return (
                  <TextField
                    error={true}
                    {...params}
                    // style={{ width: '100%' }}
                    // paddingRight={15}
                  />
                )
              }}
              errorMessage={(v: any) => {
                if (v === 'date')
                  return 'Time should be greater than start date'
                return undefined
              }}
              ampmInClock={false}
              views={['hours', 'minutes']}
              onChange={(newValue: any) => {
                const date = new Date(newValue.toString())

                setEndDate(date)
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </LocalizationProvider>
  )
}
