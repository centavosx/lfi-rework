import { Flex, Text } from 'rebass'
import { Main } from '../../components/main'

export default function Success() {
  return (
    <Main isLink={true}>
      <Flex
        flexDirection={'column'}
        flex={1}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text>Payment Successful</Text>
      </Flex>
    </Main>
  )
}
