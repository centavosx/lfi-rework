import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
} from 'react'
import { Flex } from 'rebass'

import { Section } from '../../../components/sections'

import { CustomTable } from 'components/table'

import { useApi, useUser } from 'hooks'

import {
  ButtonModal,
  ConfirmationModal,
  ModalFlexProps,
} from 'components/modal'
import { FormikValidation } from 'helpers'

import { GetAllUserType, createUser, deleteRole, getAllUser } from 'api'
import { Roles, User, UserStatus } from 'entities'

import { RegisterDto } from 'constant'

import {
  CreateUserType,
  UserInformation,
  UserRequiredFields,
} from 'components/user-admin-comps'

const modalInitial: ModalFlexProps<CreateUserType, RegisterDto> = {
  api: createUser,

  modalText: 'Add new application',
  initial: {
    fname: '',
    mname: '',
    lname: '',
    address: '',
    email: '',
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

const Applicants = forwardRef(
  (
    {
      userStatus,
      title,
      withAdd,
      onAccepted,
      onRejected,
      isActive,
    }: {
      userStatus: UserStatus
      title: string
      withAdd?: boolean
      onAccepted?: () => void
      onRejected?: () => void
      isActive?: boolean
    },
    ref
  ) => {
    const { roles } = useUser()

    const [{ searchParams, limitParams, pageParams }, setParams] = useState({
      searchParams: '',
      limitParams: 20,
      pageParams: 0,
    })
    const { refetch, data, isFetching } = useApi<
      ResponseDto<User>,
      {
        page: number
        limit: number
        other: GetAllUserType
      }
    >(getAllUser, true)

    const refreshItems = useCallback(() => {
      if (searchParams === '' && pageParams === 0 && limitParams === 20) {
        refetch({
          page: 0,
          limit: 20,
          other: {
            search: '',
            role: [Roles.USER],
            status: [userStatus],
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
          status: [userStatus],
        },
      })
    }, [limitParams, pageParams, searchParams])

    const userData: User[] = data ? (!!data.data ? data.data : []) : []
    const total = data?.total ?? 0

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
      <Section title={title} textProps={{ textAlign: 'start' }}>
        <CustomTable
          maxTableHeight={500}
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
            ...(userStatus === UserStatus.CANCELED
              ? [
                  {
                    field: 'reason' as unknown as keyof User,
                    name: 'Reason',
                  },
                ]
              : []),
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
                          onAccepted={onAccepted}
                          onRejected={onRejected}
                          isDisabled={true}
                          isAcceptReject={roles.isAdminWrite || roles.isSuper}
                          isApplicant={true}
                          status={
                            isActive ? UserStatus.ACTIVE : UserStatus.PROCESSING
                          }
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
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              isFetchingData={isFetching}
              refetch={() => {
                refreshItems()
              }}
              modalCreate={
                (roles.isAdminWrite || roles.isSuper) && withAdd
                  ? modalInitial
                  : undefined
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

Applicants.displayName = 'forwardApplicants'

export default function ApplicantPage() {
  const pendingRef = useRef<any>(null)
  const processRef = useRef<any>(null)
  const rejectRef = useRef<any>(null)

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Applicants
        ref={pendingRef}
        key={0}
        userStatus={UserStatus.VERIFIED}
        title="Pending Applicants"
        onAccepted={() => {
          processRef?.current?.refreshItems()
        }}
        onRejected={() => {
          rejectRef?.current?.refreshItems()
        }}
        withAdd={true}
      />
      <Applicants
        ref={processRef}
        key={1}
        userStatus={UserStatus.PROCESSING}
        title="On Processing"
        isActive={true}
        onRejected={() => {
          rejectRef?.current?.refreshItems()
        }}
      />
      <Applicants
        ref={rejectRef}
        key={2}
        userStatus={UserStatus.CANCELED}
        title="Rejected"
        onAccepted={() => {
          processRef?.current?.refreshItems()
        }}
      />
    </Flex>
  )
}
