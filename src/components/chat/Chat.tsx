import { memo } from 'react'
import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'
import { format } from 'date-fns'
import { Input } from 'components/input'
import { Button } from 'components/button'

export const ChatMessages = () => {
  return (
    <Flex
      flexDirection="column"
      padding={2}
      sx={{ borderRadius: 8, overflowY: 'scroll' }}
      flex={1}
    >
      {Array(100)
        .fill(null)
        .map((_, i) => (
          <UserMessage
            message="dwadwa"
            key={i}
            isUser={i % 2 === 0}
            date={new Date()}
          />
        ))}
      <UserMessage message="dwadwa" isUser={true} date={new Date()} />
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
  return (
    <Flex
      width={'45%'}
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      justifyContent={isUser ? 'flex-end' : undefined}
      flexDirection={'column'}
      alignItems={isUser ? 'flex-end' : 'flex-start'}
    >
      <Flex>
        <Text
          width={'auto'}
          alignItems={isUser ? 'flex-end' : 'flex-start'}
          color={isUser ? theme.colors.black : theme.colors.white}
          padding={2}
          backgroundColor={
            isUser ? theme.colors.white : theme.colors.darkerGreen
          }
          sx={{
            borderRadius: 8,
            ...(isUser
              ? {
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: theme.colors.darkestGreen,
                  justifyContent: 'flex-end',
                }
              : {}),
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

const ChatInput = memo(() => {
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
      />
      <Button style={{ width: 50, height: 40 }}>Send</Button>
    </Flex>
  )
})

ChatInput.displayName = 'ChatInput'

export const Chat = ({ title }: { title: string }) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, overflow: 'auto' }} flex={1}>
      <Text as={'h2'}>{title}</Text>
      <ChatMessages />
      <ChatInput />
    </Flex>
  )
}
