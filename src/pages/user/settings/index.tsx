import { Section } from 'components/sections'
import { useUser } from 'hooks'
import { Flex } from 'rebass'

export default function Settings() {
  const { user } = useUser()

  return (
    <Flex sx={{ width: '100%' }}>
      <Section
        title="Settings"
        textProps={{ textAlign: 'start', as: 'h2' }}
      ></Section>
    </Flex>
  )
}
