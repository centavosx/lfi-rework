import { Fade, Grow, Paper, Slide } from '@mui/material'
import { Button } from 'components/button'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Flex, FlexProps } from 'rebass'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'

export const SecondCarousel = ({
  duration,
  fadeDuration,
  children,
  sx,
  contentProps,
  nextColorButton,
  ...other
}:
  | FlexProps & {
      duration?: number
      fadeDuration?: number
      contentProps?: FlexProps
      nextColorButton?: string
    }) => {
  const containerRef = React.useRef(null)
  const [index, setIndex] = useState<number>(0)
  const [dir, setDir] = useState<'left' | 'right' | 'up' | 'down' | undefined>(
    'right'
  )
  useEffect(() => {
    let interval = setInterval(() => {
      setDir('right')
      setIndex((i) =>
        !!(children as any)[0]
          ? i === (children as any[]).length - 1
            ? 0
            : i + 1
          : 0
      )
    }, (duration ?? 5) * 1000)

    return () => clearInterval(interval)
  }, [index, setIndex, children, duration, setDir])

  const nextOrPrev = useCallback(
    (number: number, dir: 'left' | 'right' | 'up' | 'down' | undefined) => {
      setDir(dir)
      setIndex(number)
    },
    [setIndex, setDir]
  )

  return (
    <Flex flexDirection={'row'} width={'100%'} sx={{ position: 'relative' }}>
      <Flex
        sx={{
          zIndex: 1,
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          ...sx,
        }}
        {...other}
      >
        <Flex
          flexDirection={'row'}
          width="100%"
          height={'100%'}
          sx={{ position: 'relative', justifyContent: 'space-between' }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'start',
              zIndex: 1,
            }}
          >
            <IconButton
              aria-label="prev"
              sx={{
                height: '100%',
                borderRadius: 0,
              }}
              onClick={() =>
                !!(children as any)[0]
                  ? nextOrPrev(
                      index == 0 ? (children as any[]).length - 1 : index - 1,
                      'left'
                    )
                  : null
              }
            >
              <NavigateBeforeIcon
                fontSize="large"
                sx={{ color: nextColorButton ?? '#f7efe3' }}
              />
            </IconButton>
          </Flex>
          <Flex ref={containerRef} {...contentProps}>
            {!!(children as any)[index] ? (
              (children as any)?.map((comp: JSX.Element, i: number) => (
                <Slide
                  in={i === index}
                  direction={dir}
                  key={i}
                  mountOnEnter
                  unmountOnExit
                  container={containerRef?.current}
                  style={{
                    position: i === index ? 'relative' : 'absolute',
                    display: i === index ? 'block' : 'none',
                    transitionDelay:
                      i === index ? `${fadeDuration ?? 100}ms` : '0ms',
                  }}
                >
                  <Paper
                    sx={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    {comp}
                  </Paper>
                </Slide>
              ))
            ) : (
              <Slide
                mountOnEnter
                unmountOnExit
                style={{
                  width: '100%',
                  position: 'relative',
                  transitionDelay: `${fadeDuration ?? 50}ms`,
                }}
              >
                <Paper sx={{ backgroundColor: 'transparent', border: 0 }}>
                  {children as JSX.Element}
                </Paper>
              </Slide>
            )}
          </Flex>
          <Flex sx={{ alignItems: 'center', justifyContent: 'end' }}>
            <IconButton
              aria-label="next"
              sx={{
                height: '100%',
                borderRadius: 0,
              }}
              onClick={() =>
                !!(children as any)[0]
                  ? nextOrPrev(
                      index == (children as any[]).length - 1 ? 0 : index + 1,
                      'right'
                    )
                  : null
              }
            >
              <NavigateNextIcon
                fontSize="large"
                sx={{ color: nextColorButton ?? '#f7efe3' }}
              />
            </IconButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
