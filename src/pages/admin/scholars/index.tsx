import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
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
import {
  OnReject,
  UserInformation,
} from 'components/user-admin-comps/user-information'
import { format } from 'date-fns'

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

const Scholars = forwardRef(
  (
    {
      statusParams,
      title,
      onRejected,
    }: {
      statusParams: UserStatus.ACTIVE | UserStatus.EXPELLED
      title: string
      onRejected?: () => void
    },
    ref
  ) => {
    const { roles } = useUser()
    const {
      isSuccess,
      isFetching: isUpdating,
      callApi,
      state,
    } = useApiPost(updateUser)

    const [{ limitParams, pageParams, searchParams }, setParams] = useState({
      limitParams: 20,
      pageParams: 0,
      searchParams: '',
    })

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

    const refreshItems = useCallback(() => {
      if (searchParams === '' && pageParams === 0 && limitParams === 20) {
        refetch({
          page: 0,
          limit: 20,
          other: {
            search: '',
            role: [Roles.USER],
            status: [statusParams],
          },
        })
        return
      }
      setParams({
        searchParams: '',
        pageParams: 0,
        limitParams: 20,
      })
    }, [searchParams, pageParams, limitParams])

    useEffect(() => {
      refetch({
        page: pageParams,
        limit: limitParams,
        other: {
          search: searchParams,
          role: [Roles.USER],
          status: [statusParams],
        },
      })
    }, [limitParams, pageParams, searchParams, statusParams])

    useEffect(() => {
      if (isSuccess) refreshItems()
      if (isSuccess && state === 'expelled') onRejected?.()
    }, [isSuccess, refreshItems, state])

    useImperativeHandle(
      ref,
      () => {
        return {
          refreshItems,
        }
      },
      [refreshItems]
    )

    return (
      <Section
        title={title}
        textProps={{ textAlign: 'start' }}
        isFetching={isUpdating}
      >
        <CustomTable
          maxTableHeight={800}
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

            ...(statusParams === UserStatus.ACTIVE
              ? [
                  {
                    name: 'Graduated Shs' as keyof User,
                    custom: (d: any) => {
                      return !!d.shsGraduated
                        ? format(new Date(d?.shsGraduated), 'cccc LLLL d, yyyy')
                        : '---'
                    },
                  },
                  {
                    name: 'Graduated College' as keyof User,
                    custom: (d: any) => {
                      return !!d.collegeGraduated
                        ? format(
                            new Date(d?.collegeGraduated),
                            'cccc LLLL d, yyyy'
                          )
                        : '---'
                    },
                  },
                ]
              : [
                  {
                    field: 'reason' as unknown as keyof User,
                    name: 'Reason',
                  },
                ]),
            {
              name: 'Status',
              custom: (v) => {
                if (!!v.collegeGraduated)
                  return (
                    <Text as={'h4'} color={'#90ee90'}>
                      Graduated
                    </Text>
                  )
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
                    {(roles.isSuper || roles.isAdminWrite) &&
                      UserStatus.ACTIVE && (
                        <ButtonModal
                          isSecondary={true}
                          title={'Expell User?'}
                          titleProps={{
                            as: 'h3',
                          }}
                          width={['60%', '50%', '40%', '30%']}
                          modalChild={({ setOpen, onSubmit }) => (
                            <OnReject
                              setOpen={(v) => setOpen(v)}
                              onSubmit={async (v) => {
                                await onSubmit(v)
                                setOpen(false)
                              }}
                              reasons={[
                                'Sorry we noticed in your grade slip you failed a subject',
                                "You violated the foundation's rules",
                                'After the meeting about having low grades, sorry but we have to cancel the scholarship',
                              ]}
                            />
                          )}
                          onSubmit={(v) => {
                            callApi(
                              {
                                id: d.id,
                                status: UserStatus.EXPELLED,
                                reason: v,
                              },
                              'expelled'
                            )
                          }}
                        >
                          Expell
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
          handleChangePage={(_, pageParams) => {
            setParams((query) => ({ ...query, pageParams }))
          }}
          onSearch={(v) => {
            setParams((query) => ({ ...query, pageParams: 0, searchParams: v }))
          }}
          handleChangeRowsPerPage={(e) =>
            setParams((query) => ({
              ...query,
              pageParams: 0,
              limitParams: parseInt(e.target.value),
            }))
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
    )
  }
)
Scholars.displayName = 'forwardScholar'

export default function ScholarPage() {
  const activeRef = useRef<any>(null)
  const expellRef = useRef<any>(null)

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Scholars
        ref={activeRef}
        key={0}
        title="Scholars"
        statusParams={UserStatus.ACTIVE}
        onRejected={() => {
          expellRef?.current?.refreshItems()
        }}
      />
      <Scholars
        ref={expellRef}
        key={1}
        title="Expelled"
        statusParams={UserStatus.EXPELLED}
      />
    </Flex>
  )
}
