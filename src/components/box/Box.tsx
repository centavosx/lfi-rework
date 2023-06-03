import { Box as BoxComponent, BoxProps } from '@mui/material'
import { Flex, FlexProps } from 'rebass'
export const Box = ({
  sx,
  children,
  flexProps,
  ...others
}: BoxProps & { flexProps?: FlexProps }) => {
  return (
    <BoxComponent
      sx={{
        padding: 2,
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        borderRadius: 1,
        width: 200,
        height: 200,
        overflow: 'auto',
        ...sx,
      }}
      {...others}
    >
      <Flex
        width={'100%'}
        sx={{ flexDirection: 'column', gap: 1 }}
        {...flexProps}
      >
        {children}
      </Flex>
    </BoxComponent>
  )
}

export const BoxContainer = ({ children, ...others }: FlexProps) => {
  return (
    <Flex
      sx={{ gap: 2, flexWrap: 'wrap' }}
      justifyContent={'center'}
      {...others}
    >
      {children}
    </Flex>
  )
}
