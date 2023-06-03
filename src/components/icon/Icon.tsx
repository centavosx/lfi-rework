import { Flex, Image, ImageProps, Text, TextProps, FlexProps } from 'rebass'
export const Icon = ({
  sx,
  image: { sx: sxImage, ...othersImage },
  ...others
}: FlexProps & { image: ImageProps }) => {
  return (
    <Flex
      sx={{
        height: 100,
        width: 100,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: '100%',
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',

        ...sx,
      }}
      {...others}
    >
      <Image
        sx={{
          height: '100%',
          width: '100%',
          ...sxImage,
        }}
        alt={'icon'}
        {...othersImage}
      />
    </Flex>
  )
}

export const ServiceIcon = ({
  imageProps,
  flexProps,
  children,
  ...others
}: {
  imageProps?: FlexProps & { image: ImageProps }
  flexProps?: FlexProps
} & TextProps) => {
  const { sx, ...otherFlex } = flexProps ?? { sx: undefined }
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        ...sx,
      }}
      {...otherFlex}
    >
      {!!imageProps?.image && <Icon {...imageProps} />}
      <Text {...others}>{children}</Text>
    </Flex>
  )
}
