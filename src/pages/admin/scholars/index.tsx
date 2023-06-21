import React, { useEffect } from 'react'
import { Flex, Text } from 'rebass'

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

import {
  GetAllUserType,
  createUser,
  deleteRole,
  getAllUser,
  updateUser,
} from 'api'
import { Roles, User, UserStatus } from 'entities'

import { RegisterDto } from 'constant'

import { CreateUserType, UserRequiredFields } from 'components/user-admin-comps'
import { UserInformation } from 'components/user-admin-comps/user-information'
import { format } from 'date-fns'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  statusParams?: string
}

const modalInitial: ModalFlexProps<CreateUserType, RegisterDto> = {
  api: createUser,

  modalText: 'Add new scholar',
  initial: {
    fname: '',
    mname: '',
    lname: '',
    address: '',
    email: '',
    status: UserStatus.ACTIVE,
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
    fetch({ ...userDetails, userData: { ...other } as any } as any)
    setSubmitting(false)
  },
}

type ResponseDto<T> = {
  data: T[]
  total: number
}

export default function Scholars({
  limitParams,
  pageParams,
  searchParams,
  statusParams,
}: PageProps) {
  const { roles } = useUser()
  const { replace } = useRouter()
  const { query, pathname, asPath } = useNav()
  const { isSuccess, isFetching: isUpdating, callApi } = useApiPost(updateUser)

  const {
    refetch,
    data,
    isFetching: isFetchingData,
  } = useApi<
    ResponseDto<User>,
    {
      page: number
      limit: number
      other: GetAllUserType
    }
  >(getAllUser, true)

  const userData: User[] = data ? (!!data.data ? data.data : []) : []
  const total = data?.total ?? 0

  const refreshItems = () => {
    if (asPath !== '/admin/scholars/') replace(pathname)
    else
      refetch({
        page: 0,
        limit: 20,
        other: {
          role: [Roles.USER],
          status:
            statusParams === UserStatus.ACTIVE ||
            statusParams === UserStatus.EXPELLED
              ? ([statusParams] as any)
              : [UserStatus.ACTIVE, UserStatus.EXPELLED],
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
        status:
          statusParams === UserStatus.ACTIVE ||
          statusParams === UserStatus.EXPELLED
            ? ([statusParams] as any)
            : [UserStatus.ACTIVE, UserStatus.EXPELLED],
      },
    })
  }, [limitParams, pageParams, searchParams, statusParams])

  useEffect(() => {
    if (isSuccess) refreshItems()
  }, [isSuccess])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Scholars"
        textProps={{ textAlign: 'start' }}
        isFetching={isUpdating}
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
              name: 'Graduated Shs',
              custom: (d) => {
                return !!d.shsGraduated
                  ? format(new Date(d?.shsGraduated), 'cccc LLLL d, yyyy')
                  : '---'
              },
            },
            {
              name: 'Graduated College',
              custom: (d) => {
                return !!d.collegeGraduated
                  ? format(new Date(d?.collegeGraduated), 'cccc LLLL d, yyyy')
                  : '---'
              },
            },
            {
              name: 'Status',
              custom: (v) => {
                if (!v?.scholar || v?.scholar?.length === 0)
                  return (
                    <Text as={'h4'} color={'blue'}>
                      Not started
                    </Text>
                  )

                const value = v!.scholar!.sort(
                  (a: any, b: any) =>
                    new Date(b.created).getTime() -
                    new Date(a.created).getTime()
                )[0]
                return (
                  <Text
                    as={'h4'}
                    color={
                      v.status === UserStatus.EXPELLED ||
                      value.status === 'ended'
                        ? 'red'
                        : value.status === ('pending' as any)
                        ? 'blue'
                        : 'green'
                    }
                  >{`${
                    value.status === 'ended' && v.status !== UserStatus.EXPELLED
                      ? 'ENDED'
                      : value.status === ('pending' as any)
                      ? 'RENEWAL'
                      : v.status.toUpperCase()
                  }`}</Text>
                )
              },

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
                          isDisabled={!(roles.isSuper || roles.isAdminWrite)}
                        />
                      )}
                    >
                      View
                    </ButtonModal>
                    {(roles.isSuper || roles.isAdminWrite) && (
                      <ButtonModal
                        isSecondary={true}
                        title={
                          d?.status === UserStatus.ACTIVE
                            ? 'Expell User?'
                            : 'UnExpell User?'
                        }
                        titleProps={{
                          as: 'h3',
                        }}
                        width={['60%', '50%', '40%', '30%']}
                        modalChild={({ setOpen, onSubmit }) => (
                          <AreYouSure
                            setOpen={setOpen}
                            cancelText="No"
                            confirmText="Yes"
                            onSubmit={async () => {
                              await onSubmit()
                              setOpen(false)
                            }}
                          />
                        )}
                        onSubmit={() => {
                          callApi({
                            id: d.id,
                            status:
                              d.status === UserStatus.ACTIVE
                                ? UserStatus.EXPELLED
                                : UserStatus.ACTIVE,
                          })
                        }}
                      >
                        {d.status === UserStatus.ACTIVE
                          ? 'Expell'
                          : 'Reactivate'}
                      </ButtonModal>
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
              modalText="Add new Scholar"
              isFetchingData={isFetchingData}
              selected={selected}
              setSelected={setSelected}
              refetch={() => {
                refreshItems()
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
