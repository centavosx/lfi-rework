import { memo, useEffect, useRef } from 'react'
import { TextProps, Flex, Text as TextCopy } from 'rebass'
import { theme } from '../../../utils/theme'
import { Text } from '../../text'
import Drawer from '@mui/material/Drawer'
import React, { useCallback, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Button } from '../../button'
import { useRouter } from 'next/router'
import { useUser } from 'hooks'
import { FirebaseAdminRealtimeMessaging } from 'firebaseapp'

const LinkRef = ({
  href,
  children,

  isCurrent,
  ...others
}: { href: string; isCurrent: boolean } & TextProps) => {
  const { push } = useRouter()
  return (
    <Flex
      width={'auto'}
      fontWeight={'bold'}
      sx={{
        position: 'relative',
        fontSize: [14, 16],
        fontFamily: 'Castego',
        borderRadius: 8,
        cursor: 'pointer',
        color: theme.colors.white,
        backgroundColor: isCurrent ? theme.colors.black : undefined,
        padding: 14,
        ':hover': {
          backgroundColor: '#707070',
          color: theme.colors.white,
        },
        '&&:active': {
          backgroundColor: theme.colors.blackgray,
          color: theme.colors.white,
        },
      }}
      onClick={() => push({ pathname: '/admin/' + href })}
      {...others}
    >
      {children}
    </Flex>
  )
}

const navigations = [
  'Dashboard',
  'Calendar',
  'Scholars',
  'Applicants',
  'Admins',
  'Chats',
  'Audits',
  'Logout',
]

const ChatNumber = ({ isSelected }: { isSelected: boolean }) => {
  const [num, setNum] = useState(0)
  const fb2 = useRef(new FirebaseAdminRealtimeMessaging('')).current

  useEffect(() => {
    const sub = fb2.listen(() => {
      fb2.getUnreadCount().then((v) => {
        setNum(v)
      })
    })

    return () => {
      sub()
    }
  }, [])

  return !!num ? (
    <Flex
      sx={{
        position: 'absolute',
        right: 10,
        backgroundColor: isSelected ? 'white' : 'black',
        borderRadius: '100%',
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextCopy color={isSelected ? 'black' : 'white'}>{num}</TextCopy>
    </Flex>
  ) : (
    <></>
  )
}

export const AdminWebNavigation = memo(() => {
  const { pathname } = useRouter()
  const { logout } = useUser()

  return (
    <>
      {navigations
        .filter((v) => v !== 'Logout')
        .map((data) => (
          <LinkRef
            key={data}
            href={data?.split(' ').join('').toLowerCase()}
            color={
              pathname.includes(data?.split(' ').join('').toLowerCase())
                ? theme.colors.white
                : 'lightgray'
            }
            isCurrent={pathname.includes(
              data?.split(' ').join('').toLowerCase()
            )}
          >
            {data}
            {data === 'Chats' && (
              <ChatNumber
                isSelected={pathname.includes(
                  data?.split(' ').join('').toLowerCase()
                )}
              />
            )}
          </LinkRef>
        ))}
      <Text
        width={'auto'}
        fontWeight={'bold'}
        sx={{
          fontSize: [14, 16],
          fontFamily: 'Castego',
          borderRadius: 8,
          padding: 14,
          cursor: 'pointer',
          color: 'lightgray',
          ':hover': {
            backgroundColor: '#707070',
            color: theme.colors.white,
          },
          '&&:active': {
            backgroundColor: theme.colors.blackgray,
            color: theme.colors.white,
          },
        }}
        onClick={logout}
      >
        Logout
      </Text>
    </>
  )
})

AdminWebNavigation.displayName = 'AdminWebNavigation'

export const AdminMobileNavigation = memo(() => {
  const { logout } = useUser()
  const { replace } = useRouter()
  const [state, setState] = useState({
    left: false,
  })
  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setState({ left: open })
    },
    [setState]
  )

  const list = () => (
    <Box
      sx={{ width: 250 }}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      role="presentation"
    >
      <List>
        {navigations.map((data: string, i) => (
          <ListItem key={i} disablePadding={true}>
            <ListItemButton
              onClick={() => {
                if (data === 'Logout') {
                  logout()
                  return
                }
                replace('/admin/' + data?.split(' ').join('').toLowerCase())
              }}
            >
              <ListItemText primary={data} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ minWidth: 34 }}>
        <FiMenu size={30} />
      </Button>
      <Drawer
        open={state.left}
        anchor={
          typeof window !== 'undefined' && window.innerWidth <= 639
            ? 'right'
            : 'left'
        }
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  )
})

AdminMobileNavigation.displayName = 'AdminMobileNav'
