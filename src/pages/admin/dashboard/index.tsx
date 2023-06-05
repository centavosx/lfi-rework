import { ReactNode } from 'react'
import { Flex, SxStyleProp, Text } from 'rebass'
import { BarGraph } from 'components/chart'
import { AdminMain } from 'components/main'
import { theme } from 'utils/theme'
import { ListContainer, ListItem } from 'components/ul'

const ColoredContainer = ({
  color,
  sx,
  children,
}: {
  color: string
  sx?: SxStyleProp
  children?: ReactNode
}) => {
  return (
    <Flex
      backgroundColor={color}
      sx={{ flexDirection: 'column', borderRadius: 8, padding: 2, ...sx }}
    >
      {children}
    </Flex>
  )
}

export default function Admin() {
  return (
    <AdminMain>
      <Flex
        sx={{ height: '100%', gap: 3 }}
        flexDirection={'column'}
        padding={3}
      >
        <Flex
          flexDirection={['column', 'column', 'row']}
          sx={{ gap: 4, height: 'auto' }}
        >
          <Flex flex={[1, 0.35]} flexDirection={'column'} sx={{ gap: 2 }}>
            <Text as={'h2'} mb={4}>
              Welcome Vincent
            </Text>
            <Flex flex={1} flexDirection={'column'}>
              <Text as={'h4'} width={'100%'}>
                Upcoming events
              </Text>
              <hr style={{ width: '100%' }} />
              <ListContainer>
                <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
                <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
              </ListContainer>
            </Flex>
          </Flex>
          <Flex
            flex={[1, 0.65]}
            flexDirection={'column'}
            height={'100%'}
            sx={{ gap: 4 }}
          >
            <Text as={'h3'}>Number of Scholars per Year</Text>
            <Text>Select, Select</Text>
            <Flex height={[300, 300, 400]}>
              <BarGraph
                xValues={Array(30).fill({ x: '2022', y: 10 })}
                maxY={10}
                yLabelCount={3}
                style={{
                  yLabel: {
                    fontFamily: 'Roboto-Regular',
                    color: theme.colors.black,
                    fontWeight: '400',
                    fontSize: 11,
                  },
                  xLabel: {
                    fontFamily: 'Roboto-Regular',
                    color: theme.colors.black,
                    fontWeight: '400',
                    fontSize: 11,
                  },
                  bar: {
                    color: theme.colors.black,
                    width: '80%',
                    maxWidth: 80,
                    alignSelf: 'center',
                    backgroundColor: theme.colors.green,
                  },

                  avgLineColor: theme.colors.black,
                }}
                formatXLabel={({ x }, i) => {
                  return x
                }}
                formatYLabel={(y) => y.toFixed(1)}
                avg={8}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex
          sx={{ gap: 3, padding: 3, height: 'auto' }}
          flexDirection={['column', 'column', 'row']}
        >
          <ColoredContainer color="yellow" sx={{ gap: 3, padding: 3, flex: 1 }}>
            <Text as="h4">Number of Applicants</Text>
            <Text as="h1" textAlign={'end'}>
              12345
            </Text>
          </ColoredContainer>
          <ColoredContainer
            color={theme.colors.green}
            sx={{ gap: 3, padding: 3, flex: 1 }}
          >
            <Text as="h4">Number of scholars</Text>
            <Text as="h1" textAlign={'end'}>
              12345
            </Text>
          </ColoredContainer>
          <ColoredContainer color={'blue'} sx={{ gap: 3, padding: 3, flex: 1 }}>
            <Text as="h4">Number of scholars</Text>
            <Text as="h1" textAlign={'end'}>
              12345
            </Text>
          </ColoredContainer>
        </Flex>
      </Flex>
    </AdminMain>
  )
}
