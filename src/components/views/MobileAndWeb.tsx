import styled from '@emotion/styled'
import mediaQueries from './media'

export const WebView = styled.div`
  display: block;
  ${mediaQueries.tablet`
    display:none;
  `};
`

export const MobileView = styled.div`
  display: none;
  ${mediaQueries.tablet`
    display:block;
  `}
`

export const AdminWebView = styled.div`
  display: block;
  ${mediaQueries.desktop`
    display:none;
  `};
`

export const DesktopView = styled.div`
  display: none;
  ${mediaQueries.desktop`
    display:block;
  `}
`
