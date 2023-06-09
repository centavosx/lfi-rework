import { PageLoading } from 'components/loading'
import { useUser, useUserGuard } from 'hooks'
import { Flex, Text } from 'rebass'

export default function Waiting() {
  const { user } = useUser()
  const { isLoading, isReplacing, isUser } = useUserGuard()

  if (isLoading || isReplacing || !isUser) return <PageLoading />

  return (
    <Flex flexDirection={'column'} sx={{ width: '100%' }}>
      <Text>
        Hi!{' '}
        <b>
          {user?.lname}, {user?.fname} {user?.mname}
        </b>
        , thank you for signing up to our scholarship program but we need to
        process your account before you can proceed, we'll email or notify you
        once you got accepted. Thank you so much!
      </Text>
    </Flex>
  )
}
