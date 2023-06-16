import { DISPLAY_FILES } from 'constant'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)

export const FormikValidation = {
  createMail: Yup.object().shape({
    from: Yup.string().email('Please enter a valid email').required('Required'),
    subject: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    name: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    message: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
  }),

  renewal: Yup.object().shape({
    level: Yup.string().required('Required'),
    lastGwa: Yup.number().required('Required'),
    education: Yup.string().required('Required'),
    gradeSlip: Yup.string().required('Required'),
    program: Yup.string().nullable().required('Required'),
  }),
  createEvent: Yup.object().shape({
    name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    startDate: Yup.number()
      .typeError('Enter correct start date')
      .integer('Enter start date')
      .lessThan(
        Yup.ref('endDate'),
        'Start date should be earlier than end date'
      )
      .required('Please select date'),
    endDate: Yup.number()
      .typeError('Enter correct end date')
      .integer('Enter end date')
      .moreThan(Yup.ref('startDate'), 'End date must be higher than start date')
      .required('Please select date'),
  }),

  verify: Yup.object().shape({
    verification: Yup.string()
      .min(2, 'Too Short!')
      .required('Please enter a valid code'),
  }),

  login: Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    password: Yup.string().required('Required'),
  }),
  register: Yup.object().shape({
    fname: Yup.string().required('Required'),
    lname: Yup.string().required('Required'),
    level: Yup.string().required('Required'),
    lastGwa: Yup.number().required('Required'),
    education: Yup.string().required('Required'),
    program: Yup.string().nullable().required('Required'),
    address: Yup.string().required('Required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    ...DISPLAY_FILES.reduce((prev, curr) => {
      if (
        curr.name === 'waterBill' ||
        curr.name === 'electricBill' ||
        curr.name === 'wifiBill' ||
        curr.name === 'enrollmentBill'
      )
        return prev
      return {
        ...prev,
        [curr.name]: Yup.string().required('Required'),
      }
    }, {} as any),
  }),

  code: Yup.object().shape({
    code: Yup.string().required('Required'),
  }),
  reset: Yup.object().shape({
    password: Yup.string().trim().password().required('Required'),
    confirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  }),
  forgot: Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
  }),
}
