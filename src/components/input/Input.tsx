import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  TextFieldProps,
  Theme,
} from '@mui/material'
import { styled, SxProps } from '@mui/material/styles'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
} from 'react'
import { theme } from 'utils/theme'

export type InputColor = {
  inputcolor?: {
    backgroundColor?: string
    labelColor?: string
    color?: string
    borderBottomColor?: string
    hover?: {
      backgroundColor?: string
      labelColor?: string
      color?: string
    }
  }
}

const TextInput = ({
  sx,
  children,
  padding,
  ...other
}: TextFieldProps &
  InputColor & {
    padding?: number
    paddingTop?: number
    paddingBottom?: number
    paddingLeft?: number
    paddingRight?: number
  }) => {
  const [password, setPassword] = useState(false)
  return (
    <TextField
      sx={{ width: '100%', ...sx }}
      {...other}
      type={!password ? other.type : 'text'}
      InputProps={{
        endAdornment: other.type === 'password' && (
          <InputAdornment position="end">
            <Button
              style={{
                marginRight: 14,
                cursor: 'pointer',
                padding: 3,
                minWidth: 'auto',
              }}
              onClick={() => setPassword((v) => !v)}
            >
              {password ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </Button>
          </InputAdornment>
        ),
        ...other.InputProps,
      }}
    />
  )
}

export const Input = styled(TextInput)(
  ({
    inputcolor,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }) => ({
    borderRadius: 4,
    backgroundColor: inputcolor?.backgroundColor,
    '& label.Mui-focused': {
      color: inputcolor?.labelColor,
    },

    '& .MuiOutlinedInput-root': {
      color: inputcolor?.color,
      padding: padding ?? 1,
      paddingLeft: paddingLeft ?? padding ?? 1,
      paddingRight: paddingRight ?? padding ?? 1,
      paddingBottom: paddingBottom ?? padding ?? 1,
      paddingTop: paddingTop ?? padding ?? 1,
      '& fieldset': {
        borderColor: inputcolor?.labelColor,
      },
      '&:hover': {
        color: inputcolor?.hover?.color,
      },
      '&:hover fieldset': {
        borderColor: inputcolor?.hover?.labelColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: inputcolor?.labelColor,
      },
    },
    '& .MuiInputBase-root:after': {
      borderBottomColor: inputcolor?.borderBottomColor,
    },
  })
)

export const SearchableInput = ({
  key,
  value,
  label,
  type,
  placeHolder,
  onSearch,
  onChange,
  disabled,
  sx,
  loadingSize,
}: {
  key?: any
  label?: string
  type?: string
  value?: string
  placeHolder?: string
  onSearch?: (val: string) => Promise<void>
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  disabled?: boolean
  sx?: SxProps<Theme>
  loadingSize?: number
}) => {
  const [val, setVal] = useState('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) setIsSearching(true)
  }, [val, setIsSearching])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isSearching) {
      const delay = setTimeout(() => {
        onSearch?.(val).finally(() => setIsSearching(false))
      }, 500)
      return () => clearTimeout(delay)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, val, setIsSearching])

  useEffect(() => {
    if (!!value) setVal(() => value)
  }, [value, setVal])

  const onChangeValue = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setVal(e.target.value)
      onChange?.(e)
    },
    [setVal, onChange]
  )

  return (
    <Input
      key={key}
      label={label}
      variant="filled"
      type={type}
      inputcolor={{
        labelColor: 'gray',
        backgroundColor: 'white',
        borderBottomColor: theme.colors.darkGreen,
        color: 'black',
      }}
      sx={{ color: 'black', width: '100%', ...sx }}
      placeholder={placeHolder}
      onChange={onChangeValue}
      value={value ?? val}
      InputProps={{
        endAdornment: isSearching && (
          <InputAdornment position="end">
            <CircularProgress size={24} />
          </InputAdornment>
        ),
      }}
      disabled={disabled}
    />
  )
}
