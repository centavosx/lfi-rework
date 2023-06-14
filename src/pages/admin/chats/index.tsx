import { Chat } from 'components/chat'
import { SearchableInput } from 'components/input'
import { Section } from 'components/sections'
import { format } from 'date-fns'
import { FirebaseAdminRealtimeMessaging } from 'firebaseapp'
import { useUser } from 'hooks'
import { useEffect, useRef, useState } from 'react'
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

const UserInfo = ({
  img,
  name,
  date,
  message,
  onClick,
  isSelected,
}: {
  isSelected: boolean
  onClick: () => void
  img?: string
  name: string
  date: string
  message?: string
}) => {
  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        backgroundColor: isSelected ? theme.colors.green : '',

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
              ? '/assets/logo-white.png'
              : '/assets/logo.png'
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
    </Flex>
  )
}

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
    <Flex flexDirection={'row'} sx={{ gap: 2, width: '100%', height: '100%' }}>
      <Flex
        flexDirection={'column'}
        sx={{
          gap: 2,
          width: 300,
        }}
      >
        <SearchableInput label="Search user" />
        <UserInfoContainer
          getData={(id) => setSelected(id)}
          id={user?.id ?? ''}
          selectedId={select?.id}
        />
      </Flex>
      <Flex justifyContent={'flex-end'} height={'100%'} width={'100%'}>
        {!!select && (
          <Chat
            id={select.id}
            title={select.name}
            from={user?.id ?? ''}
            img={select.picture}
          />
        )}
      </Flex>
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
        title="Applicants"
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
