import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../../components/sections'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi, useUserGuard } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { FormikValidation } from 'helpers'
import { AdminMain } from 'components/main'
import { PageLoading } from 'components/loading'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

type ScholarTypes = {
  id: string
  name: string
  description: string
}

const modalInitial: ModalFlexProps<ScholarTypes> = {
  isError: true,

  modalText: 'Add new service',
  availableText: 'This service is already available',
  initial: {
    id: '',
    name: '',
    description: '',
  },
  fields: [
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
      important: {
        onSearch: async (val) => {},
      },
    },
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
      important: {
        onSearch: async (val) => {},
      },
    },
    {
      field: 'description',
      label: 'Description',
      placeHolder: 'Please type description',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)

    try {
    } finally {
      setSubmitting(false)
    }
  },
}

export default function Services({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const { replace, query, pathname } = useRouter()

  const { isLoading, isReplacing } = useUserGuard()

  if (isLoading || isReplacing) return <PageLoading />

  return (
    <AdminMain>
      <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
        <Section title="Services" textProps={{ textAlign: 'start' }}>
          <CustomTable
            isCheckboxEnabled={true}
            dataCols={[
              { field: 'id', name: 'ID' },
              {
                field: 'name',
                name: 'Name',
              },
              {
                field: 'description',
                name: 'Description',
              },
            ]}
            dataRow={[{ id: '', name: '', description: '' }]}
            page={pageParams}
            pageSize={limitParams}
            total={0}
            rowIdentifierField={'id'}
            handleChangePage={(_, p) => {
              replace({
                pathname,
                query: {
                  ...query,
                  page: p,
                },
              })
            }}
            onSearch={(v) => {
              replace({
                pathname,
                query: {
                  ...query,
                  page: 0,
                  search: v,
                },
              })
            }}
            handleChangeRowsPerPage={(e) =>
              replace({
                pathname,
                query: {
                  ...query,
                  page: 0,
                  limit: parseInt(e.target.value),
                },
              })
            }
          >
            {(selected, setSelected) => (
              <ConfirmationModal
                modalText="Assign Admin"
                selected={selected}
                setSelected={setSelected}
                refetch={() => {}}
                modalCreate={modalInitial}
                onRemove={async () => {
                  // await deleteService({ ids: selected })
                }}
                modalEdit={{
                  onSubmit: async (v, { setSubmitting }) => {
                    setSubmitting(true)
                    try {
                      // await updateService(v)
                      alert('Success')
                    } catch (v: any) {
                      alert(v?.response?.data?.message || 'Error')
                    } finally {
                      setSubmitting(false)
                    }
                  },
                  data: [],
                  // data: data?.data
                  //   .filter((v) => selected.includes(v.id))
                  //   .map((v) => {
                  //     return {
                  //       title: v.id,
                  //       initial: {
                  //         id: v.id,
                  //         name: v.name,
                  //         description: v.description,
                  //       },
                  //       data: [
                  //         {
                  //           type: 'text',
                  //           field: 'name',
                  //           disabled: false,
                  //           label: 'Name',
                  //           placeHolder: 'Type name',
                  //         },
                  //         {
                  //           type: 'text',
                  //           field: 'description',
                  //           disabled: false,
                  //           label: 'Desccription',
                  //           placeHolder: 'Type description',
                  //         },
                  //       ],
                  //     }
                  //   }),
                }}
              />
            )}
          </CustomTable>
        </Section>
      </Flex>
    </AdminMain>
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
