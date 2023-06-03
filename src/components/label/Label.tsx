import { Label as LabelComponent, LabelProps } from '@rebass/forms'

export const Label = ({ children, sx, ...other }: LabelProps) => {
  return (
    <LabelComponent sx={{ ...sx }} {...other}>
      {children}
    </LabelComponent>
  )
}
