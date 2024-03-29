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
import { AiOutlineClose } from 'react-icons/ai'
import { Flex, TextProps, Text } from 'rebass'

type ChildrenProps = {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

type ChildProps = ChildrenProps & {
  onSubmit: () => void
}

export const CustomModal = memo(
  ({
    children,
    modalChild,
    maxHeight,
    maxWidth,
    onSubmit,
    isModalOverFlow = true,
    width,
    titleProps,
    title,
    onClose,
  }: {
    modalChild?: ((props: ChildProps) => ReactNode) | ReactNode
    children: ((props: ChildrenProps) => ReactNode) | ReactNode
    onSubmit?: () => void
    maxHeight?: number[] | string[] | number | string
    maxWidth?: number[] | string[] | number | string
    isModalOverFlow?: boolean
    width?: string[] | number[] | number | string | any
    titleProps?: TextProps
    title?: string
    onClose?: () => void
  }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [mounted, setMounted] = useState(false)

    const onSubmitSuccess = useCallback(() => {
      onSubmit?.()
      setOpen(false)
    }, [onSubmit, setOpen])

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!open && !!mounted) onClose?.()
    }, [open])

    return (
      <>
        {typeof children === 'function'
          ? children({ isOpen: open, setOpen })
          : children}
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
              height: 'auto',
              maxHeight: maxHeight ?? ['80%', 'unset'],
              maxWidth: maxWidth,
              backgroundColor: 'white',
              border: '1px solid gray',
              borderRadius: '10px',
              boxShadow: 24,
              overflow: !isModalOverFlow ? undefined : 'auto',
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

CustomModal.displayName = 'CustomModal'
