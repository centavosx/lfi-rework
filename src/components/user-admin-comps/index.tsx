import { FormControl } from '@mui/material'
import { UploadProcess } from 'components/button'
import { FormInput, InputError } from 'components/input'
import { SelectV2 } from 'components/select'
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
    const findPrograms = [
      {
        label: 'Select Program...',
        value: undefined,
      },

      ...((fields.level === Level.SHS
        ? SHS_PROGRAMS
        : COLLEGE_PROGRAMS) as any[]),
    ].find((v) => v.value === fields.program)
    return (
      <Flex flexDirection={'column'} sx={{ gap: 3 }}>
        <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
          <FormControl fullWidth>
            <SelectV2
              label="Level"
              options={SCHOOL_LEVEL}
              value={SCHOOL_LEVEL.find((v) => v.value === fields.level) as any}
              onChange={(v) => {
                if (v === null) {
                  onAnyChange('level', undefined)
                } else {
                  onAnyChange('level', v.value)
                }
                onAnyChange('program', undefined)
              }}
              placeholder="Select School Level"
            />
          </FormControl>
          <InputError error={errors.level} />
        </Flex>

        {!!fields.level && (
          <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
            <SelectV2
              label="Program"
              placeholder="Select School program"
              options={[
                { label: 'Select Program...', value: undefined },
                { label: 'Others', value: 'Other' },
                ...((fields.level === Level.SHS
                  ? SHS_PROGRAMS
                  : COLLEGE_PROGRAMS) as any[]),
              ]}
              value={
                !!findPrograms
                  ? findPrograms
                  : !!fields.program || fields.program === null
                  ? { label: 'Others', value: 'Other' }
                  : (undefined as any)
              }
              onChange={(v) => {
                if (v === null) {
                  onAnyChange('program', undefined)
                  return
                }

                if ((v as any).value === 'Other') {
                  onAnyChange('program', null)
                  return
                }
                onAnyChange('program', (v as any).value)
              }}
            />

            <InputError error={errors.program} />
          </Flex>
        )}
        {!findPrograms && (!!fields.program || fields.program === null) && (
          <FormInput
            name={'program'}
            label={'Others'}
            placeholder={'Please type program'}
            value={fields.program}
          />
        )}
        <Flex flexWrap={'wrap'} flexDirection={'column'} sx={{ gap: 2 }}>
          {DISPLAY_FILES.map((_, i) => {
            if (i % 2 === 0) {
              const v = DISPLAY_FILES[i]
              const v2 = DISPLAY_FILES[i + 1]
              return (
                <Flex width="100%" key={i} flexDirection={['column', 'row']}>
                  <Flex flex={[1, 0.51, 0.5]} alignItems={'center'}>
                    <UploadProcess
                      name={v.name}
                      key={v.name}
                      title={v.title}
                      textProps={{
                        fontWeight: 'bold',
                        justifyContent: 'center',
                      }}
                      errorString={errors[v.name as keyof typeof errors] as any}
                      width={100}
                      onChange={(link) => onAnyChange(v.name as any, link)}
                    />
                  </Flex>
                  {!!v2 && (
                    <Flex flex={[1, 0.49, 0.5]}>
                      <UploadProcess
                        name={v2.name}
                        key={v2.name}
                        title={v2.title}
                        textProps={{
                          fontWeight: 'bold',
                          justifyContent: 'center',
                        }}
                        errorString={
                          errors[v2.name as keyof typeof errors] as any
                        }
                        width={100}
                        onChange={(link) => onAnyChange(v2.name as any, link)}
                      />
                    </Flex>
                  )}
                </Flex>
              )
            }
          })}
        </Flex>
      </Flex>
    )
  }
)
UserRequiredFields.displayName = 'requiredFields'

export * from './user-information'
