import { Flex, Image, Link as Anchor, FlexProps } from 'rebass'
import { theme } from '../../utils/theme'

import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useRouter } from 'next/router'
import { AdminWebNavigation } from 'components/navigation/admin'

const SideNav = () => {
  return (
    <Header
      sx={{
        gap: 2,
        alignSelf: 'start',
        justifyContent: 'start',
        transition: 'all 0.2s ease-in-out',
        borderRightWidth: 2,
        borderRightColor: 'black',
        borderRightStyle: 'solid',
      }}
      flexDirection="column"
      pt={30}
      width={250}
      height={'100vh'}
    >
      <Flex
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Anchor href="/admin">
          <Flex alignItems={'center'} sx={{ gap: 2 }}>
            <Image
              src={'/assets/logo-white.png'}
              width={60}
              height={60}
              minWidth={'auto'}
              alt="image"
            />

            <Text
              sx={{
                fontSize: [14, 18],
                fontWeight: 350,
                color: theme.colors.white80,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: theme.colors.white,
                }}
              >
                LAO
              </span>
              FOUNDATION
            </Text>
          </Flex>
        </Anchor>
      </Flex>
      <Flex
        sx={{
          gap: 1,
          pt: 15,
          flexDirection: 'column',
          alignSelf: 'start',
          width: '100%',
        }}
      >
        <AdminWebNavigation />
      </Flex>
    </Header>
  )
}

export const AdminMain = ({
  pageTitle,
  children,
}: { pageTitle?: string } & FlexProps) => {
  const { pathname } = useRouter()

  return (
    <>
      <BaseHead
        title="Lao Foundation Admin"
        pageTitle={pageTitle}
        description="Scholarships"
      />
      <Flex
        width={'100vw'}
        backgroundColor={theme.colors.green}
        height={'100vh'}
      >
        <Flex
          flexDirection={'row'}
          sx={{
            position: 'relative',
          }}
          alignSelf="start"
          justifyContent={'start'}
          width={'100vw'}
          backgroundColor={theme.colors.green}
        >
          <SideNav />
          <Flex
            flex={1}
            height={'100vh'}
            width={'100%'}
            overflow={'auto'}
            flexDirection={'column'}
            backgroundColor={pathname === '/' ? 'white' : theme.colors.white}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
