import { ReactNode, useMemo } from 'react'
import { Flex, SxStyleProp, Text } from 'rebass'
import { BarGraph, XAndY } from 'components/chart'
import { AdminMain } from 'components/main'
import { theme } from 'utils/theme'
import { ListContainer, ListItem } from 'components/ul'
import { useApi } from 'hooks'
import { getDashboard } from 'api/dashboard.api'
import { Loading } from 'components/loading'
import { format } from 'date-fns'
import { Event } from 'components/calendar'

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

type DashboardProps<T extends string = string> = {
  graphValues: { x: string; y: T }[]
  userCounts: { name: 'employee' | 'applicant' | 'user'; count: T }[]
  upcomingEvents: {
    id: string
    name: string
    description: string
    color: string
    startDate: string
    endDate: string
    created: string
    modified: string
  }[]
}

const getMaximum = (max: number) => {
  const v = [2, 4, 10]
  let count = 10
  let maximum = 0
  let temp = 0
  let curr = count

  while (maximum === 0) {
    for (const n of v) {
      if ((temp === 0 && max <= curr) || (max > temp && max <= curr)) {
        maximum = curr
        break
      }
      temp = curr
      curr = count * n
    }
    count = curr
  }

  return maximum
}

export default function Dashboard() {
  const { data, isFetching } = useApi<DashboardProps>(getDashboard)
  const max = getMaximum(
    Number(
      data?.graphValues?.sort((a, b) => Number(b.y) - Number(a.y))?.[0]?.y ?? 0
    )
  )

  const xAndYArr = useMemo(() => {
    const xAndY = data?.graphValues
    const defaultVal: XAndY<string>[] = [
      { x: '2020', y: 0 },
      { x: '2021', y: 0 },
      { x: '2022', y: 0 },
      { x: '2023', y: 0 },
    ]
    if (!xAndY) return defaultVal

    const mapped = new Map<string, { index: number; value: number }>()

    defaultVal.forEach((v, i) => {
      mapped.set(v.x, { index: i, value: v.y })
    })

    return xAndY.reduce((arr: any, curr: any) => {
      const val = mapped.get(curr.x)
      if (!val) {
        mapped.set(curr.x, {
          index: arr.length,
          value: Number(curr.y),
        })
        return [...arr, { x: curr.x, y: Number(curr.y) }]
      }
      arr[val.index].y += Number(curr.y)
      return arr
    }, defaultVal) as XAndY<string>[]
  }, [data?.graphValues])

  return (
    <Flex sx={{ height: '100%', gap: 3 }} flexDirection={'column'} padding={3}>
      {isFetching && <Loading />}
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
              Upcoming events ({data?.upcomingEvents.length ?? 0})
            </Text>
            <hr style={{ width: '100%' }} />
            <ListContainer>
              {data?.upcomingEvents.map((v) => {
                const startDate = new Date(v.startDate)
                const endDate = new Date(v.endDate)

                const start = format(startDate, `LLLL d'@'hh:mm a`)
                const end = format(endDate, `LLLL d'@'hh:mm a`)
                return (
                  <Event
                    key={v.id}
                    eventName={v.name}
                    from={start}
                    to={end}
                    description={v.description}
                  />
                )
              })}
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
            <BarGraph<string>
              xValues={xAndYArr}
              maxY={max}
              yLabelCount={3}
              style={{
                barContainer: { borderRadius: 4 },
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
                  border: '1px solid black',
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
              avg={
                xAndYArr.reduce((acc, cur) => acc + Number(cur.y), 0) /
                xAndYArr.length
              }
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
            {data?.userCounts.find((v) => v.name === 'applicant')?.count || 0}
          </Text>
        </ColoredContainer>
        <ColoredContainer
          color={theme.colors.green}
          sx={{ gap: 3, padding: 3, flex: 1 }}
        >
          <Text as="h4" color={'white'}>
            Number of scholars
          </Text>
          <Text as="h1" textAlign={'end'} color={'white'}>
            {data?.userCounts.find((v) => v.name === 'user')?.count || 0}
          </Text>
        </ColoredContainer>
        <ColoredContainer color={'blue'} sx={{ gap: 3, padding: 3, flex: 1 }}>
          <Text as="h4" color={'white'}>
            Number of employees
          </Text>
          <Text as="h1" textAlign={'end'} color={'white'}>
            {data?.userCounts.find((v) => v.name === 'employee')?.count || 0}
          </Text>
        </ColoredContainer>
      </Flex>
    </Flex>
  )
}
