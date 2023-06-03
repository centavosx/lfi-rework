import { Button as ButtonComponent, ButtonProps as Props } from '@mui/material'
import styled from '@emotion/styled'
import { theme } from 'utils/theme'

export type ButtonProps = {
  backgroundcolor?: string
  activecolor?: string
  hovercolor?: string
  textcolor?: string
  hovertextcolor?: string
  activetextcolor?: string
  custom?: any
} & Props

const StyledButton = ({ className, sx, ...props }: ButtonProps) => {
  return (
    <ButtonComponent className={className} {...props}>
      {props?.children}
    </ButtonComponent>
  )
}
export const Button = styled(StyledButton)`
  && {
    font-weight: bold;
    background-color: ${({ backgroundcolor }) =>
      backgroundcolor ?? theme.colors.green};
    color: ${({ textcolor }) => textcolor ?? theme.colors.white};
    :disabled {
      background-color: gray;
      color: white;
    }
    :hover {
      background-color: ${({ hovercolor }) =>
        hovercolor ?? theme.colors.darkGreen};
      color: ${({ hovertextcolor }) => hovertextcolor ?? theme.colors.white};
    }
    :active {
      background-color: ${({ activecolor }) =>
        activecolor ?? theme.colors.darkerGreen};
      color: ${({ activetextcolor }) => activetextcolor ?? theme.colors.white};
    }

    ${({ custom }) => custom}
  }
`

export const SecondaryButton = ({
  children,
  style,

  ...rest
}: ButtonProps) => {
  return (
    <Button
      style={{
        borderColor: theme.colors.green,
        borderWidth: 1,
        borderStyle: 'solid',
        ...style,
      }}
      backgroundcolor={theme.colors.white}
      textcolor={theme.colors.green}
      hovercolor={theme.colors.green40}
      hovertextcolor={theme.colors.darkerGreen}
      activecolor={theme.colors.green}
      activetextcolor={theme.colors.white}
      {...rest}
    >
      {children}
    </Button>
  )
}

export const DownArrow = ({ color = 'white' }: { color?: string }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        marginLeft: '.255em',
        verticalAlign: '.255em',
        content: '',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color,
      }}
    />
  )
}
