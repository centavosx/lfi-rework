import { SecondaryButton } from 'components/button'
import { Button, Flex, Text } from 'rebass'

export const AreYouSure = ({
  message,
  onClick,
}: {
  message: string
  onClick?: (v: boolean) => void
}) => {
  return (
    <Flex sx={{ gap: 2 }} flexDirection={'column'}>
      <Text as={'h5'}>{message}</Text>
      <Flex sx={{ gap: 3 }}>
        <Button onClick={() => onClick?.(true)}>Yes</Button>
        <SecondaryButton onClick={() => onClick?.(false)}>No</SecondaryButton>
      </Flex>
    </Flex>
  )
}
