import {
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  SetStateAction,
} from 'react'
import { Flex, Image, Link as Anchor, FlexProps, Text as Text2 } from 'rebass'
import Navigation from '../navigation'

import { theme } from '../../utils/theme'

import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useUser } from 'hooks'
import { NotifButton } from 'components/button'
import { CustomModal } from 'components/modal'
import { Chat } from 'components/chat'
import { UserStatus } from 'entities'
import {
  FirebaseReadListen,
  FirebaseRealtimeMessaging,
  FirebaseRealtimeNotifications,
  Logs,
  LogsEvents,
} from 'firebaseapp'
import { useRouter } from 'next/router'
import { IPAndDeviceContext } from 'contexts'
import { format } from 'date-fns'
import { AiFillCloseCircle } from 'react-icons/ai'
import Link from 'next/link'

const IsOpenOrClose = ({
  children,
}: {
  children: (v: boolean, setO: Dispatch<SetStateAction<boolean>>) => ReactNode
}) => {
  const [open, setOpen] = useState(true)
  return <>{open && children(open, setOpen)}</>
}

const ChatClick = ({ setOpen }: { setOpen: () => void }) => {
  const { user } = useUser()
  const [number, setNumber] = useState(0)
  const ref = useRef(new FirebaseRealtimeMessaging(user?.id ?? '')).current

  useEffect(() => {
    const sub = ref.listen(() => {
      if (!!user?.id)
        ref.getUnreadCount(user.id).then((v) => {
          setNumber(v)
        })
    })

    return () => {
      sub()
    }
  }, [user?.id])

  return (
    <Flex
      width={18}
      height={18}
      sx={{
        position: 'relative',
        justifyContent: 'center',
        alignSelf: 'center',
      }}
      minWidth={'auto'}
    >
      <Image
        rel="preload"
        src={'/assets/icons/chat.png'}
        width={'100%'}
        height={'100%'}
        alt="image"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (!!user?.id) ref.readData(user.id)
          setOpen()
        }}
      />
      {!!number && (
        <Text
          sx={{
            top: -10,
            position: 'absolute',
            right: -20,
            fontSize: 12,
            color: theme.colors.darkestGreen,
            fontWeight: 600,
          }}
        >
          {number}
        </Text>
      )}
    </Flex>
  )
}

const NotifDataListen = ({
  close,
  id,
  isNotAll,
}: {
  close?: () => void
  id: string
  isNotAll: boolean
}) => {
  const [data, setData] = useState<
    {
      refId: string
      title: string
      description: string
      created: string
    }[]
  >([])
  const ref = useRef(new FirebaseRealtimeNotifications(id, isNotAll)).current
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const sub = ref.listen((v, t) => {
      if (isMounted) {
        setData((value) => {
          if (t === 'removed') {
            return value.filter((rem) => rem.refId !== v.refId)
          } else if (t === 'added') {
            return [v as any, ...value]
          } else {
            return value.map((up) =>
              up.refId === v.refId ? { ...up, ...(v as any) } : up
            )
          }
        })
      }
    })

    return () => {
      sub()
    }
  }, [id])

  useEffect(() => {
    ref
      .getData(20)
      .then((v) => setData((val) => [...val, ...(v as any)]))
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  useEffect(() => {
    ref.readData()
  }, [data])

  return (
    <Flex
      sx={{
        minWidth: [200, 250],
        maxWidth: [300, 350],
        width: 'auto',
        maxHeight: 550,
        flexDirection: 'column',
        gap: 2,
        border: '1px solid gray',
        borderRadius: 3,
        marginTop: 1,
        paddingTop: 2,
        paddingBottom: 2,
        zIndex: 9999,
        backgroundColor: theme.colors.white,
        overflow: 'auto',
      }}
    >
      {data.map((v, i) => {
        return (
          <Flex
            key={i}
            flexDirection={'column'}
            sx={{
              gap: 2,
              ':hover': {
                backgroundColor: theme.colors.green,
                color: theme.colors.white,
              },
              color: theme.colors.black,

              padding: '6px',
              cursor: 'pointer',
            }}
            onClick={async () => {
              close?.()
            }}
          >
            <Text as={'h4'} color={'black'}>
              {v.title}
            </Text>
            <Text as={'h6'} color={'gray'}>
              {format(new Date(v.created), 'cccc LLLL d, yyyy hh:mm a')}
            </Text>
            <Text color={'black'}>{v.description}</Text>
          </Flex>
        )
      })}
    </Flex>
  )
}

const NotifClick = () => {
  const { user } = useUser()
  const [number, setNumber] = useState(0)
  const ref = useRef(new FirebaseRealtimeNotifications(user?.id ?? '')).current
  const ref2 = useRef(new FirebaseReadListen(user?.id ?? '')).current

  useEffect(() => {
    if (!!user?.id) {
      const sub = ref.listen(() => {
        ref.getUnreadCount().then((v) => {
          setNumber(v)
        })
      })
      const sub2 = ref2.listen(() => {
        ref.getUnreadCount().then((v) => {
          setNumber(v)
        })
      })

      return () => {
        sub()
        sub2()
      }
    }
  }, [user?.id])

  return (
    <NotifButton
      rel="preload"
      src={'/assets/icons/bell.png'}
      width={18}
      height={18}
      minWidth={'auto'}
      alt="image"
      notifNumber={number}
      modalContainerProps={{
        sx: {
          right: [-10, 0],
        },
      }}
      displayModal={(close) => {
        return !!user?.id ? (
          <NotifDataListen
            close={close}
            id={user.id}
            isNotAll={user.status !== UserStatus.ACTIVE}
          />
        ) : (
          <></>
        )
      }}
    />
  )
}

export const Main = ({
  pageTitle,
  children,
}: { pageTitle?: string } & FlexProps) => {
  const device = useContext(IPAndDeviceContext)
  const {
    user,
    roles: { isUser },
  } = useUser()
  const { asPath, pathname } = useRouter()

  useEffect(() => {
    if (!!device.ip) {
      new Logs({
        user: !!user ? 'USER-' + user.id : 'anonymous',
        ip: device.ip,
        event: LogsEvents.navigate,
        browser: device?.browser?.name + ' v' + device?.browser?.version,
        device: device?.os?.name + ' v' + device?.os?.version,
        other: asPath.startsWith('/login/?who=') ? asPath : pathname,
      })
    }
  }, [asPath, device])

  const scolar = user?.scholar?.sort(
    (a: any, b: any) => new Date(b).getTime() - new Date(a).getTime()
  )?.[0]
  return (
    <>
      <BaseHead
        title="Lao Foundation"
        pageTitle={pageTitle}
        description="Scholarships"
      />
      <Flex
        width={'100%'}
        sx={{ height: '100%', flexDirection: 'column' }}
        justifyContent="center"
        backgroundColor={theme.colors.white}
      >
        <Flex
          sx={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            backgroundColor: theme.colors.white,
          }}
        >
          <Header
            justifyContent={'start'}
            sx={{
              gap: 2,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '100%',
              zIndex: 99,
            }}
            maxWidth={2250}
            alignSelf="center"
          >
            <Flex flex={1} sx={{ justifyContent: 'start' }}>
              <Anchor href="/" sx={{ mr: [null, 4] }}>
                <Flex alignItems={'center'} sx={{ gap: 1 }}>
                  <Image
                    rel="preload"
                    src={'/assets/logo.png'}
                    width={50}
                    height={50}
                    minWidth={'auto'}
                    alt="image"
                  />
                  <Text
                    sx={{
                      fontSize: [14, 18],
                      fontWeight: 350,
                      color: theme.colors.green,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: theme.colors.darkGreen,
                      }}
                    >
                      SCHOLAR
                    </span>
                    SHIP
                  </Text>
                </Flex>
              </Anchor>
            </Flex>
            <Flex
              flexDirection={['row', 'row-reverse']}
              sx={{ gap: 2, alignItems: 'center' }}
            >
              {!!user &&
                (user.status === UserStatus.VERIFIED ||
                  user.status === UserStatus.ACTIVE) && (
                  <Flex
                    flexDirection={['row', 'row-reverse']}
                    sx={{ gap: [3, 4, 4], mr: 2 }}
                  >
                    <NotifClick />

                    <CustomModal
                      modalChild={() => {
                        return <Chat title="Your messages" id={user.id} />
                      }}
                      maxHeight={'80%'}
                      maxWidth={2250}
                      isModalOverFlow={false}
                    >
                      {({ setOpen }) => (
                        <ChatClick setOpen={() => setOpen((v) => !v)} />
                      )}
                    </CustomModal>
                  </Flex>
                )}
              <WebView>
                <Flex sx={{ gap: 16, padding: 15 }}>
                  <Navigation.WebNavigation />
                </Flex>
              </WebView>
              <MobileView>
                <Navigation.MobileNavigation />
              </MobileView>
            </Flex>
          </Header>
        </Flex>
        <Flex
          sx={{
            gap: 2,
            backgroundColor: theme.colors.white,
            height: '100%',
            overflow: 'auto',
            width: '100%',
            flexDirection: 'column',
          }}
          maxWidth={2250}
          alignSelf="center"
        >
          {!!user?.scholar &&
            user.status === UserStatus.ACTIVE &&
            isUser &&
            pathname !== '/' &&
            !pathname.startsWith('/user/waiting') &&
            !scolar?.enrollmentBill &&
            !scolar?.ended && (
              <IsOpenOrClose>
                {(v, setO) => (
                  <Flex
                    width={'100%'}
                    backgroundColor={'RGBA(255, 255, 0, 0.2)'}
                    p={3}
                    alignItems={'center'}
                  >
                    <Text2 flex={1} as={'h4'}>
                      Reminder: Please submit your enrollment bill! Go to{' '}
                      <Link
                        href={'/user/settings'}
                        prefetch={true}
                        style={{ textDecoration: 'underline' }}
                      >
                        settings
                      </Link>
                      .
                    </Text2>
                    <AiFillCloseCircle
                      onClick={() => setO((v: any) => !v)}
                      cursor={'pointer'}
                      style={{ marginRight: 20 }}
                    />
                  </Flex>
                )}
              </IsOpenOrClose>
            )}

          <Flex flex={1} flexDirection={'column'}>
            {children}
          </Flex>
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'column',
              backgroundColor: theme.colors.darkestGreen,
            }}
          >
            <Header
              id={'footer'}
              sx={{
                gap: 2,
                padding: 20,
                width: '100%',
                position: 'relative',
              }}
              maxWidth={2250}
              alignSelf="center"
            >
              <Flex
                flex={1}
                flexDirection={['column', 'row']}
                sx={{
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Image
                  rel="preload"
                  src={'/assets/logo-white.png'}
                  width={50}
                  height={50}
                  mr={[0, 4]}
                  minWidth={'auto'}
                  alt="image"
                />

                <Flex
                  flex={0.8}
                  flexDirection={'column'}
                  sx={{ gap: '2px' }}
                  textAlign={['center', 'left']}
                >
                  <Text as={'h5'}>ADDRESS</Text>
                  <Text>
                    65 Colle Industria Bagumbayan Quezon City 1110, Philippines
                  </Text>
                </Flex>
                <Flex
                  flex={0.8}
                  flexDirection={'column'}
                  sx={{ gap: 2 }}
                  textAlign={['center', 'left']}
                >
                  <Text as={'h5'}>CONTACT US</Text>
                  <Text>hello@thelaoufoundation.org</Text>
                  <Text>+63 2 8635 0680</Text>
                </Flex>
                <Flex
                  flex={0.2}
                  flexDirection={'column'}
                  textAlign={['center', 'left']}
                  sx={{ gap: 2 }}
                >
                  <Text as={'h5'}>Follow US</Text>
                  <Flex width={'100%'} flexDirection={'row'} sx={{ gap: 2 }}>
                    <Image
                      rel="preload"
                      height={24}
                      width={24}
                      src={'/assets/fb.png'}
                      minWidth={'auto'}
                      color={'white'}
                      alt="image"
                    />
                    <Image
                      rel="preload"
                      height={24}
                      width={24}
                      src={'/assets/ig.png'}
                      minWidth={'auto'}
                      alt="image"
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Header>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
