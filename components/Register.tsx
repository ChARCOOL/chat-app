import { useRouter } from 'next/router'
import { Card, Button, TextField } from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useQuery } from 'urql'

import { UserQuery } from '../utils'

const Register: React.FC = () => {
  const router = useRouter()

  const [result] = useQuery({
    query: UserQuery,
  })

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('This field is required')
      .min(6, 'Must be minimum 6 characters')
      .max(16, 'Must be maximum 16 characters')
      .test('is-username-taken', 'Username is taken', (value) => {
        if (value && value.length > 0) {
          const { data } = result

          return !data.getUser.some((user) => user.username.toLowerCase() === value.toLowerCase())
        }
      }),
    email: yup
      .string()
      .required('This field is required')
      .email('Invalid email address')
      .test('is-email-taken', 'Email is taken', (value) => {
        if (value && value.length > 0) {
          const { data } = result

          return !data.getUser.some((user) => user.email.toLowerCase() === value.toLowerCase())
        }
      }),
    password: yup
      .string()
      .required('This field is required')
      .min(8, 'Must be minimum 8 characters')
      .max(32, 'Must be maximum 32 characters'),
    passwordConfirm: yup
      .string()
      .required('This field is required')
      .oneOf([yup.ref('password'), null], "Passwords doesn't match match"),
    invitationCode: yup.string().required('This field is required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      invitationCode: '',
    },
    validationSchema,
    onSubmit: (values) => {},
  })

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="w-10/12 h-5/6 p-5 flex flex-col justify-center">
        <div className="mt-2 text-center">
          <p className="text-3xl font-bold font-mono">Register</p>
        </div>
        <form className="flex flex-col items-center mt-14" onSubmit={formik.handleSubmit}>
          <TextField
            id="username"
            name="username"
            label="Username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={Boolean(formik.values.username) && Boolean(formik.errors.username)}
            helperText={Boolean(formik.values.username) && formik.errors.username}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={Boolean(formik.values.email) && Boolean(formik.errors.email)}
            helperText={Boolean(formik.values.email) && formik.errors.email}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={Boolean(formik.values.password) && Boolean(formik.errors.password)}
            helperText={Boolean(formik.values.password) && formik.errors.password}
          />
          <TextField
            id="passwordConfirm"
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            value={formik.values.passwordConfirm}
            onChange={formik.handleChange}
            error={Boolean(formik.values.passwordConfirm) && Boolean(formik.errors.passwordConfirm)}
            helperText={Boolean(formik.values.passwordConfirm) && formik.errors.passwordConfirm}
          />
          <TextField
            id="invitationCode"
            name="invitationCode"
            label="Invitation Code"
            type="text"
            value={formik.values.invitationCode}
            onChange={formik.handleChange}
            error={Boolean(formik.values.invitationCode) && Boolean(formik.errors.invitationCode)}
            helperText={Boolean(formik.values.invitationCode) && formik.errors.invitationCode}
          />
          <div className="text-center mt-10">
            <Button
              className="w-48 transform transition duration-75 ease-in-out active:scale-95 hover:scale-105"
              style={{ backgroundColor: '#720058', color: '#FFFFFF' }}
              variant="contained"
              type="submit"
            >
              Register
            </Button>
            <p
              className="mt-5 cursor-pointer transform transition duration-75 ease-in-out active:scale-95 hover:scale-105"
              style={{ color: '#720058' }}
              onClick={() => router.push('/login', null, { shallow: true })}
            >
              I'am already member
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Register
