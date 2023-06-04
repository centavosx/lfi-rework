import {
  useCallback,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  memo,
} from 'react'

import Modal from '@mui/material/Modal'
import { Button, ButtonProps, SecondaryButton } from 'components/button'
import { AiOutlineClose } from 'react-icons/ai'
import { Flex, TextProps, Text } from 'rebass'

type ChildProps = {
  isOpen: boolean
  onSubmit: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const ButtonModal = memo(
  ({
    className,
    sx,
    title,
    children,
    modalChild,
    onSubmit,
    maxHeight,
    isSecondary,
    width,
    maxWidth,
    titleProps,
    ...props
  }: ButtonProps & {
    modalChild?: ((props: ChildProps) => ReactNode) | ReactNode
    onSubmit?: () => void
    maxHeight?: string[] | number[] | number | string
    width?: string[] | number[] | number | string
    maxWidth?: string[] | number[] | number | string
    isSecondary?: boolean
    titleProps?: TextProps
  }) => {
    const [open, setOpen] = useState<boolean>(false)

    const onSubmitSuccess = useCallback(() => {
      onSubmit?.()
      setOpen(false)
    }, [onSubmit, setOpen])

    return (
      <>
        {isSecondary ? (
          <SecondaryButton
            className={className}
            onClick={() => setOpen(true)}
            {...props}
          >
            {children}
          </SecondaryButton>
        ) : (
          <Button
            className={className}
            onClick={() => setOpen(true)}
            {...props}
          >
            {children}
          </Button>
        )}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Flex
            sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: width ?? ['80%', '80%'],
              maxWidth: maxWidth,
              height: 'auto',
              maxHeight: maxHeight ?? ['80%', 'unset'],
              backgroundColor: 'white',
              border: '1px solid gray',
              borderRadius: '10px',
              boxShadow: 24,
              overflow: 'auto',
              p: 4,
              flexDirection: 'column',
            }}
          >
            <Flex sx={{ mb: 2 }} flex={1}>
              <Text flex={1} {...titleProps}>
                {title}
              </Text>
              <AiOutlineClose
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen(false)}
              />
            </Flex>
            {open &&
              (typeof modalChild === 'function'
                ? modalChild({
                    onSubmit: onSubmitSuccess,
                    isOpen: open,
                    setOpen,
                  })
                : modalChild)}
          </Flex>
        </Modal>
      </>
    )
  }
)

ButtonModal.displayName = 'ButtonModal'
