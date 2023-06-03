import styled from '@emotion/styled'

import { Flex, FlexProps, Image, ImageProps } from 'rebass'

const HoverContent = styled(Flex)`
  && {
    position: relative;
    div:nth-child(2) {
      display: none;
    }
    :hover {
      div:nth-child(2) {
        height: 100%;
        width: 100%;
        text-align: center;
        justify-content: center;
        align-items: center;
        background-color: rgba(1, 1, 1, 0.5);
        display: flex;
      }
    }
  }
`

export const Content = ({
  children,
  image: { src, alt, height, width, ...others },
}: FlexProps & { image: ImageProps }) => {
  return (
    <HoverContent>
      <Image
        src={src}
        width={width ?? '100%'}
        height={height ?? '100%'}
        alt={alt}
        {...others}
      />
      <Flex
        sx={{
          position: 'absolute',
        }}
      >
        {children}
      </Flex>
    </HoverContent>
  )
}
