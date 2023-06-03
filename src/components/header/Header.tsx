import { Flex, FlexProps, Text } from 'rebass'

export const Header = ({ children, sx, ...other }: FlexProps) => {
  return (
    <Flex
      flexDirection={'row'}
      sx={{
        gap: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 2,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Flex>
  )
}
