import { Button } from 'components/button'
import { Chat } from 'components/chat'
import { SearchableInput } from 'components/input'
import { Section } from 'components/sections'
import { FullWebView, MobileView, WebView } from 'components/views'
import { format } from 'date-fns'
import {
  FirebaseAdminRealtimeMessaging,
  FirebaseRealtimeMessaging,
} from 'firebaseapp'
import { useUser } from 'hooks'
import { useEffect, useRef, useState, memo } from 'react'
import { Flex, Image, Text } from 'rebass'
import { theme } from 'utils/theme'

type UserSelected = {
  id: string
  name: string
  picture?: string
  chatModified: number
  lastMessage?: string
}

const UserInfoContainer = ({
  id,
  selectedId,
  getData,
}: {
  id: string
  selectedId?: string
  getData: (user: UserSelected) => void
}) => {
  const [data, setData] = useState<UserSelected[]>([])

  const fb = useRef(
    new FirebaseAdminRealtimeMessaging<
      any,
      {
        id: string
        name: string
        picture?: string
        chatModified: number
        lastMessage?: string
      }
    >(id)
  ).current

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const sub = fb.listen((v, t) => {
        setData((val) => {
          return (
            !val.some((check) => {
              return check.id === v.id
            })
              ? [v, ...val]
              : val.map((u) => (u.id === v.id ? { ...v } : u))
          ).sort((a, b) => b.chatModified - a.chatModified)
        })
      })

      return () => {
        sub()
      }
    }
  }, [isMounted])

  useEffect(() => {
    fb.getData(20)
      .then((v) => {
        setData((val) =>
          [...val, ...v].sort((a, b) => b.chatModified - a.chatModified)
        )
      })
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
      {data.map((v) => {
        return (
          <UserInfo
            key={v.id}
            id={id}
            selectedId={v.id}
            isSelected={!!selectedId && v.id === selectedId}
            name={v.name}
            img={v.picture}
            message={v.lastMessage}
            date={format(new Date(v.chatModified), 'cccc LLLL d, yyyy hh:mm a')}
            onClick={() => {
              getData(v)
            }}
          />
        )
      })}
    </Flex>
  )
}

const UserInfo = memo(
  ({
    id,
    img,
    name,
    date,
    message,
    onClick,
    isSelected,
    selectedId,
  }: {
    id: string
    isSelected: boolean
    onClick: () => void
    img?: string
    name: string
    date: string
    message?: string
    selectedId: string
  }) => {
    const [number, setNumber] = useState(0)
    const fb = useRef(
      new FirebaseRealtimeMessaging<
        any,
        {
          id: string
          name: string
          picture?: string
          chatModified: number
          lastMessage?: string
        }
      >(selectedId)
    ).current

    useEffect(() => {
      const sub = fb.listen(() => {
        fb.getUnreadCount(id).then((v) => {
          setNumber(v)
        })
      })

      return () => {
        sub()
      }
    }, [])
    return (
      <Flex
        sx={{
          gap: 2,
          alignItems: 'center',
          backgroundColor: isSelected ? theme.colors.green : '',
          position: 'relative',
          borderRadius: 8,
          ':hover': {
            backgroundColor: theme.colors.green,
          },
          padding: 2,
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <Image
          src={
            !img
              ? isSelected
                ? '/assets/surelogo.png'
                : '/assets/surelogo.png'
              : img
          }
          size={64}
          sx={{ borderRadius: '100%' }}
          alt="logo"
        />
        <Flex flexDirection={'column'} flex={1}>
          <Text as={'h3'} color={isSelected ? 'white' : undefined}>
            {name}
          </Text>
          <Text as={'h6'} color={isSelected ? 'white' : undefined}>
            {date}
          </Text>
          <Text color={isSelected ? 'white' : undefined}>{message}</Text>
        </Flex>
        {!!number && (
          <Flex
            sx={{
              position: 'absolute',
              borderRadius: '100%',
              backgroundColor: theme.colors.green,
              padding: '2px',
              pl: '6px',
              pr: '6px',
              top: 0,
              left: '-7px',
            }}
          >
            <Text color={'white'} fontSize={12}>
              {number}
            </Text>
          </Flex>
        )}
      </Flex>
    )
  }
)

UserInfo.displayName = 'UserInfo'

const ChatContainer = () => {
  const [select, setSelected] = useState<{
    id: string
    name: string
    picture?: string
    chatModified: number
    lastMessage?: string
  }>()
  const { user } = useUser()
  return (
    <Flex
      flexDirection={['column', 'row']}
      sx={{ gap: 2, width: '100%', height: '100%' }}
    >
      <FullWebView>
        <Flex
          flexDirection={'row'}
          sx={{ gap: 2, width: '100%', height: '100%' }}
        >
          <Flex
            flexDirection={'column'}
            sx={{
              gap: 2,
              width: ['100%', 250, 450],
            }}
          >
            <SearchableInput label="Search user" />
            <UserInfoContainer
              getData={(id) => setSelected(id)}
              id={user?.id ?? ''}
              selectedId={select?.id}
            />
          </Flex>
          <Flex justifyContent={'flex-end'} height={'100%'} flex={1}>
            <Chat
              id={select?.id ?? ''}
              title={select?.name ?? ''}
              from={user?.id ?? ''}
              img={select?.picture ?? ''}
            />
          </Flex>
        </Flex>
      </FullWebView>
      <MobileView>
        {!select ? (
          <Flex
            flexDirection={'column'}
            sx={{
              gap: 2,
              width: ['100%'],
            }}
          >
            <SearchableInput label="Search user" />
            <UserInfoContainer
              getData={(id) => setSelected(id)}
              id={user?.id ?? ''}
              selectedId={(select as any)?.id}
            />
          </Flex>
        ) : (
          <Flex flexDirection={'column'} sx={{ gap: 2 }}>
            <Button
              onClick={() => setSelected(undefined)}
              style={{ width: 100 }}
            >
              Back
            </Button>
            <Flex
              justifyContent={'flex-end'}
              height={window.innerHeight}
              width={'100%'}
            >
              <Chat
                id={select?.id ?? ''}
                title={select?.name ?? ''}
                from={user?.id ?? ''}
                img={select?.picture ?? ''}
              />
            </Flex>
          </Flex>
        )}
      </MobileView>
    </Flex>
  )
}

export default function Chats() {
  return (
    <Flex
      flexDirection={'column'}
      alignItems="center"
      width={'100%'}
      height={'90vh'}
    >
      <Section
        title="Messages"
        textProps={{ textAlign: 'start' }}
        flex={1}
        height={'100%'}
        style={{ marginBottom: 10 }}
        contentProps={{ height: '100%' }}
      >
        {/* <Chat /> */}
        <ChatContainer />
      </Section>
    </Flex>
  )
}
