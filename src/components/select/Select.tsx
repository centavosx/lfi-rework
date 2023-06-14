import { CSSProperties, useEffect, useState } from 'react'
import SelectComponent, { StylesConfig } from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'
import { StyledProps } from 'styled-components'

import { Autocomplete, TextField } from '@mui/material'
import { Input } from 'components/input'

export interface Option<T extends any = any, V extends any = any> {
  readonly value: V
  readonly label: T
}

const colourStyles: StylesConfig<Option> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'green',
    border: '1px solid gray',
    boxShadow: '0 0 0 1px black',
    '& :focus': {
      border: '1px solid black',
    },
    zIndex: 9999999,
  }),
  input: (styles) => ({
    ...styles,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'black',
    zIndex: 99999,
  }),
  placeholder: (styles) => ({
    ...styles,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    zIndex: 999999,
  }),

  menuPortal: (styles) => ({
    ...styles,
    background: 'white',
    zIndex: 999999,
  }),
  singleValue: (styles) => ({ ...styles }),
}

interface SelectStyles {
  controlStyle?: CSSProperties
  inputStyle?: CSSProperties
  placeholderStyle?: CSSProperties
  singleValueStyle?: CSSProperties
}

export function Select<T extends any = any, V extends any = any>({
  controlStyle,
  inputStyle,
  placeholderStyle,
  singleValueStyle,
  ...other
}: StateManagerProps<Option<T, V>> & SelectStyles) {
  const [_document, setDocument] = useState<Document | undefined>(undefined)

  useEffect(() => {
    if (!!document) setDocument(document)
  }, [typeof window !== 'undefined' ? document : undefined])

  return (
    <SelectComponent
      menuPortalTarget={_document?.body}
      styles={{
        ...colourStyles,
        control: (style) => ({ ...style, ...controlStyle }),
        input: (style) => ({ ...style, ...inputStyle }),
        placeholder: (style) => ({ ...style, ...placeholderStyle }),
        singleValue: (style) => ({ ...style, ...singleValueStyle }),
      }}
      {...other}
    />
  )
}

export function SelectV2<T extends any = any, V extends any = any>({
  options,
  value,
  onChange,
  label,
  isDisabled,
  placeholder,
}: {
  options: Option<T, V>[]
  value: Option<T, V>
  onChange: (v: Option<T, V> | null) => void
  label: string
  isDisabled?: boolean
  placeholder?: string
}) {
  return (
    <Autocomplete
      multiple={false}
      placeholder={placeholder}
      disabled={isDisabled}
      disablePortal={true}
      options={options as any}
      value={value as any}
      onChange={(_, v) => onChange(v)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
