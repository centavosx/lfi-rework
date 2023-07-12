import { FormControl, InputAdornment, Button } from '@mui/material'
import { UploadProcess } from 'components/button'
import { FormInput, InputError } from 'components/input'
import { CustomModal } from 'components/modal'
import { SelectV2 } from 'components/select'
import {
  COLLEGE_PROGRAMS,
  DISPLAY_FILES,
  LEVEL_EDUC,
  Level,
  RegFormType,
  SCHOOL_LEVEL,
  SHS_LEVEL_EDUC,
  SHS_PROGRAMS,
} from 'constant'
import { Roles, UserStatus } from 'entities'
import { FormikErrors } from 'formik'
import { memo, useState } from 'react'
import { AiFillInfoCircle } from 'react-icons/ai'
import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'

export type CreateUserType = RegFormType & {
  status?: UserStatus
  role: Roles[]
}

export const UserRequiredFields = memo(
  ({
    onAnyChange,
    fields,
    errors,
    isUser,
  }: {
    onAnyChange: (k: keyof CreateUserType, v: any) => void
    fields: CreateUserType
    errors: FormikErrors<CreateUserType>
    isUser?: boolean
  }) => {
    const FILES = DISPLAY_FILES.filter(
      (v) => (isUser && v.name !== 'homeVisitProof') || !isUser
    )
    const findPrograms = [
      {
        label: 'Select Program...',
        value: undefined,
      },

      ...((fields.education === Level.SHS
        ? SHS_PROGRAMS
        : COLLEGE_PROGRAMS) as any[]),
    ].find((v) => v.value === fields.program)
    return (
      <Flex flexDirection={'column'} sx={{ gap: 3 }}>
        <FormInput
          name="lastGwa"
          type="number"
          label="General Average"
          placeholder="Type your general average"
          value={fields.lastGwa}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CustomModal
                  modalChild={
                    <Flex flexDirection={'column'} sx={{ gap: 2, p: 2 }}>
                      <Text>Average grade should follow: </Text>
                      <Flex flexDirection={'column'} sx={{ gap: 2, p: 2 }}>
                        {[
                          '1.00...... 98-100',
                          '1.25...... 95-97',
                          '1.50...... 92-85',
                          '1.75...... 89-91',
                          '2.00...... 86-88',
                          '2.25...... 83-85',
                          '2.50...... 80-82',
                          '2.75...... 77-79',
                          '3.00...... 75-76',
                          '5.00.... Below 75 (Failed)',
                        ].map((v, ind) => (
                          <Text key={ind} as={'h4'}>
                            • {v}
                          </Text>
                        ))}
                      </Flex>
                      <Text mt={2}>
                        Note: Follow the metric system of Lao Foundation Inc.,
                        convert the grades if needed. If the grading system is
                        different from the metric system of Lao Foundation Inc.,
                        please refrain with the point system of your school.
                      </Text>
                    </Flex>
                  }
                  title="Grade Equivalents"
                  titleProps={{ as: 'h2' }}
                >
                  {({ setOpen }) => (
                    <Button
                      style={{
                        marginRight: 14,
                        cursor: 'pointer',
                        padding: 3,
                        minWidth: 'auto',
                      }}
                      onClick={() => setOpen(true)}
                    >
                      <AiFillInfoCircle color={theme.colors.green} />
                    </Button>
                  )}
                </CustomModal>
              </InputAdornment>
            ),
          }}
        />
        <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
          <FormControl fullWidth>
            <SelectV2
              label="Education"
              options={SCHOOL_LEVEL}
              value={
                SCHOOL_LEVEL.find((v) => v.value === fields.education) as any
              }
              onChange={(v) => {
                if (v === null) {
                  onAnyChange('education', undefined)
                } else {
                  onAnyChange('education', v.value)
                }
                onAnyChange('program', undefined)
                onAnyChange('level', undefined)
              }}
              placeholder="Select School Level"
            />
          </FormControl>
          <InputError error={errors.education} />
        </Flex>

        {!!fields.education && (
          <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
            <SelectV2
              label="Program"
              placeholder="Select School program"
              options={[
                { label: 'Select Program...', value: undefined },
                { label: 'Others', value: 'Other' },
                ...((fields.education === Level.SHS
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

        {!!fields.program && (
          <Flex flexDirection={'column'} sx={{ width: '100%', gap: 2 }}>
            <SelectV2
              label="Level"
              placeholder="Select Education LEvel"
              options={[
                { label: 'Select Education Level...', value: undefined },
                ...(fields.education === Level.SHS
                  ? (SHS_LEVEL_EDUC as any)
                  : (LEVEL_EDUC as any)),
              ]}
              value={
                (
                  (fields.education ? SHS_LEVEL_EDUC : LEVEL_EDUC) as any[]
                ).find((v) => v.value === fields.level)!
              }
              onChange={(v) => {
                if (v === null) {
                  onAnyChange('level', undefined)
                  return
                }

                onAnyChange('level', (v as any).value)
              }}
            />

            <InputError error={errors.level} />
          </Flex>
        )}
        <Flex flexWrap={'wrap'} flexDirection={'column'} sx={{ gap: 2 }}>
          {FILES.map((_, i) => {
            if (i % 2 === 0) {
              const v = FILES[i]
              const v2 = FILES[i + 1]
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
