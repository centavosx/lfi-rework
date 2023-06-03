import {
  useCallback,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

import Modal from '@mui/material/Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { Flex, Text, TextProps } from 'rebass'

type ChildProps = {
  isOpen: boolean
  onSubmit: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function TextModal({
  className,
  sx,
  children,
  modalChild,
  isNotClickable,
  onSubmit,
  ...props
}: TextProps & {
  isNotClickable?: boolean
  modalChild?: ((props: ChildProps) => ReactNode) | ReactNode
  onSubmit?: () => void
}) {
  const [open, setOpen] = useState<boolean>(false)

  const onSubmitSuccess = useCallback(() => {
    onSubmit?.()
    setOpen(false)
  }, [onSubmit, setOpen])

  return (
    <>
      <Text
        className={className}
        onClick={!isNotClickable ? () => setOpen(true) : undefined}
        {...props}
      >
        {children}
      </Text>
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
            width: ['80%', 'auto'],
            height: ['80%', 'auto'],
            backgroundColor: 'white',
            border: '1px solid gray',
            borderRadius: '10px',
            boxShadow: 24,
            overflow: 'auto',
            p: 4,
            flexDirection: 'column',
          }}
        >
          <Flex sx={{ alignSelf: 'end' }}>
            <AiOutlineClose
              style={{ cursor: 'pointer' }}
              onClick={() => setOpen(false)}
            />
          </Flex>
          {open &&
            (typeof modalChild === 'function'
              ? modalChild({ onSubmit: onSubmitSuccess, isOpen: open, setOpen })
              : modalChild)}
        </Flex>
      </Modal>
    </>
  )
}
