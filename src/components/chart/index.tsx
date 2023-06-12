import React, { useEffect, useState, memo, useMemo, useRef } from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  MotionValue,
} from 'framer-motion'
import { Text, Flex, SxStyleProp } from 'rebass'
import styled, { CSSProperties } from 'styled-components'
import { useResize } from 'hooks'

type AvgStyle = {
  avgLineColor?: string
}

type StyleType = {
  xLabel?: SxStyleProp
  yLabel?: SxStyleProp
  bar?: CSSProperties
  container?: SxStyleProp
  lineWidth?: number
  lineColor?: string
  barContainer?: SxStyleProp
} & AvgStyle

export type XAndY<T extends string | number = string | number> = {
  x: T
  y: number
}

type XType<T extends string | number> = {
  xValues: XAndY<T>[]
  formatXLabel?: (v: XAndY<T>, i: number) => string | number
  style?: StyleType
}

type YType = {
  maxY: number
  yLabelCount?: number
  formatYLabel?: (v: number) => string | number
  style?: StyleType
}

type BarGraphType<T extends string | number> = YType &
  XType<T> & { avg?: number }

export function BarGraph<T extends string | number = number>({
  xValues,
  maxY,
  yLabelCount,
  formatYLabel,
  formatXLabel,
  style,
  avg,
}: BarGraphType<T>) {
  const [layout, setLayout] = useState<{ height: number; width: number }>()
  const ref = useRef<HTMLDivElement>(null)
  const ui = useResize()

  useEffect(() => {
    if (ref.current)
      setLayout({
        height: ref.current.clientHeight,
        width: ref.current.clientWidth,
      })
  }, [ui])

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        ...style?.container,
      }}
    >
      <YLabel
        maxY={maxY}
        yLabelCount={yLabelCount}
        formatYLabel={formatYLabel}
        style={style}
      />
      <BarContainer
        flexDirection={'column'}
        width={'100%'}
        ref={ref}
        style={
          {
            position: 'relative',
            borderColor: style?.lineColor ?? 'black',
            borderWidth: style?.lineWidth ?? 1,
            borderStyle: 'solid',
            flex: 1,
            height: '100%',
            ...style?.barContainer,
          } as unknown as any
        }
      >
        {avg !== undefined && !!layout && (
          <Flex
            flexDirection={'column'}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              position: 'absolute',
              zIndex: 999,
            }}
          >
            <AnimAvgLine
              style={style}
              avg={avg}
              height={layout.height}
              width={layout.width}
              max={maxY}
            />
          </Flex>
        )}
        <YLines
          maxY={maxY}
          yLabelCount={yLabelCount}
          formatYLabel={formatYLabel}
          style={style}
          height={layout?.height}
          width={layout?.width}
        />
        <XLabel
          height={layout?.height}
          xValues={xValues}
          formatXLabel={formatXLabel}
          maxY={maxY}
          style={style}
        />
      </BarContainer>
    </Flex>
  )
}

export const DashLine = ({
  width,
  bottom,
  color,
  lineHeight,
  lineWidth,
  lineGap,
  lineContainer,
}: {
  width: number
  bottom?: string | number | MotionValue | undefined
  color?: string
  lineWidth?: number
  lineHeight?: number
  lineGap?: number
  lineContainer?: CSSProperties
}) => {
  const count = useMemo(() => {
    let tempWidth = 0
    let tcount = 0
    while (tempWidth < width + (lineWidth ?? 6) + (lineGap ?? 3)) {
      tempWidth += (lineWidth ?? 6) + (lineGap ?? 3)
      tcount++
    }
    return tcount
  }, [width, lineWidth, lineGap])

  return (
    <motion.div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        width,
        bottom,
        overflow: 'hidden',
        ...lineContainer,
      }}
    >
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <Flex
            key={i}
            style={{
              width: lineWidth ?? 6,
              height: lineHeight ?? 0.5,
              marginLeft: i == 0 ? 0 : lineGap ?? 3,
              backgroundColor: color ?? 'white',
            }}
          />
        ))}
    </motion.div>
  )
}

const AnimAvgLine = ({
  style,
  avg,
  height,
  max,
  width,
}: {
  style?: StyleType
  avg: number
  height: number
  max: number
  width: number
}) => {
  const percentage = (avg * 100) / max
  const top = (percentage / 100) * height

  const bottomAnimated = useMotionValue(0)
  const transformed = useTransform(bottomAnimated, [0, top], [-1, top - 1])

  useEffect(() => {
    const controls = animate(bottomAnimated, top, {
      duration: 1,
    })

    return () => {
      controls.stop()
      bottomAnimated.set(0)
    }
  }, [bottomAnimated, height, top])

  return (
    <DashLine
      width={width}
      color={style?.avgLineColor ?? 'black'}
      bottom={transformed}
      lineHeight={1}
      lineGap={4}
    />
  )
}

function XLabel<T extends string | number = number>({
  xValues,
  formatXLabel,
  height,
  maxY,
  style,
}: {
  height?: number
  maxY: number
} & XType<T>) {
  return (
    <XContainer>
      {xValues.map((v, i) => {
        const percentage = (v.y * 100) / maxY
        const totalHeight = (percentage / 100) * (height ?? 0)

        return (
          <Flex
            key={i}
            flexDirection={'column'}
            sx={{
              flex: 1,
              ...(i !== xValues.length - 1 && {
                borderRightColor: style?.lineColor ?? 'black',
                borderRightWidth: style?.lineWidth ?? 1,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderBottomWidth: 0,
                borderStyle: 'solid',
              }),
              height: '100%',
            }}
          >
            <Flex
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
              }}
            >
              <Flex sx={{ flex: 1 }} />
              {height !== undefined && (
                <BarLine height={totalHeight} style={style?.bar} />
              )}
            </Flex>
            <Flex
              flexDirection={'column'}
              sx={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: '-20px',
              }}
            >
              <Text
                sx={{
                  width: '100%',
                  ...style?.xLabel,
                }}
              >
                {formatXLabel?.(v, Number(i)) ?? v.x}
              </Text>
            </Flex>
          </Flex>
        )
      })}
    </XContainer>
  )
}

const YLabel = ({ formatYLabel, maxY, yLabelCount, style }: YType) => {
  return (
    <Flex
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        top: '-6px',
        marginRight: '4px',
        zIndex: 999,
      }}
    >
      {Array(yLabelCount ?? 2)
        .fill(null)
        .map((_, i) => {
          const percentage =
            (((yLabelCount ?? 2) - i) * 100) / (yLabelCount ?? 2)
          const total = (percentage / 100) * maxY
          return (
            <Text
              key={i}
              sx={{
                flex: 1,
                width: 'auto',
                textAlign: 'right',
                ...style?.yLabel,
              }}
            >
              {formatYLabel?.(total) ?? total}
            </Text>
          )
        })}
    </Flex>
  )
}

const YLines = ({
  yLabelCount,
  style,
  height,
  width,
}: YType & { height?: number; width?: number }) => {
  return (
    <YContainer sx={{ width, height }}>
      {Array(yLabelCount ?? 2)
        .fill(null)
        .map((_, i) => {
          return (
            <Flex
              key={i}
              flexDirection={'column'}
              sx={{
                position: 'relative',
                flex: 1,
                ...(i !== (yLabelCount ?? 2) - 1 && {
                  borderBottomColor: style?.lineColor ?? 'black',
                  borderBottomWidth: style?.lineWidth ?? 1,
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderStyle: 'solid',
                }),
                height: '100%',
                width: '100%',
              }}
            />
          )
        })}
    </YContainer>
  )
}

const BarLine = memo(
  ({ height, style }: { height: number; style?: CSSProperties }) => {
    const heightAnimated = useMotionValue(0)
    const transformed = useTransform(heightAnimated, [0, height], [height, 0])

    useEffect(() => {
      const controls = animate(heightAnimated, height, {
        duration: 1,
      })

      return () => {
        controls.stop()
        heightAnimated.set(0)
      }
    }, [heightAnimated, height])

    return (
      <Bar
        style={{
          height: height,
          ...style,
          alignItems: 'flex-end',
          bottom: 0,
          overflow: 'hidden',
          translateY: transformed,
        }}
      />
    )
  }
)

BarLine.displayName = 'BarLine'

const BarContainer = styled(Flex)({
  position: 'relative',
  borderStyle: 'solid',
  width: '100%',
  height: '100%',
  flex: 1,
})

const XContainer = styled(Flex)({
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
})

const YContainer = styled(Flex)({
  position: 'absolute',
  height: '100%',
  width: '100%',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})

const Bar = styled(motion.div)({
  overflow: 'hidden',
  borderTopLeftRadius: 100,
  borderTopRightRadius: 100,
  backgroundColor: 'purple',
})
