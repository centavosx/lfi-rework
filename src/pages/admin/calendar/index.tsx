import { useState } from 'react'
import { EventCalendar, Event } from 'components/calendar'
import { AdminMain } from 'components/main'
import { ButtonModal, CustomModal } from 'components/modal'
import { ListContainer, ListItem } from 'components/ul'
import { format } from 'date-fns'
import { Flex, Text } from 'rebass'
import { AreYouSure } from 'components/are-you-sure'
import { AiFillPlusCircle } from 'react-icons/ai'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Formik } from 'formik'
import { StartAndEnd } from 'components/dates/StartAndEnd'
import { Button } from 'components/button'
import { FormikValidation } from 'helpers'
import { theme } from 'utils/theme'
import { EventDto } from 'constant'

const CreatEvent = () => {
  return (
    <Formik<EventDto<number>>
      initialValues={{
        name: '',
        description: '',
        startDate: 0,
        endDate: 0,
      }}
      validationSchema={FormikValidation.createEvent}
      validateOnMount={true}
      onSubmit={(v) => {
        console.log(v)
      }}
    >
      {({ setFieldValue }) => (
        <FormContainer marginTop={20} flexProps={{ sx: { gap: 3 } }}>
          <FormInput
            name="name"
            label="Event Name"
            placeholder="Type event name"
          />
          <FormInput
            name="description"
            label="Event Description"
            placeholder="Type event description"
            multiline={true}
            variant="outlined"
            inputcolor={{
              labelColor: 'gray',
              backgroundColor: 'white',
              borderBottomColor: theme.mainColors.first,

              color: 'black',
            }}
            maxRows={7}
            padding={20}
            paddingBottom={14}
            sx={{ color: 'black', width: '100%' }}
          />
          <StartAndEnd
            onChangeDate={(d) => {
              setFieldValue('startDate', d.start.getTime())
              setFieldValue('endDate', d.end.getTime())
            }}
          />
          <Button type="submit" style={{ width: 150 }}>
            Submit
          </Button>
        </FormContainer>
      )}
    </Formik>
  )
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 4,
        padding: 4,
        width: '100%',
      }}
    >
      <CustomModal
        title={format(selectedDate, 'cccc LLLL d, yyyy hh:mm a')}
        titleProps={{ as: 'h3' }}
        maxHeight={'80%'}
        modalChild={
          <Flex flexDirection={'column'} sx={{ gap: 4, mt: 3 }}>
            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Text as={'h4'} fontWeight={600}>
                Earliest Event
              </Text>
              <ListContainer>
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
              </ListContainer>
            </Flex>
            <Flex flexDirection={'column'} sx={{ gap: 2 }}>
              <Text as={'h4'}>Next Events</Text>
              <ListContainer>
                <Event
                  eventName="Valorant"
                  from={'9:00 am'}
                  to="11:00 pm"
                  description="Hello, test only test"
                />
              </ListContainer>
            </Flex>
          </Flex>
        }
      >
        {({ isOpen, setOpen }) => (
          <Flex
            flexDirection={[
              'column-reverse',
              'column-reverse',
              'column-reverse',
              'row',
            ]}
            sx={{ gap: 4 }}
          >
            <Flex flex={0.2} flexDirection={'column'} sx={{ gap: 3 }}>
              <Flex flex={1} flexDirection={'column'}>
                <Text as={'h4'} width={'100%'}>
                  Announcements
                </Text>
                <hr style={{ width: '100%' }} />
                <Text>dwadwad dawd awdad </Text>
              </Flex>
              <Flex flex={1} flexDirection={'column'}>
                <Flex alignItems={'center'}>
                  <Text as={'h4'} width={'100%'}>
                    Events Today
                  </Text>
                  <CustomModal
                    title={format(selectedDate, 'cccc LLLL d, yyyy hh:mm a')}
                    titleProps={{ as: 'h3' }}
                    maxHeight={'80%'}
                    modalChild={<CreatEvent />}
                  >
                    {({ isOpen: o, setOpen: setO }) => (
                      <AiFillPlusCircle
                        size={24}
                        cursor={'pointer'}
                        onClick={() => setO(true)}
                      />
                    )}
                  </CustomModal>
                </Flex>
                <hr style={{ width: '100%' }} />
                <ListContainer>
                  <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
                  <ListItem style={{ marginLeft: '-15px' }}>dawd</ListItem>
                </ListContainer>
              </Flex>
            </Flex>
            <EventCalendar
              setSelectedDate={setSelectedDate}
              setOpen={setOpen}
              isOpen={isOpen}
            />
          </Flex>
        )}
      </CustomModal>
    </Flex>
  )
}
