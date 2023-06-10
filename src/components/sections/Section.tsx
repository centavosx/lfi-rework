import { Loading } from 'components/loading'
import { Flex, FlexProps, TextProps, Text } from 'rebass'

export const Section = ({
  title,
  children,
  textProps,
  contentProps,
  isFetching,
  ...other
}: {
  title?: string
  textProps?: TextProps
  contentProps?: FlexProps
  isFetching?: boolean
} & FlexProps) => {
  return (
    <Flex
      padding={[10, 30]}
      alignItems={'center'}
      flexDirection="column"
      width={'100%'}
      height={'100%'}
      sx={{ gap: 4 }}
      {...other}
    >
      {!!title && (
        <Text
          as={'h1'}
          width={'100%'}
          textAlign="center"
          color={'black'}
          {...textProps}
        >
          {title}
        </Text>
      )}
      {isFetching && <Loading />}
      <Flex
        alignItems={'center'}
        flexDirection="column"
        width={'100%'}
        color="black"
        sx={{ gap: 4 }}
        {...contentProps}
      >
        {children}
      </Flex>
    </Flex>
  )
}
