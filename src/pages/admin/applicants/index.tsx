import React, { memo, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../../components/sections'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi, useUser } from 'hooks'
import { useRouter } from 'next/navigation'
import { useRouter as useNav } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { FormikValidation } from 'helpers'
import { AdminMain } from 'components/main'
import { PageLoading } from 'components/loading'
import { GetAllUserType, createUser, getAllUser } from 'api'
import { Roles, User, UserStatus } from 'entities'
import { FormInput, Input, InputError } from 'components/input'
import { Checkbox, FormControlLabel } from '@mui/material'
import {
  COLLEGE_PROGRAMS,
  DISPLAY_FILES,
  Level,
  RegFormType,
  RegisterDto,
  SCHOOL_LEVEL,
  SHS_PROGRAMS,
} from 'constant'
import { UploadProcess } from 'components/button'
import { Select } from 'components/select'
import { theme } from 'utils/theme'
import { FormikErrors } from 'formik'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  statusParams?: string
}

const SCHOLAR_STATUS = [
  {
    label: 'Active',
    value: UserStatus.ACTIVE,
  },
  {
    label: 'Processing',
    value: UserStatus.VERIFIED,
  },
]

type CreateUserType = RegFormType & { status: UserStatus; role: Roles[] }

const UserRequiredFields = memo(
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

const modalInitial: ModalFlexProps<CreateUserType, RegisterDto> = {
  api: createUser,

  modalText: 'Add new scholar',
  initial: {
    fname: '',
    mname: '',
    lname: '',
    address: '',
    email: '',
    status: UserStatus.VERIFIED,
    role: [Roles.USER],
  },
  fields: [
    {
      field: 'fname',
      label: 'First Name',
      placeHolder: 'Please type first name',
    },
    {
      field: 'mname',
      label: 'Middle Name',
      placeHolder: 'Please type middle name',
    },
    {
      field: 'lname',
      label: 'Last Name',
      placeHolder: 'Please type last name',
    },
    {
      type: 'email',
      field: 'email',
      label: 'Email',
      placeHolder: 'Please type Email',
    },
    {
      field: 'address',
      label: 'Address',
      placeHolder: 'Please type address',
    },

    {
      custom: {
        Jsx: ({ onAnyChange, fields, errors }) => (
          <UserRequiredFields
            onAnyChange={onAnyChange}
            fields={fields}
            errors={errors}
          />
        ),
      },
    },
  ],
  onError: (v) => console.log(v),
  validationSchema: FormikValidation.register,
  onSubmit: async (
    { fname, mname, lname, email, address, status, role, ...other },
    { setSubmitting },
    fetch
  ) => {
    setSubmitting(true)
    const userDetails = {
      fname,
      mname,
      lname,
      email,
      address,
      status,
      role,
    }
    fetch({ ...userDetails, userData: { ...other } as any })
    setSubmitting(false)
  },
}

type ResponseDto<T> = {
  data: T[]
  total: number
}

export default function Applicants({
  limitParams,
  pageParams,
  searchParams,
  statusParams,
}: PageProps) {
  const { roles } = useUser()
  const { replace } = useRouter()
  const { query, pathname } = useNav()
  const { refetch, data } = useApi<
    ResponseDto<User>,
    {
      page: number
      limit: number
      other: GetAllUserType
    }
  >(getAllUser, true)

  useEffect(() => {
    refetch({
      page: pageParams,
      limit: limitParams,
      other: {
        search: searchParams,
        role: [Roles.USER],
        status: UserStatus.VERIFIED,
      },
    })
  }, [limitParams, pageParams, searchParams, statusParams])

  const userData: User[] = data ? (!!data.data ? data.data : []) : []
  const total = data?.total ?? 0

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Applicants" textProps={{ textAlign: 'start' }}>
        <CustomTable
          isCheckboxEnabled={roles.isAdminWrite || roles.isSuper}
          dataCols={[
            { field: 'id', name: 'ID' },
            {
              name: 'Name',
              custom: (d) => <>{`${d.lname}, ${d.fname} ${d.mname}`}</>,
            },

            {
              field: 'email',
              name: 'Email',
            },

            {
              field: 'status',
              name: 'Status',
              items: {
                itemValues: ['All', UserStatus.ACTIVE, UserStatus.EXPELLED],
                onChange: (v: string | UserStatus) => {
                  const queries = { ...query }
                  if (v === 'All') {
                    delete queries.status
                  } else {
                    queries.status = v
                  }
                  replace(
                    pathname +
                      '?' +
                      new URLSearchParams({
                        ...queries,
                        page: '0',
                        search: '',
                        limit: '',
                      }).toString()
                  )
                },
              },
            },
            {
              name: 'Action',
              custom: (d, i) => {
                const isSuper = d.roles.some((v) => v.name === Roles.SUPER)
                return (
                  <Flex flexDirection={'row'} key={i}>
                    {isSuper ? (
                      <Text fontWeight={700}>Super User</Text>
                    ) : (
                      <Text key={i}>
                        {d.roles
                          .map((v) =>
                            v.name === Roles.ADMIN_READ
                              ? 'Read'
                              : v.name === Roles.ADMIN_WRITE
                              ? 'Write'
                              : null
                          )
                          .filter((v) => !!v)
                          .join(',')}
                      </Text>
                    )}
                  </Flex>
                )
              },
            },
          ]}
          dataRow={userData}
          page={pageParams}
          pageSize={limitParams}
          total={total}
          rowIdentifierField={'id'}
          handleChangePage={(_, p) => {
            replace(
              pathname +
                '?' +
                new URLSearchParams({
                  ...query,
                  page: p.toString(),
                }).toString()
            )
          }}
          onSearch={(v) => {
            replace(
              pathname +
                '?' +
                new URLSearchParams({
                  ...query,
                  page: '0',
                  search: v,
                }).toString()
            )
          }}
          handleChangeRowsPerPage={(e) =>
            replace(
              pathname +
                '?' +
                new URLSearchParams({
                  ...query,
                  page: '0',
                  limit: parseInt(e.target.value).toString(),
                }).toString()
            )
          }
        >
          {(selected, setSelected) => (
            <ConfirmationModal
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={() => {
                if (pathname !== '/admin/scholars/') replace(pathname)
                else
                  refetch({
                    page: 0,
                    limit: 20,
                    other: {
                      role: [
                        Roles.ADMIN,
                        Roles.SUPER,
                        Roles.ADMIN_READ,
                        Roles.ADMIN_WRITE,
                      ],
                    },
                  })
              }}
              modalCreate={
                roles.isAdmin || roles.isSuper ? modalInitial : undefined
              }
              onRemove={async () => {
                // await deleteService({ ids: selected })
              }}
            />
          )}
        </CustomTable>
      </Section>
    </Flex>
  )
}
export async function getServerSideProps(context: any) {
  let limitParams: number = Number(context.query.limit) || 20
  let pageParams: number = Number(context.query.page) || 0
  let searchParams: string = context.query.search || ''
  let statusParams: string = context.query.status || ''

  return {
    props: { limitParams, pageParams, searchParams, statusParams },
  }
}
