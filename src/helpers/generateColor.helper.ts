export const generateColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')
    .toUpperCase()}`

export function colorFromBg(
  bgColor: string,
  lightColor: string,
  darkColor: string
) {
  const c = bgColor.substring(1, 7)
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor
}

export const rgbStringToHex = (rgb: string) => {
  const a: string = rgb.split('(')[1].split(')')[0]
  const arr = a.split(',')
  return (
    '#' +
    arr
      .map(function (x) {
        x = parseInt(x).toString(16)
        return x.length == 1 ? '0' + x : x
      })
      .join('')
  )
}
