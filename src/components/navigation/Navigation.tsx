import React, { useCallback, useState, Fragment, memo } from 'react'
import { Flex, Text } from 'rebass'
import Drawer from '@mui/material/Drawer'

import { theme } from '../../utils/theme'
import { FiMenu } from 'react-icons/fi'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import {
  Button,
  ButtonDropdown,
  CustomDropdown,
  SecondaryButton,
} from '../button'
import { useRouter } from 'next/router'

import { TextModal } from '../modal'
import { useUser } from 'hooks'
import { User } from 'entities'

export const WebNavigation = memo(() => {
  const { push } = useRouter()
  const { logout, user } = useUser()

  const textLink = '/'

  return (
    <>
      <TextModal
        width={'auto'}
        fontWeight={'bold'}
        style={{ cursor: 'pointer', alignSelf: 'center' }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        sx={{
          fontSize: [14, 16],
          fontFamily: 'Castego',
          padding: 0,
        }}
        color={theme.colors.darkestGreen}
        onClick={() => push(textLink)}
        isNotClickable={true}
      >
        Home
      </TextModal>
      {!!user ? (
        <>
          <TextModal
            width={'auto'}
            fontWeight={'bold'}
            style={{ cursor: 'pointer', alignSelf: 'center' }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            sx={{
              fontSize: [14, 16],
              fontFamily: 'Castego',
              padding: 0,
            }}
            color={theme.colors.darkestGreen}
            onClick={() =>
              push(textLink + 'user', undefined, { shallow: true })
            }
            isNotClickable={true}
          >
            Dashboard
          </TextModal>
          <CustomDropdown
            display={(close) => (
              <Flex
                sx={{
                  width: 220,
                  flexDirection: 'column',
                  gap: 2,
                  border: '1px solid gray',
                  borderRadius: 6,
                  marginTop: 1,
                  paddingTop: 2,
                  paddingBottom: 2,
                  zIndex: 9999,
                  backgroundColor: theme.colors.white,
                }}
              >
                <Text padding={2} as={'h4'}>
                  Hi! Vincent Lennuel Llanto
                </Text>
                <Text
                  sx={{
                    ':hover': {
                      backgroundColor: theme.colors.green,
                      color: theme.colors.white,
                    },
                    color: theme.colors.black,
                    width: '100%',
                    padding: '4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    close()
                  }}
                >
                  Settings
                </Text>
                <Text
                  sx={{
                    ':hover': {
                      backgroundColor: theme.colors.green,
                      color: theme.colors.white,
                    },
                    color: theme.colors.black,
                    padding: '4px',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    close()
                  }}
                >
                  Logout
                </Text>
              </Flex>
            )}
          >
            {(open) => (
              <TextModal
                width={'auto'}
                fontWeight={'bold'}
                style={{ cursor: 'pointer', alignSelf: 'center' }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                sx={{
                  fontSize: [14, 16],
                  fontFamily: 'Castego',
                  padding: 0,
                }}
                color={theme.colors.darkestGreen}
                onClick={() => open()}
                isNotClickable={true}
              >
                Profile
              </TextModal>
            )}
          </CustomDropdown>
        </>
      ) : (
        <>
          <SecondaryButton
            style={{ textTransform: 'capitalize', fontWeight: 400 }}
            onClick={() => push(textLink + 'register')}
          >
            Sign Up
          </SecondaryButton>
          <ButtonDropdown
            style={{ textTransform: 'capitalize', fontWeight: 400 }}
            display={(close) => (
              <Flex
                sx={{
                  width: 150,
                  flexDirection: 'column',
                  gap: 2,
                  border: '1px solid gray',
                  borderRadius: 3,
                  marginTop: 1,
                  paddingTop: 2,
                  paddingBottom: 2,
                  zIndex: 9999,
                  backgroundColor: theme.colors.white,
                }}
              >
                <Text
                  sx={{
                    ':hover': {
                      backgroundColor: theme.colors.green,
                      color: theme.colors.white,
                    },
                    color: theme.colors.black,
                    width: '100%',
                    padding: '2px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    await push(
                      textLink + 'login',
                      {
                        query: {
                          who: 'Scholar',
                        },
                      },
                      { shallow: true }
                    )
                    close()
                  }}
                >
                  For Scholar
                </Text>
                <Text
                  sx={{
                    ':hover': {
                      backgroundColor: theme.colors.green,
                      color: theme.colors.white,
                    },
                    color: theme.colors.black,
                    padding: '2px',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    await push(
                      textLink + 'login',
                      {
                        query: {
                          who: 'Employee',
                        },
                      },
                      { shallow: true }
                    )
                    close()
                  }}
                >
                  For Employee
                </Text>
              </Flex>
            )}
          >
            Login
          </ButtonDropdown>
        </>
      )}
    </>
  )
})

WebNavigation.displayName = 'WebNav'

export const MobileNavigation = memo(() => {
  const { push } = useRouter()
  const { logout } = useUser()
  const [state, setState] = useState({
    right: false,
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
      setState({ right: open })
    },
    [setState]
  )

  const list = useCallback(
    () => (
      <Box
        sx={{ width: 250, zIndex: 1000000 }}
        onKeyDown={toggleDrawer(false)}
        role="presentation"
      >
        <List>
          {['Home', 'Sign Up', 'Login for scholar', 'Login for employee'].map(
            (data: string, i) => (
              <Fragment key={i}>
                <ListItem disablePadding={true}>
                  <ListItemButton
                    onClick={async () => {
                      switch (data) {
                        case 'Home':
                          await push('/')
                          break
                        case 'Sign Up':
                          await push('/register')
                          break
                        case 'Login for scholar':
                          await push('/login', {
                            query: {
                              who: 'Scholar',
                            },
                          })
                          break
                        case 'Login for employee':
                          await push('/login', {
                            query: {
                              who: 'Employee',
                            },
                          })
                          break
                        case 'Logout':
                          logout()
                          break
                        default:
                          push('/' + data?.split(' ').join('').toLowerCase())
                          break
                      }
                    }}
                  >
                    <ListItemText primary={data} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            )
          )}
        </List>
      </Box>
    ),
    []
  )

  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ minWidth: 34, zIndex: -1 }}>
        <FiMenu size={30} color={theme.colors.white} />
      </Button>

      <Drawer open={state.right} anchor={'right'} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  )
})

MobileNavigation.displayName = 'MobileNav'
