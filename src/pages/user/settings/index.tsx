import { Section } from 'components/sections'
import { UserInformation } from 'components/user-admin-comps'
import { useUser } from 'hooks'
import { Flex } from 'rebass'

export default function Settings() {
  const { user } = useUser()

  return (
    <Flex sx={{ width: '100%' }}>
      <Section
        title="Settings"
        textProps={{ textAlign: 'start', as: 'h2' }}
        contentProps={{ width: '100%', pl: [16, '5%'], pr: [16, '5%'] }}
      >
        <UserInformation id={user?.id ?? ''} isUser={true} />
      </Section>
    </Flex>
  )
}
