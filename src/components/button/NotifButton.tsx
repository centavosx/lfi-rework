import React, { memo, ReactNode } from 'react'
import { Flex, FlexProps, Image, ImageProps, Text } from 'rebass'

import { useComponentVisible } from './ButtonDropdown'
import { theme } from 'utils/theme'

export const NotifButton = memo(
  ({
    displayModal,
    src,
    width,
    height,
    notifNumber,
    modalContainerProps,
    ...rest
  }: ImageProps & {
    modalContainerProps?: FlexProps
    displayModal?: ((v: () => void) => ReactNode) | ReactNode
    notifNumber?: number
  }) => {
    const { ref, isComponentVisible, setIsComponentVisible } =
      useComponentVisible(false)

    return (
      <Flex style={{ position: 'relative', width: 'auto', height: 'auto' }}>
        <Flex
          width={width}
          height={height}
          sx={{
            position: 'relative',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          minWidth={'auto'}
        >
          <Image
            src={src}
            width={'100%'}
            height={'100%'}
            alt="image"
            style={{ cursor: 'pointer' }}
            {...rest}
            onClick={() => setIsComponentVisible((v) => !v)}
          />
          {!!notifNumber && (
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
          )}
        </Flex>
        <Flex
          {...modalContainerProps}
          sx={{
            position: 'absolute',
            top: '100%',
            width: 'auto',
            height: 'auto',
            right: 0,
            zIndex: 9999,
            ...(modalContainerProps?.sx ?? {}),
          }}
          ref={ref}
        >
          {isComponentVisible &&
            (!!displayModal && typeof displayModal === 'function'
              ? displayModal(() => setIsComponentVisible(false))
              : displayModal)}
        </Flex>
      </Flex>
    )
  }
)

NotifButton.displayName = 'Notif'
