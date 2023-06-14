import React, { useEffect, useRef, useState } from 'react'
import { Flex } from 'rebass'

import { Section } from '../../../components/sections'

import { Logs, LogsProp } from 'firebaseapp'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { format } from 'date-fns'

const AuditLogs = () => {
  const ref = useRef(new Logs()).current
  const [data, setData] = useState<
    (LogsProp & { refId: string; created: number })[]
  >([])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const sub = ref.listen((v, t) => {
        if (t === 'added') {
          setData((val) =>
            !val.some((check) => {
              return check.refId === v.refId
            })
              ? [v as any, ...val]
              : val
          )
        }
      })

      return () => {
        sub()
      }
    }
  }, [isMounted])

  useEffect(() => {
    ref
      .getData(20)
      .then((v) => setData((val) => [...(v as any), ...val]))
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  return (
    <>
      {data.map((v, i) => (
        <TableRow key={i} hover={true}>
          <TableCell component="td" scope="row" sx={{ width: 220 }}>
            {v.ip}
          </TableCell>
          <TableCell component="td" scope="row">
            {!!v.created &&
              format(new Date(v.created), 'cccc LLLL d, yyyy hh:mm a')}
          </TableCell>
          <TableCell component="td" scope="row">
            {v.user}
          </TableCell>
          <TableCell component="td" scope="row">
            {v.browser}
          </TableCell>
          <TableCell component="td" scope="row">
            {v.device}
          </TableCell>
          <TableCell component="td" scope="row">
            {v.event}
          </TableCell>
          <TableCell component="td" scope="row">
            {v.other}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function Audits() {
  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Audit Logs" textProps={{ textAlign: 'start' }}>
        <Table
          sx={{ minWidth: 500, position: 'relative' }}
          aria-label="custom pagination table"
          stickyHeader={true}
        >
          <TableHead>
            <TableRow>
              <TableCell component={'th'} align={'left'}>
                IP
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                Date
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                User
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                Browser
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                Device
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                Action
              </TableCell>
              <TableCell component={'th'} align={'left'}>
                Other
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AuditLogs />
          </TableBody>
        </Table>
      </Section>
    </Flex>
  )
}
