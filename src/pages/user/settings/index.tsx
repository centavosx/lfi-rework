import { useEffect } from 'react'
import { updateMe } from 'api'
import { Button } from 'components/button'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Loading } from 'components/loading'
import { Section } from 'components/sections'
import { UserInformation } from 'components/user-admin-comps'
import { Formik } from 'formik'
import { FormikValidation } from 'helpers'
import { useApiPost, useUser } from 'hooks'
import { Flex } from 'rebass'
import { CustomModal } from 'components/modal'
import { AreYouSure } from 'components/are-you-sure'

const ChangePassword = () => {
  const { callApi, isFetching, isSuccess, error } = useApiPost(updateMe)
  useEffect(() => {
    if (isSuccess) alert('Password successfuly changed')
  }, [isSuccess])
  useEffect(() => {
    if (!!error) alert(error.response.data.message || 'Invalid password')
  }, [error])
  return (
    <Formik
      initialValues={{ old: '', password: '', confirm: '' }}
      onSubmit={(values) => {
        callApi({
          old: values.old,
          password: values.password,
        })
        values.old = ''
        values.password = ''
        values.confirm = ''
      }}
      validateOnMount={true}
      validationSchema={FormikValidation.changePassword}
    >
      {({ values, submitForm, isValid }) => {
        return (
          <FormContainer label="Change Password">
            {isFetching && <Loading />}
            <FormInput
              style={{ marginTop: 20 }}
              name="old"
              label="Old password"
              type="password"
              value={values.old}
              placeholder="Old password"
            />

            <FormInput
              name="password"
              type="password"
              label="New password"
              value={values.password}
              placeholder="New password"
            />
            <FormInput
              name="confirm"
              type="password"
              label="Confirm password"
              value={values.confirm}
              placeholder="Confirm password"
            />
            <CustomModal
              width={250}
              title="Change password?"
              titleProps={{ as: 'h4' }}
              modalChild={({ setOpen }) => (
                <AreYouSure
                  message="Are you sure?"
                  onClick={(v) => {
                    !!v && submitForm()
                    setOpen(false)
                  }}
                />
              )}
            >
              {({ setOpen }) => (
                <Button
                  onClick={() => setOpen(true)}
                  style={{ width: 120, alignSelf: 'flex-end' }}
                  disabled={!isValid}
                >
                  Change
                </Button>
              )}
            </CustomModal>
          </FormContainer>
        )
      }}
    </Formik>
  )
}
export default function Settings() {
  const { user } = useUser()

  return (
    <Flex sx={{ width: '100%' }}>
      <Section
        title="Settings"
        textProps={{ textAlign: 'start', as: 'h2' }}
        contentProps={{ width: '100%', pl: [16, '5%'], pr: [16, '5%'] }}
      >
        <UserInformation id={user?.id ?? ''} isUser={true} />
        <ChangePassword />
      </Section>
    </Flex>
  )
}
