import { UploadProcess } from 'components/button'
import { FormInput, InputError } from 'components/input'
import { Select } from 'components/select'
import {
  COLLEGE_PROGRAMS,
  DISPLAY_FILES,
  Level,
  RegFormType,
  SCHOOL_LEVEL,
  SHS_PROGRAMS,
} from 'constant'
import { Roles, UserStatus } from 'entities'
import { FormikErrors } from 'formik'
import { memo, useState } from 'react'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'

export type CreateUserType = RegFormType & { status: UserStatus; role: Roles[] }

export const UserRequiredFields = memo(
  ({
    onAnyChange,
    fields,
    errors,
  }: {
    onAnyChange: (k: keyof CreateUserType, v: any) => void
    fields: CreateUserType
    errors: FormikErrors<CreateUserType>
  }) => {
    const [isOther, setIsOther] = useState(false)
    return (
      <Flex flexDirection={'column'} mt={2} sx={{ gap: 3 }}>
        <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
          <Select
            isSearchable={true}
            value={[
              {
                label: 'Select Level...',
                value: undefined as unknown as any,
              },
              ...SCHOOL_LEVEL,
            ].find((v) => v.value === fields.level)}
            name={'level'}
            options={[
              {
                label: 'Select Level...',
                value: undefined as unknown as any,
              },
              ...SCHOOL_LEVEL,
            ]}
            controlStyle={{
              padding: 8,
              borderColor: 'black',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
            onChange={(v) => {
              onAnyChange('level', (v as any).value)
              onAnyChange('program', undefined)
              setIsOther(false)
            }}
            theme={(ct) => ({
              ...ct,
              colors: {
                ...ct.colors,
                primary25: theme.colors.green40,
                primary: theme.colors.darkerGreen,
              },
            })}
            placeholder="Select School Level"
          />
          <InputError error={errors.level} />
        </Flex>

        {!!fields.level && (
          <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
            <Select
              isSearchable={true}
              name="program"
              options={[
                { label: 'Select Program...', value: undefined },
                { label: 'Others', value: 'Other' },
                ...((fields.level === Level.SHS
                  ? SHS_PROGRAMS
                  : COLLEGE_PROGRAMS) as any[]),
              ]}
              controlStyle={{
                padding: 8,
                borderColor: 'black',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
              value={
                isOther
                  ? { label: 'Others', value: 'Other' }
                  : [
                      { label: 'Select Program...', value: undefined },
                      { label: 'Others', value: 'Other' },
                      ...((fields.level === Level.SHS
                        ? SHS_PROGRAMS
                        : COLLEGE_PROGRAMS) as any[]),
                    ].find((v) => v.value === fields.program)
              }
              onChange={(v) => {
                if ((v as any).value === 'Other') {
                  onAnyChange('program', undefined)
                  setIsOther(true)
                  return
                }
                onAnyChange('program', (v as any).value)
                setIsOther(false)
              }}
              theme={(ct) => ({
                ...ct,
                colors: {
                  ...ct.colors,
                  primary25: theme.colors.green40,
                  primary: theme.colors.darkerGreen,
                },
              })}
              placeholder="Select Time"
            />
            <InputError error={errors.program} />
          </Flex>
        )}
        {!!isOther && (
          <FormInput
            name={'program'}
            label={'Others'}
            placeholder={'Please type program'}
            value={fields.program}
          />
        )}
        {DISPLAY_FILES.map((v, i) => {
          return (
            <UploadProcess
              title={v.title}
              key={i}
              name={v.name}
              onChange={(link) =>
                onAnyChange(v.name as keyof RegFormType, link)
              }
              errorString={errors[v.name as keyof RegFormType]}
            />
          )
        })}
      </Flex>
    )
  }
)
UserRequiredFields.displayName = 'requiredFields'

export * from './user-information'
