import { DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes } from 'react'
import { theme } from 'utils/theme'

export const ListContainer = ({
  children,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
  <ul {...rest}>{children}</ul>
)

export const ListItem = ({
  children,
  style,
  ...rest
}: DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
  <li
    style={{ color: theme.colors.green }}
    color={theme.colors.green}
    {...rest}
  >
    {children}
  </li>
)

// export const ListItem = styled(List)((p)=>({
//     ':before':{c: p.colr}
// }))
