import { Flex, SxStyleProp } from 'rebass'

export const Collage = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: SxStyleProp
}) => {
  return (
    <Flex
      flexDirection={'row'}
      sx={{ gap: 2, ...style }}
      flexWrap={'wrap'}
      justifyContent={'center'}
    >
      {children}
    </Flex>
  )
}
