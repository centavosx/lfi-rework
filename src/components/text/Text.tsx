import { Text as TextComponent, TextProps } from 'rebass'

export const Text = ({ children, sx, ...other }: TextProps) => {
  return (
    <TextComponent
      sx={{
        fontSize: [9, 12],
        flex: [null, 1],
        width: ['100%'],
        color: '#f7efe3',
        ...sx,
      }}
      {...other}
    >
      {children}
    </TextComponent>
  )
}
