import { memo, useEffect, useRef, useState } from 'react'
import { Flex, Text, Image } from 'rebass'
import { theme } from 'utils/theme'
import { format } from 'date-fns'
import { Input } from 'components/input'
import { Button } from 'components/button'
import {
  FirebaseAdminRealtimeMessaging,
  FirebaseRealtimeMessaging,
} from 'firebaseapp'

export const ChatMessages = ({ id, from }: { id: string; from: string }) => {
  const [data, setData] = useState<
    {
      created: number
      user: string
      message: string
      from: string
      refId: string
    }[]
  >([])
  const fb = useRef(
    new FirebaseRealtimeMessaging<{ message: string }>(id)
  ).current
  const fb2 = useRef(new FirebaseAdminRealtimeMessaging(id)).current

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const sub = fb.listen((v, t) => {
        if (t === 'added') {
          setData((val) =>
            !val.some((check) => {
              return check.refId === v.refId
            })
              ? [...val, v as any]
              : val
          )
        }
      })

      return () => {
        sub()
      }
    }
  }, [id, isMounted])

  useEffect(() => {
    fb.getData(20)
      .then((v) => setData((val) => [...val, ...(v as any).reverse()]))
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  useEffect(() => {
    fb.readData(from)
    if (from !== id) fb2.readData(id)
  }, [data])

  return (
    <Flex
      flexDirection="column"
      padding={2}
      sx={{ borderRadius: 8, overflowY: 'scroll', gap: 2 }}
      flex={1}
    >
      {data.map((v, i) => {
        return (
          <UserMessage
            message={v.message}
            key={i}
            isUser={v.from === from}
            date={new Date(v.created)}
          />
        )
      })}
    </Flex>
  )
}

export const UserMessage = ({
  message,
  isUser,
  date,
}: {
  message: string
  date?: Date
  isUser?: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <Flex
      ref={ref}
      width={'45%'}
      maxWidth={'45%'}
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      justifyContent={isUser ? 'flex-end' : undefined}
      flexDirection={'column'}
      alignItems={isUser ? 'flex-end' : 'flex-start'}
    >
      <Flex width={'100%'} justifyContent={isUser ? 'end' : 'start'}>
        <Text
          width={'auto'}
          alignItems={isUser ? 'flex-end' : 'flex-start'}
          color={!isUser ? theme.colors.black : theme.colors.white}
          padding={2}
          backgroundColor={
            !isUser ? theme.colors.white : theme.colors.darkerGreen
          }
          sx={{
            borderRadius: 8,
            ...(!isUser
              ? {
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: theme.colors.darkestGreen,
                  justifyContent: 'flex-end',
                }
              : {}),
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          {message}
        </Text>
      </Flex>
      {!!date && (
        <Text sx={{ fontSize: 11, opacity: 0.5, textAlign: 'end' }}>
          {format(date, 'cccc LLLL d, yyyy hh:mm a')}
        </Text>
      )}
    </Flex>
  )
}

const ChatInput = memo(({ id, from }: { id: string; from: string }) => {
  const [message, setMessage] = useState('')
  let fb = useRef(
    new FirebaseRealtimeMessaging<{ message: string; from: string }>(id)
  )

  useEffect(() => {
    fb.current = new FirebaseRealtimeMessaging<{
      message: string
      from: string
    }>(id)
  }, [id])

  return (
    <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
      <Input
        multiline={true}
        variant="outlined"
        inputcolor={{
          labelColor: 'gray',
          backgroundColor: 'white',
          borderBottomColor: theme.mainColors.first,
          color: 'black',
        }}
        label={'Message'}
        placeholder={'Type Message'}
        maxRows={3}
        padding={20}
        paddingBottom={15}
        sx={{ color: 'black', flex: 1 }}
        onChange={(v) => setMessage(v.target.value)}
        value={message}
      />
      <Button
        style={{ width: 50, height: 40 }}
        onClick={() => {
          if (!!id) {
            fb.current.sendData({ message, from })
            setMessage('')
          }
        }}
      >
        Send
      </Button>
    </Flex>
  )
})

ChatInput.displayName = 'ChatInput'

export const Chat = ({
  title,
  id,
  from,
  img = '/assets/Logo_RemovedBG.png',
}: {
  title: string
  id: string
  from?: string
  img?: string
}) => {
  const [selected, setSelected] = useState({
    loading: false,
    id: '',
  })

  useEffect(() => {
    setSelected({
      id: '',
      loading: true,
    })
    setTimeout(() => {
      setSelected({
        id,
        loading: false,
      })
    }, 300)
  }, [id])

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, overflow: 'auto' }} flex={1}>
      {selected.id && !selected.loading ? (
        <>
          <Flex sx={{ gap: 2, alignItems: 'center' }} mb={2}>
            <Image
              src={img || '/assets/Logo_RemovedBGs.png'}
              size={64}
              sx={{ borderRadius: '100%' }}
              alt="logo"
            />
            <Text as={'h2'}>{title}</Text>
          </Flex>

          <ChatMessages id={id} from={from ?? id} />
        </>
      ) : (
        <Flex flex={1}></Flex>
      )}

      <ChatInput id={id} from={from ?? id} />
    </Flex>
  )
}
