import React, { memo, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../../components/sections'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi, useApiPost, useUser } from 'hooks'
import { useRouter } from 'next/navigation'
import { useRouter as useNav } from 'next/router'

import {
  AreYouSure,
  ButtonModal,
  ConfirmationModal,
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
  updateUser,
} from 'api'
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
import {
  CreateUserType,
  UserInformation,
  UserRequiredFields,
} from 'components/user-admin-comps'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  statusParams?: string
}

const modalInitial: ModalFlexProps<CreateUserType, RegisterDto> = {
  api: createUser,

  modalText: 'Add new application',
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

  const refreshItems = () => {
    if (asPath !== '/admin/applicants/') replace(pathname)
    else
      refetch({
        page: 0,
        limit: 20,
        other: {
          role: [Roles.USER],
          status: [UserStatus.VERIFIED],
        },
      })
  }

  useEffect(() => {
    refetch({
      page: pageParams,
      limit: limitParams,
      other: {
        search: searchParams,
        role: [Roles.USER],
        status: [UserStatus.VERIFIED],
      },
    })
  }, [limitParams, pageParams, searchParams])

  const userData: User[] = data ? (!!data.data ? data.data : []) : []
  const total = data?.total ?? 0

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Applicants" textProps={{ textAlign: 'start' }}>
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
              name: 'Actions',
              isNumber: true,
              custom: (d, i) => {
                return (
                  <Flex flexDirection={'column'} key={i} sx={{ gap: 2 }}>
                    <ButtonModal
                      title="User Information"
                      titleProps={{
                        as: 'h2',
                      }}
                      modalChild={({ setOpen }) => (
                        <UserInformation
                          id={d.id}
                          onSuccess={() => {
                            refreshItems()
                            setOpen(false)
                          }}
                          isDisabled={true}
                          isAcceptReject={roles.isAdminWrite || roles.isSuper}
                        />
                      )}
                    >
                      View
                    </ButtonModal>
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
                roles.isAdminWrite || roles.isSuper ? modalInitial : undefined
              }
              onRemove={async () => {
                await deleteRole({ ids: selected }, [Roles.USER])
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
