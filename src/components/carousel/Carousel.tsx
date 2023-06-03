import { Fade, Grow, Slide } from '@mui/material'
import { Button } from 'components/button'
import React, { useEffect, useState } from 'react'
import { Flex, FlexProps } from 'rebass'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'

export const Carousel = ({
  carouselContent,
  duration,
  fadeDuration,
  children,
  sx,
  contentProps,
  ...other
}:
  | FlexProps & {
      carouselContent: JSX.Element[]
      duration?: number
      fadeDuration?: number
      contentProps?: FlexProps
    }) => {
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    let interval = setInterval(() => {
      setIndex((i) => (i === carouselContent.length - 1 ? 0 : i + 1))
    }, (duration ?? 5) * 1000)

    return () => clearInterval(interval)
  }, [index, setIndex, carouselContent, duration])

  return (
    <Flex flexDirection={'row'} width={'100%'} sx={{ position: 'relative' }}>
      {carouselContent.map((comp, i) => (
        <Fade
          in={i === index}
          key={i}
          mountOnEnter
          unmountOnExit
          style={{
            width: '100%',
            position: i === index ? 'relative' : 'absolute',
            transitionDelay: i === index ? `${fadeDuration ?? 50}ms` : '0ms',
          }}
        >
          {comp}
        </Fade>
      ))}
      <Flex
        sx={{
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          ...sx,
        }}
        {...other}
      >
        <Flex flexDirection={'row'} width="100%" height={'100%'}>
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            <IconButton
              aria-label="prev"
              sx={{
                height: '100%',
                borderRadius: 0,
              }}
              onClick={() =>
                setIndex((v) => (v == 0 ? carouselContent.length - 1 : v - 1))
              }
            >
              <NavigateBeforeIcon fontSize="large" sx={{ color: '#f7efe3' }} />
            </IconButton>
          </Flex>
          <Flex flex={1} {...contentProps}>
            {children}
          </Flex>
          <Flex sx={{ alignItems: 'center', justifyContent: 'end' }}>
            <IconButton
              aria-label="next"
              sx={{
                height: '100%',
                borderRadius: 0,
              }}
              onClick={() =>
                setIndex((v) => (v == carouselContent.length - 1 ? 0 : v + 1))
              }
            >
              <NavigateNextIcon fontSize="large" sx={{ color: '#f7efe3' }} />
            </IconButton>
          </Flex>
        </Flex>
        <Flex
          sx={{
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
          width={'100%'}
        >
          {carouselContent.map((_, i) => (
            <Button
              key={i}
              style={{
                borderRadius: '100%',
                minWidth: 8,
                height: 8,
                width: 8,
                padding: 0,
                backgroundColor: i === index ? '#f7efe3' : 'rgba(1,1,1,0.5)',
              }}
              onClick={() => setIndex(i)}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
