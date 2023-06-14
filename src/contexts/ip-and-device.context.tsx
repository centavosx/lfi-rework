import React, { createContext, ReactNode, useEffect, useState } from 'react'

import { useApi } from 'hooks'
import axios from 'axios'

class DeviceInfo {
  private header = [
    navigator.platform,
    navigator.userAgent,
    navigator.appVersion,
    navigator.vendor,
    (window as any)?.opera,
  ]
  private dataOs = [
    { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
    { name: 'Windows', value: 'Win', version: 'NT' },
    { name: 'iPhone', value: 'iPhone', version: 'OS' },
    { name: 'iPad', value: 'iPad', version: 'OS' },
    { name: 'Kindle', value: 'Silk', version: 'Silk' },
    { name: 'Android', value: 'Android', version: 'Android' },
    { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
    { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
    { name: 'Macintosh', value: 'Mac', version: 'OS X' },
    { name: 'Linux', value: 'Linux', version: 'rv' },
    { name: 'Palm', value: 'Palm', version: 'PalmOS' },
  ]
  private browsers = [
    { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
    { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
    { name: 'Safari', value: 'Safari', version: 'Version' },
    { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
    { name: 'Opera', value: 'Opera', version: 'Opera' },
    { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
    { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
  ]

  get os() {
    const agent = this.header.join(' ')
    return this.matchItem(agent, this.dataOs)
  }

  get browser() {
    const agent = this.header.join(' ')
    return this.matchItem(agent, this.browsers)
  }

  private matchItem(
    string: string,
    data: any
  ): { name: string; version: number } {
    let i = 0,
      j = 0,
      regex,
      regexv,
      match,
      matches,
      version

    for (i = 0; i < data.length; i += 1) {
      regex = new RegExp(data[i].value, 'i')
      match = regex.test(string)
      if (match) {
        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i')
        matches = string.match(regexv)
        version = ''
        if (matches) {
          if (matches[1]) {
            matches = matches[1]
          }
        }
        if (matches) {
          matches = (matches as any).split(/[._]+/)
          for (j = 0; j < matches.length; j += 1) {
            if (j === 0) {
              version += matches[j] + '.'
            } else {
              version += matches[j]
            }
          }
        } else {
          version = '0'
        }
        return {
          name: data[i].name,
          version: parseFloat(version),
        }
      }
    }
    return { name: 'unknown', version: 0 }
  }
}

type Device = {
  browser: { name: string; version: number }
  os: { name: string; version: number }
}

export const IPAndDeviceContext = createContext<
  Partial<Device> & { ip?: string }
>({} as Partial<Device> & { ip?: string })

export const IPAndDeviceProvider = ({ children }: { children: ReactNode }) => {
  const [device, setDevice] = useState<Device>()
  const { data } = useApi(async () => {
    return await axios.get('https://ipinfo.io/ip')
  })

  useEffect(() => {
    const device = new DeviceInfo()
    setDevice({ browser: device.browser, os: device.os })
  }, [])

  return (
    <IPAndDeviceContext.Provider value={{ ...device, ip: data }}>
      {children}
    </IPAndDeviceContext.Provider>
  )
}
