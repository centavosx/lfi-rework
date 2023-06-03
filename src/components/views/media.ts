import { css } from '@emotion/core'

const breakpoints = [
  ['phone_small', 320],
  ['phone', 376],
  ['phablet', 540],
  ['tablet', 735],
  ['desktop', 1070],
  ['desktop_medium', 1280],
  ['desktop_large', 1440],
]

const toEm = (size: number) => size / 16 + 'em'

type BreakPoints = {
  phone_small: any
  phone: any
  tablet: any
  phablet: any
  desktop: any
  desktop_medium: any
  desktop_large: any
}

const mediaQueries = breakpoints.reduce(
  (acc, [label, size], i) => ({
    ...acc,

    [label]: (...args: any[]) => css`
      @media (max-width: ${toEm(Number(size))}) {
        ${css(...args)};
      }
    `,
    [`${label}_up`]: (...args: any[]) => css`
      @media (min-width: ${toEm(Number(breakpoints[i - 1][1]) + 1)}) {
        ${css(...args)};
      }
    `,
  }),
  {}
) as BreakPoints

export default mediaQueries
