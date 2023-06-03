import styled from '@emotion/styled'
import mediaQueries from './media'

export const WebView = styled.div`
  display: block;
  ${mediaQueries.tablet`
    display:none;
  `}
`

export const MobileView = styled.div`
  display: none;
  ${mediaQueries.tablet`
    display:block;
  `}
`
