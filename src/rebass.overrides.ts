import { InterpolationWithTheme } from '@emotion/core'

declare module 'rebass' {
  interface FlexProps {
    as?: React.ElementType
    css?: InterpolationWithTheme<any>
  }
  interface BoxProps {
    as?: React.ElementType
    css?: InterpolationWithTheme<any>
  }
  interface TextProps {
    as?: React.ElementType
    css?: InterpolationWithTheme<any>
  }
  interface ImageProps {
    as?: React.ElementType
    css?: InterpolationWithTheme<any>
  }
}

declare module '@rebass/forms' {
  interface LabelProps {
    as?: React.ElementType
    css?: InterpolationWithTheme<any>
  }
}

declare module 'react' {
  interface DOMAttributes<T> {
    css?: InterpolationWithTheme<any>
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: InterpolationWithTheme<any>
    }
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color']
    }
  }

  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary']
  }

  interface PaletteColor {
    darker?: string
  }
  interface SimplePaletteColorOptions {
    darker?: string
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color']
    }
  }
}
