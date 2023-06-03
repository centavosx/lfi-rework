import { Flex, Image, Link as Anchor, FlexProps } from 'rebass'
import Wave from 'react-wavify'
import Navigation from '../navigation'

import { theme } from '../../utils/theme'

import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useRouter } from 'next/router'

export const Main = ({
  pageTitle,
  children,
  isLink,
}: { pageTitle?: string; isLink?: boolean } & FlexProps) => {
  return (
    <>
      <BaseHead
        title="Lao Foundation"
        pageTitle={pageTitle}
        description="Set your appointment now"
      />
      <Flex
        width={'100%'}
        sx={{ height: '100%', flexDirection: 'column' }}
        justifyContent="center"
        backgroundColor={theme.colors.white}
      >
        <Flex
          sx={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            backgroundColor: theme.colors.white,
          }}
        >
          <Header
            justifyContent={'start'}
            sx={{
              gap: 2,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: '8px',
              paddingBottom: '8px',
              width: '100%',
              zIndex: 99,
            }}
            maxWidth={2250}
            alignSelf="center"
          >
            <Flex flex={1} sx={{ justifyContent: 'start' }}>
              <Anchor href="/" sx={{ mr: [null, 4] }}>
                <Flex alignItems={'center'} sx={{ gap: 1 }}>
                  <Image
                    src={'/assets/logo.png'}
                    width={50}
                    height={50}
                    minWidth={'auto'}
                    alt="image"
                  />
                  <Text
                    sx={{
                      fontSize: [14, 18],
                      fontWeight: 350,
                      color: theme.colors.green,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: theme.colors.darkGreen,
                      }}
                    >
                      LAO
                    </span>
                    FOUNDATION
                  </Text>
                </Flex>
              </Anchor>
            </Flex>
            <WebView>
              <Flex sx={{ gap: 16, padding: 15 }}>
                <Navigation.WebNavigation isLink={isLink} />
              </Flex>
            </WebView>
            <MobileView>
              <Navigation.MobileNavigation isLink={isLink} />
            </MobileView>
          </Header>
        </Flex>
        <Flex
          sx={{
            gap: 2,
            backgroundColor: theme.colors.white,
            height: '100%',
            overflow: 'auto',
            width: '100%',
            flexDirection: 'column',
          }}
          maxWidth={2250}
          alignSelf="center"
        >
          {children}
        </Flex>
        <Flex
          sx={{
            height: 'auto',
            width: '100%',
            flexDirection: 'column',
            backgroundColor: theme.colors.darkestGreen,
          }}
        >
          <Header
            id={'footer'}
            sx={{
              gap: 2,
              padding: 20,
              width: '100%',
            }}
            maxWidth={2250}
            alignSelf="center"
          >
            <Flex
              flex={1}
              flexDirection={['column', 'row']}
              sx={{
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Image
                src={'/assets/logo-white.png'}
                width={50}
                height={50}
                mr={[0, 4]}
                minWidth={'auto'}
                alt="image"
              />

              <Flex
                flex={0.8}
                flexDirection={'column'}
                sx={{ gap: '2px' }}
                textAlign={['center', 'left']}
              >
                <Text as={'h5'}>ADDRESS</Text>
                <Text>
                  65 Colle Industria Bagumbayan Quezon City 1110, Philippines
                </Text>
              </Flex>
              <Flex
                flex={0.8}
                flexDirection={'column'}
                sx={{ gap: 2 }}
                textAlign={['center', 'left']}
              >
                <Text as={'h5'}>CONTACT US</Text>
                <Text>hello@thelaoufoundation.org</Text>
                <Text>+63 2 8635 0680</Text>
              </Flex>
              <Flex
                flex={0.2}
                flexDirection={'column'}
                textAlign={['center', 'left']}
                sx={{ gap: 2 }}
              >
                <Text as={'h5'}>Follow US</Text>
                <Flex width={'100%'} flexDirection={'row'} sx={{ gap: 2 }}>
                  <Image
                    height={24}
                    width={24}
                    src={'/assets/fb.png'}
                    minWidth={'auto'}
                    color={'white'}
                    alt="image"
                  />
                  <Image
                    height={24}
                    width={24}
                    src={'/assets/ig.png'}
                    minWidth={'auto'}
                    alt="image"
                  />
                </Flex>
              </Flex>
            </Flex>
          </Header>
        </Flex>
      </Flex>
    </>
  )
}
