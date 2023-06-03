import React, { memo, useState, ReactNode } from 'react'
import { Flex } from 'rebass'
import { Button, ButtonProps, DownArrow } from './Button'

export const ButtonDropdown = memo(
  ({ children, display, ...rest }: ButtonProps & { display?: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Flex style={{ position: 'relative', width: 'auto', height: 'auto' }}>
        <Button {...rest} onClick={() => setIsOpen((v) => !v)}>
          {children} {<DownArrow />}
        </Button>
        {isOpen && (
          <Flex
            sx={{
              position: 'absolute',
              top: '100%',
              width: 'auto',
              height: 'auto',
              right: 0,
              zIndex: 9999,
            }}
          >
            {display}
          </Flex>
        )}
      </Flex>
    )
  }
)
