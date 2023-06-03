import { CircularProgress, Modal } from '@mui/material'
import { Flex } from 'rebass'

export const Loading = () => {
  return (
    <Modal open={true} sx={{ width: '100%', height: '100%' }}>
      <Flex
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          outline: 'none !important',
        }}
      >
        <CircularProgress size={40} />
      </Flex>
    </Modal>
  )
}
