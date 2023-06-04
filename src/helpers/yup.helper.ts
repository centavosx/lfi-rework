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

  createAppointment: Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    time: Yup.string().required('Required'),
    serviceId: Yup.string().required('Required'),
    name: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    message: Yup.string().min(1, 'Too Short!').max(5000, 'Too Long!'),
    petName: Yup.string().required('Required'),

    birthDate: Yup.string().required('Required'),

    age: Yup.number().min(0).required('Required'),

    gender: Yup.string().required('Required'),
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
    program: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    ...DISPLAY_FILES.reduce((prev, curr) => {
      if (
        curr.name === 'waterBill' ||
        curr.name === 'electricBill' ||
        curr.name === 'wifiBill' ||
        curr.name === 'enrollmentSlip'
      )
        return prev
      return { ...prev, [curr.name]: Yup.string().required('Required') }
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
