import { Flex, Text, FlexProps, TextProps } from 'rebass'
import { theme } from 'utils/theme'

export type BoxWithTitleProps = FlexProps & {
  title?: string
  titleProps?: TextProps
  innerBoxProps?: FlexProps
}

export const BoxWithTitle = ({
  children,
  title,
  titleProps,
  innerBoxProps,
  ...rest
}: BoxWithTitleProps) => {
  return (
    <Flex
      sx={{
        borderWidth: 1,
        borderColor: theme.colors.green,
        borderStyle: 'solid',
        borderRadius: 10,
        flexDirection: 'column',
      }}
      {...rest}
    >
      {!!title && (
        <Text
          as={'h4'}
          sx={{
            padding: 3,
            borderBottomWidth: 1,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderColor: theme.colors.blackgray,
            borderStyle: 'solid',
          }}
          color={theme.colors.black}
          {...titleProps}
        >
          {title}
        </Text>
      )}
      <Flex padding={4} {...innerBoxProps}>
        {children}
      </Flex>
    </Flex>
  )
}
