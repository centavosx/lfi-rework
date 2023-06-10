import {
  useCallback,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
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
    height,
    onClose,
    ...props
  }: ButtonProps & {
    modalChild?: ((props: ChildProps) => ReactNode) | ReactNode
    onSubmit?: () => void
    onClose?: () => void
    height?: string[] | number[] | number | string
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

    useEffect(() => {
      if (open === false) onClose?.()
    }, [open])

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
              height: height ?? 'auto',
              maxHeight: maxHeight ?? '80%',
              backgroundColor: 'white',
              border: '1px solid gray',
              borderRadius: '10px',
              boxShadow: 24,
              overflow: 'auto',

              flexDirection: 'column',
            }}
          >
            <Flex sx={{ mb: 3, pt: 3, pl: 4, pr: 4 }} width={'100%'}>
              <Text flex={1} {...titleProps}>
                {title}
              </Text>
              <AiOutlineClose
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen(false)}
              />
            </Flex>
            <Flex
              flexDirection={'column'}
              flex={1}
              height={'100%'}
              width={'100%'}
              overflow={'auto'}
              pb={4}
              pl={4}
              pr={4}
            >
              {open &&
                (typeof modalChild === 'function'
                  ? modalChild({
                      onSubmit: onSubmitSuccess,
                      isOpen: open,
                      setOpen,
                    })
                  : modalChild)}
            </Flex>
          </Flex>
        </Modal>
      </>
    )
  }
)

ButtonModal.displayName = 'ButtonModal'
