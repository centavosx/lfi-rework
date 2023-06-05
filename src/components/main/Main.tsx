import { Flex, Image, Link as Anchor, FlexProps } from 'rebass'
import Navigation from '../navigation'

import { theme } from '../../utils/theme'

import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useUser } from 'hooks'
import { NotifButton } from 'components/button'
import { CustomModal } from 'components/modal'
import { Chat, ChatMessages } from 'components/chat'

export const Main = ({
  pageTitle,
  children,
}: { pageTitle?: string } & FlexProps) => {
  const { user } = useUser()

  return (
    <>
      <BaseHead
        title="Lao Foundation"
        pageTitle={pageTitle}
        description="Scholarships"
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
            <Flex
              flexDirection={['row', 'row-reverse']}
              sx={{ gap: 2, alignItems: 'center' }}
            >
              {!!user && (
                <Flex
                  flexDirection={['row', 'row-reverse']}
                  sx={{ gap: [3, 4, 4], mr: 2 }}
                >
                  <NotifButton
                    src={'/assets/icons/bell.png'}
                    width={18}
                    height={18}
                    minWidth={'auto'}
                    alt="image"
                    notifNumber={1232}
                    modalContainerProps={{
                      sx: {
                        right: [-10, 0],
                      },
                    }}
                    displayModal={(close) => {
                      return (
                        <Flex
                          sx={{
                            width: [200, 250],
                            maxHeight: 550,
                            flexDirection: 'column',
                            gap: 2,
                            border: '1px solid gray',
                            borderRadius: 3,
                            marginTop: 1,
                            paddingTop: 2,
                            paddingBottom: 2,
                            zIndex: 9999,
                            backgroundColor: theme.colors.white,
                          }}
                        >
                          <Text
                            sx={{
                              ':hover': {
                                backgroundColor: theme.colors.green,
                                color: theme.colors.white,
                              },
                              color: theme.colors.black,
                              width: '100%',
                              padding: '6px',
                              cursor: 'pointer',
                            }}
                            onClick={async () => {
                              // await push(textLink + 'login', {
                              //   query: {
                              //     who: 'Scholar',
                              //   },
                              // })
                              close()
                            }}
                          >
                            For Scholar
                          </Text>
                        </Flex>
                      )
                    }}
                  />
                  <CustomModal
                    modalChild={() => {
                      return <Chat title="Your messages" />
                    }}
                    maxHeight={'80%'}
                    maxWidth={2250}
                    isModalOverFlow={false}
                  >
                    {({ setOpen }) => (
                      <Flex
                        width={18}
                        height={18}
                        sx={{
                          position: 'relative',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                        minWidth={'auto'}
                      >
                        <Image
                          src={'/assets/icons/chat.png'}
                          width={'100%'}
                          height={'100%'}
                          alt="image"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setOpen((v) => !v)}
                        />
                        {/* {!!notifNumber && (
                          <Text
                            sx={{
                              top: -10,
                              position: 'absolute',
                              right: -10,
                              fontSize: 12,
                              color: theme.colors.darkestGreen,
                              fontWeight: 600,
                            }}
                          >
                            {notifNumber}
                          </Text>
                        )} */}
                      </Flex>
                    )}
                  </CustomModal>
                </Flex>
              )}
              <WebView>
                <Flex sx={{ gap: 16, padding: 15 }}>
                  <Navigation.WebNavigation />
                </Flex>
              </WebView>
              <MobileView>
                <Navigation.MobileNavigation />
              </MobileView>
            </Flex>
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
              position: 'relative',
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
