import { CSSProperties, useEffect, useState } from 'react'
import SelectComponent, { StylesConfig } from 'react-select'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'
import { StyledProps } from 'styled-components'

export interface Option {
  readonly value: string
  readonly label: string
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
  }),
  input: (styles) => ({
    ...styles,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'black',
  }),
  placeholder: (styles) => ({
    ...styles,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  }),

  menuPortal: (styles) => ({
    ...styles,
    background: 'white',
    zIndex: 1,
  }),
  singleValue: (styles) => ({ ...styles }),
}

interface SelectStyles {
  controlStyle?: CSSProperties
  inputStyle?: CSSProperties
  placeholderStyle?: CSSProperties
  singleValueStyle?: CSSProperties
}

export const Select = ({
  controlStyle,
  inputStyle,
  placeholderStyle,
  singleValueStyle,
  ...other
}: StateManagerProps<Option> & SelectStyles) => {
  const [_document, setDocument] = useState<Document | undefined>(undefined)

  useEffect(() => {
    setDocument(document)
  }, [setDocument])

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
