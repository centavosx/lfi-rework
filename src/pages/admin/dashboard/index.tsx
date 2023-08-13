import { ReactNode, useMemo, useEffect } from 'react'
import { Flex, SxStyleProp, Text } from 'rebass'
import { BarGraph, XAndY } from 'components/chart'
import { theme } from 'utils/theme'
import { ListContainer } from 'components/ul'
import { useApi, useUser } from 'hooks'
import { getDashboard } from 'api/dashboard.api'
import { Loading } from 'components/loading'
import { format } from 'date-fns'
import { Event } from 'components/calendar'
import { NextPage } from 'next'
import { UserStatus } from 'entities'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { useRouter } from 'next/router'
import { useRouter as useNav } from 'next/navigation'

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

const Display = {
  employee: {
    name: 'Employees',
    color: '#060463',
    text: 'black',
  },

  applicant: {
    name: 'Applicants',
    color: '#5856a8',
    text: 'black',
  },

  scholar: {
    name: 'Scholars',
    color: '#054a0f',
    text: 'black',
  },

  shsGraduate: {
    name: 'Senior High Graduates',
    color: '#d4d006',
    text: 'black',
  },

  collegeGraduate: {
    name: 'College Graduates',
    color: '#ADD8E6',
    text: 'black',
  },
  expelled: {
    name: 'Expelled',
    color: '#ad0303',
    text: 'black',
    borderWidth: 1,
    borderColor: 'black',
  },
}

type DashboardProps<T extends string = string> = {
  graphValues: { x: string; y: T }[]
  userCounts: {
    name:
      | 'employee'
      | 'applicant'
      | 'scholar'
      | 'shsGraduate'
      | 'collegeGraduate'
      | 'expelled'
    count: T
  }[]
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

export default function Dashboard({
  statusParams,
  isCollege,
}: NextPage & { statusParams?: UserStatus; isCollege: string }) {
  const { user } = useUser()
  const { asPath } = useRouter()
  const { replace } = useNav()
  const { data, isFetching, refetch } = useApi<DashboardProps>(
    getDashboard,
    false,
    {
      status:
        statusParams === UserStatus.EXPELLED ||
        statusParams === UserStatus.ACTIVE
          ? statusParams
          : UserStatus.ACTIVE,
      isCollege,
    }
  )
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

  useEffect(() => {
    refetch({
      status:
        statusParams === UserStatus.EXPELLED ||
        statusParams === UserStatus.ACTIVE
          ? statusParams
          : UserStatus.ACTIVE,
      isCollege,
    })
  }, [asPath])

  return (
    <Flex sx={{ height: '100%', gap: 3 }} flexDirection={'column'} padding={3}>
      {isFetching && <Loading />}
      <Flex
        flexDirection={['column', 'column', 'row']}
        sx={{ gap: 4, height: 'auto' }}
      >
        <Flex flex={[1, 0.35]} flexDirection={'column'} sx={{ gap: 2 }}>
          <Text as={'h2'} mb={4}>
            Welcome {user?.lname}, {user?.fname} {user?.mname}
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
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={isCollege || statusParams || UserStatus.ACTIVE}
              onChange={(v) => {
                replace(
                  v.target.value === 'true' || v.target.value === 'false'
                    ? '/admin/dashboard/?isCollege=' + v.target.value
                    : '/admin/dashboard/?status=' + v.target.value
                )
                // v.target.value ==== 'true' || v.target.value === 'false'?:'/admin/dashboard/?status='+v.target.value
              }}
            >
              <FormControlLabel
                value={UserStatus.ACTIVE}
                control={<Radio />}
                label="All"
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="College Graduate"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Shs Graduate"
              />
              <FormControlLabel
                value={UserStatus.EXPELLED}
                control={<Radio />}
                label="Expelled"
              />
            </RadioGroup>
          </FormControl>
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
                  backgroundColor:
                    statusParams === UserStatus.EXPELLED
                      ? 'red'
                      : theme.colors.green,
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
        {data?.userCounts
          .filter(
            (v) =>
              v.name === 'applicant' ||
              v.name === 'scholar' ||
              v.name === 'employee'
          )
          .map((v, i) => {
            return (
              <ColoredContainer
                key={i}
                color={Display[v.name as keyof typeof Display].color}
                sx={{ gap: 3, padding: 3, flex: 1 }}
              >
                <Text
                  as="h4"
                  color={Display[v.name as keyof typeof Display].text}
                >
                  Number of {Display[v.name as keyof typeof Display].name}
                </Text>
                <Text
                  as="h1"
                  textAlign={'end'}
                  color={Display[v.name as keyof typeof Display].text}
                >
                  {v.count ?? 0}
                </Text>
              </ColoredContainer>
            )
          })}
      </Flex>
      <Flex
        sx={{ gap: 3, padding: 3, height: 'auto' }}
        flexDirection={['column', 'column', 'row']}
      >
        {data?.userCounts
          .filter(
            (v) =>
              v.name !== 'applicant' &&
              v.name !== 'scholar' &&
              v.name !== 'employee'
          )
          .map((v, i) => {
            return (
              <ColoredContainer
                key={i}
                color={Display[v.name as keyof typeof Display].color}
                sx={{ gap: 3, padding: 3, flex: 1 }}
              >
                <Text
                  as="h4"
                  color={Display[v.name as keyof typeof Display].text}
                >
                  Number of {Display[v.name as keyof typeof Display].name}
                </Text>
                <Text
                  as="h1"
                  textAlign={'end'}
                  color={Display[v.name as keyof typeof Display].text}
                >
                  {v.count ?? 0}
                </Text>
              </ColoredContainer>
            )
          })}
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(context: any) {
  let statusParams: string = context.query.status || ''
  let isCollege: string =
    context.query.isCollege === 'true' || context.query.isCollege === 'false'
      ? context.query.isCollege
      : ''

  return {
    props: { statusParams, isCollege },
  }
}
