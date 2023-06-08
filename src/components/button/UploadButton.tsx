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
  const ref = useRef<HTMLInputElement>(null)

  const onClear = () => {
    if (!!ref?.current?.value) ref.current.value = ''
    if (!!ref.current?.files) ref.current.files = null
  }
  const selectFile = ({
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
    onClear()
    return fileList
  }

  return (
    <Button style={{ position: 'relative' }} {...rest}>
      <input
        ref={ref}
        type="file"
        style={{
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          cursor: 'pointer',
        }}
        onChange={(e) => {
          onFileChange?.(selectFile(e))
        }}
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
    name,
  }: {
    title?: string
    width?: number | string
    onChange?: (v?: string) => void
    textProps?: TextProps
    children?: ReactNode
    errorString?: string
    name?: string
  }) => {
    let fb = useRef<Firebase>(new Firebase('userFolders')).current

    const [{ progress, state, uploadedName, link, err }, setUploadState] =
      useState<{
        progress: number
        state?: TaskState
        uploadedName?: string
        link?: string
        err?: StorageError
      }>({ state: undefined, progress: 0 })

    useEffect(() => {
      if (!!uploadedName) {
        fb.listenUpload(
          (progress, state) =>
            setUploadState((v) => ({ ...v, progress, state })),
          (l) => setUploadState((v) => ({ ...v, link: l })),
          (error) => setUploadState((v) => ({ ...v, err: error }))
        )
      }
    }, [uploadedName])

    useEffect(() => {
      onChange?.(link)
    }, [link])

    return (
      <Flex name={name} width={'auto'} flexDirection={'column'} sx={{ gap: 2 }}>
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
                  if (!!uploadedName)
                    try {
                      await fb.deleteUploadedFile?.()
                    } catch {}
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
                  style={{ minWidth: 0, fontSize: 10 }}
                >
                  {state === 'paused' ? 'Play' : 'Pause'}
                </Button>
                <SecondaryButton
                  onClick={() => {
                    fb.uploadControls().stop()
                    setUploadState({ state: undefined, progress: 0 })
                  }}
                  style={{ minWidth: 0, fontSize: 10 }}
                >
                  Stop
                </SecondaryButton>
              </>
            )}
          {!!state && (state === 'success' || progress === 100) && (
            <SecondaryButton
              onClick={() => {
                fb.deleteUploadedFile().finally(() => {
                  fb.uploadControls().stop()
                  setUploadState({
                    state: undefined,
                    progress: 0,
                    uploadedName: undefined,
                  })
                })
              }}
              style={{ minWidth: 0, fontSize: 10 }}
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

UploadProcess.displayName
