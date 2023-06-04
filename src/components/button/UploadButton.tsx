import {
  useState,
  useCallback,
  memo,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import { Button, ButtonProps, SecondaryButton } from './Button'
import { Firebase } from 'firebaseapp'
import { Flex, TextProps, Text } from 'rebass'
import { StorageError, TaskState } from 'firebase/storage'
import { theme } from 'utils/theme'
import { InputError } from 'components/input'

export const UploadButton = ({
  children,
  multiple,
  accept = ['*'],
  onFileChange,
  ...rest
}: ButtonProps & {
  multiple?: boolean
  accept?: string[]
  onFileChange?: (f: File[]) => void
}) => {
  const selectFile = useCallback(
    ({
      target: { files },
    }: {
      target: {
        files: FileList | null
      }
    }) => {
      if (!files) return []
      const fileList: File[] = []
      for (let i = 0; i < files.length; i++) {
        const f = files.item(i)
        if (!f) continue
        const extension = f.type
        if (
          accept?.some((v) => {
            return v === extension
          }) ||
          accept.includes('*')
        )
          fileList.push(f)
      }

      return fileList
    },
    [accept]
  )

  return (
    <Button style={{ position: 'relative' }} {...rest}>
      <input
        type="file"
        style={{
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          cursor: 'pointer',
        }}
        onChange={(e) => onFileChange?.(selectFile(e))}
        multiple={multiple}
        accept={accept?.join(', ')}
      />
      {children}
    </Button>
  )
}

export const UploadProcess = memo(
  ({
    title,
    width = 150,
    onChange,
    textProps,
    children = 'Upload',
    errorString,
  }: {
    title?: string
    width?: number | string
    onChange?: (v?: string) => void
    textProps?: TextProps
    children?: ReactNode
    errorString?: string
  }) => {
    const fb = useRef<Firebase>(new Firebase('test')).current

    const [{ progress, state, uploadedName, link, err }, setUploadState] =
      useState<{
        progress: number
        state?: TaskState
        uploadedName?: string
        link?: string
        err?: StorageError
      }>({ state: undefined, progress: 0 })

    useEffect(() => {
      fb.listenUpload(
        (progress, state) => setUploadState((v) => ({ ...v, progress, state })),
        (l) => setUploadState((v) => ({ ...v, link: l })),
        (error) => setUploadState((v) => ({ ...v, err: error }))
      )
    }, [uploadedName])

    useEffect(() => {
      onChange?.(link)
    }, [link])

    return (
      <Flex width={'auto'} flexDirection={'column'} sx={{ gap: 2 }}>
        {!!title && <Text {...textProps}>{title}</Text>}
        <InputError error={errorString} />
        <Flex flexDirection={'row'} sx={{ gap: 2 }}>
          <Flex flexDirection={'column'}>
            <UploadButton
              style={{
                width,
              }}
              onFileChange={async (f) => {
                if (f.length > 0) {
                  fb.uploadControls().stop?.()
                  if (!!uploadedName) await fb.deleteUploadedFile?.()
                  fb.uploadFile(f[0])
                  setUploadState({
                    progress: 0,
                    uploadedName: f[0].name,
                  })
                }
              }}
              accept={['*']}
            >
              <span
                style={{
                  display: '-webkit-box',
                  color: theme.colors.white,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {uploadedName ?? children}
              </span>
            </UploadButton>
            {!!uploadedName && !!state && !err && (
              <Flex
                backgroundColor={theme.colors.darkestGreen}
                width={progress + '%'}
                sx={{ padding: '2px', borderRadius: 8, mt: 1 }}
              />
            )}
          </Flex>
          {!!uploadedName &&
            !!state &&
            (state === 'paused' || state === 'running') &&
            !err &&
            progress < 100 && (
              <>
                <Button
                  onClick={() =>
                    state === 'paused'
                      ? fb.uploadControls().resume()
                      : fb.uploadControls().pause()
                  }
                >
                  {state === 'paused' ? 'Play' : 'Pause'}
                </Button>
                <SecondaryButton
                  onClick={() => {
                    fb.uploadControls().stop()
                    setUploadState({ state: undefined, progress: 0 })
                  }}
                >
                  Stop
                </SecondaryButton>
              </>
            )}
          {!!state && (state === 'success' || progress === 100) && (
            <SecondaryButton
              onClick={async () => {
                const check = await fb.deleteUploadedFile()
                if (check) {
                  setUploadState({ state: undefined, progress: 0 })
                }
              }}
            >
              Delete
            </SecondaryButton>
          )}
        </Flex>

        {!!err?.message && !!uploadedName && <InputError error={err.message} />}
      </Flex>
    )
  }
)

UploadProcess.displayName = 'UploadProcess'
