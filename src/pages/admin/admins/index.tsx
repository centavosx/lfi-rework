import React, { useCallback, useEffect, useState } from 'react'
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
import { GetAllUserType, createUser, deleteRole, getAllUser } from 'api'
import { Roles, User, UserStatus } from 'entities'
import { Input } from 'components/input'
import { Checkbox, FormControlLabel } from '@mui/material'
import { RegisterDto } from 'constant'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

type NewAdminProp = {
  fname: string
  mname?: string
  lname: string
  address: string
  email: string
  status: UserStatus
  role: Roles[]
}

const modalInitial: ModalFlexProps<NewAdminProp, RegisterDto> = {
  api: createUser,
  modalText: 'Add new admin',
  initial: {
    fname: '',
    mname: '',
    lname: '',
    address: '',
    email: '',
    status: UserStatus.ACTIVE,
    role: [Roles.ADMIN, Roles.ADMIN_READ],
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
        Jsx: ({ onAnyChange, fields }) => {
          return (
            <Flex flexDirection={'column'} mt={2} sx={{ gap: 3 }}>
              <Text as={'h3'} onClick={() => onAnyChange?.('email', 'dwad')}>
                Access?
              </Text>
              <Flex flexDirection={'column'} sx={{ gap: 2 }}>
                <FormControlLabel
                  label="Read"
                  control={
                    <Checkbox
                      checked={fields.role.includes(Roles.ADMIN_READ)}
                      onChange={(_, checked) => {
                        onAnyChange(
                          'role',
                          checked
                            ? [...fields.role, Roles.ADMIN_READ]
                            : fields.role.filter((v) => v !== Roles.ADMIN_READ)
                        )
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Write"
                  control={
                    <Checkbox
                      checked={fields.role.includes(Roles.ADMIN_WRITE)}
                      onChange={(_, checked) => {
                        onAnyChange(
                          'role',
                          checked
                            ? [...fields.role, Roles.ADMIN_WRITE]
                            : fields.role.filter((v) => v !== Roles.ADMIN_WRITE)
                        )
                      }}
                    />
                  }
                />
              </Flex>
            </Flex>
          )
        },
      },
    },
  ],
  onError: (v) => console.log(v),
  onSubmit: async (values, { setSubmitting }, fetch) => {
    setSubmitting(true)

    fetch(values)
    try {
    } finally {
      setSubmitting(false)
    }
  },
}

type ResponseDto<T> = {
  data: T[]
  total: number
}

export default function Admins({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const { roles } = useUser()
  const { replace } = useRouter()
  const { query, pathname, reload } = useNav()
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
        role: [Roles.ADMIN, Roles.SUPER, Roles.ADMIN_READ, Roles.ADMIN_WRITE],
      },
    })
  }, [limitParams, pageParams, searchParams])

  const userData: User[] = data ? (!!data.data ? data.data : []) : []
  const total = data?.total ?? 0

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Admins" textProps={{ textAlign: 'start' }}>
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
              name: 'Access',
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
                if (pathname !== '/admin/admins/') replace(pathname)
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
                await deleteRole({ ids: selected }, [
                  Roles.ADMIN,
                  Roles.SUPER,
                  Roles.ADMIN_READ,
                  Roles.ADMIN_WRITE,
                ])
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

  return {
    props: { limitParams, pageParams, searchParams },
  }
}
