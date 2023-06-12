import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../../components/sections'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi, useApiPost, useUser } from 'hooks'
import { useRouter } from 'next/navigation'
import { useRouter as useNav } from 'next/router'

import {
  AreYouSure,
  ConfirmationModal,
  CustomModal,
  ModalFlexProps,
} from 'components/modal'
import { FormikValidation } from 'helpers'
import { AdminMain } from 'components/main'
import { PageLoading } from 'components/loading'
import {
  GetAllUserType,
  createUser,
  deleteRole,
  getAllUser,
  updateRole,
} from 'api'
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
  const { query, pathname, asPath } = useNav()
  const { refetch, data } = useApi<
    ResponseDto<User>,
    {
      page: number
      limit: number
      other: GetAllUserType
    }
  >(getAllUser, true)

  const { isSuccess, isFetching, callApi } = useApiPost(updateRole)

  const refreshItems = () => {
    if (asPath !== '/admin/admins/') replace(pathname)
    else
      refetch({
        page: 0,
        limit: 20,
        other: {
          role: [Roles.ADMIN, Roles.SUPER, Roles.ADMIN_READ, Roles.ADMIN_WRITE],
        },
      })
  }

  useEffect(() => {
    if (isSuccess) {
      refreshItems()
    }
  }, [isSuccess])

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
      <Section
        title="Admins"
        textProps={{ textAlign: 'start' }}
        isFetching={isFetching}
      >
        <CustomTable
          isCheckboxEnabled={roles.isSuper}
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
                let isSuper = false
                let isRead = false
                let isWrite = false

                d.roles.forEach((v) => {
                  if (v.name === Roles.ADMIN_READ) isRead = true
                  if (v.name === Roles.SUPER) isSuper = true
                  if (v.name === Roles.ADMIN_WRITE) isWrite = true
                })

                return (
                  <Flex flexDirection={'row'} key={i}>
                    {isSuper ? (
                      <Text fontWeight={700}>Super User</Text>
                    ) : roles.isSuper ? (
                      <Flex flexDirection={'row'} sx={{ gap: 2 }}>
                        <CustomModal
                          title={
                            !isRead
                              ? 'Give Read Access?'
                              : 'Remove Read Access?'
                          }
                          titleProps={{
                            as: 'h3',
                            width: 'auto',
                          }}
                          width={['60%', '50%', '40%', '30%']}
                          modalChild={({ setOpen, onSubmit }) => (
                            <AreYouSure
                              cancelText="No"
                              confirmText="Yes"
                              setOpen={setOpen}
                              onSubmit={onSubmit}
                            />
                          )}
                          onSubmit={() => {
                            callApi({
                              id: d.id,
                              role: !isRead
                                ? [
                                    ...d.roles.map((v) => v.name),
                                    Roles.ADMIN_READ,
                                  ]
                                : d.roles
                                    .map((v) => v.name)
                                    .filter((v) => v !== Roles.ADMIN_READ),
                            })
                          }}
                        >
                          {({ setOpen }) => (
                            <FormControlLabel
                              label="Read"
                              control={
                                <Checkbox
                                  checked={isRead}
                                  onClick={() => {
                                    setOpen(true)
                                  }}
                                />
                              }
                            />
                          )}
                        </CustomModal>

                        <CustomModal
                          title={
                            !isWrite
                              ? 'Give Write Access?'
                              : 'Remove Write Access?'
                          }
                          titleProps={{
                            as: 'h3',
                            width: 'auto',
                          }}
                          width={['60%', '50%', '40%', '30%']}
                          modalChild={({ setOpen, onSubmit }) => (
                            <AreYouSure
                              cancelText="No"
                              confirmText="Yes"
                              setOpen={setOpen}
                              onSubmit={onSubmit}
                            />
                          )}
                          onSubmit={() => {
                            callApi({
                              id: d.id,
                              role: !isWrite
                                ? [
                                    ...d.roles.map((v) => v.name),
                                    Roles.ADMIN_WRITE,
                                  ]
                                : d.roles
                                    .map((v) => v.name)
                                    .filter((v) => v !== Roles.ADMIN_WRITE),
                            })
                          }}
                        >
                          {({ setOpen }) => (
                            <FormControlLabel
                              label="Write"
                              control={
                                <Checkbox
                                  checked={isWrite}
                                  onClick={() => {
                                    setOpen(true)
                                  }}
                                />
                              }
                            />
                          )}
                        </CustomModal>
                      </Flex>
                    ) : (
                      <Text fontWeight={400}>
                        {d.roles.map((v) => v.name).join(',')}
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
                refreshItems()
              }}
              modalCreate={roles.isSuper ? modalInitial : undefined}
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
