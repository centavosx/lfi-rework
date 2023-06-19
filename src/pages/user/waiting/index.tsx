import { useUser } from 'hooks'
import { Flex, Text } from 'rebass'

export default function Waiting() {
  const { user } = useUser()

  return (
    <Flex
      flexDirection={'column'}
      sx={{
        width: '100%',
        height: '100%',
        padding: 3,
        gap: 3,

        alignItems: 'center',
      }}
    >
      <Text as={'h1'}>Thank you for signing up!</Text>
      <Text>
        Hi!{' '}
        <b>
          {user?.lname}, {user?.fname} {user?.mname}
        </b>
        , thank you for signing up to our scholarship program but we need to
        process your account before you can proceed, {"we'll"} email or notify
        you once you got accepted. Thank you so much! <br />
        <br /> If you received an email and a password, please logout and login
        again using that account.
      </Text>
    </Flex>
  )
}
