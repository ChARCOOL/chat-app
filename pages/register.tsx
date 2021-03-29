import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, Button, IconButton, TextField, CircularProgress } from '@material-ui/core'
import { ReloadOutlined } from '@ant-design/icons'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'

import { getUserQuery, createUserQuery } from '../utils/client'

const Register: React.FC = () => {
  const router = useRouter()

  const [usernameLoading, setUsernameLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('This field is required')
      .min(6, 'Must be minimum 6 characters')
      .max(16, 'Must be maximum 16 characters'),
    email: yup.string().required('This field is required').email('Invalid email address'),
    password: yup
      .string()
      .required('This field is required')
      .min(8, 'Must be minimum 8 characters')
      .max(32, 'Must be maximum 32 characters'),
    passwordConfirm: yup
      .string()
      .required('This field is required')
      .oneOf([yup.ref('password'), null], "Passwords doesn't match match"),
    inviteCode: yup.string().required('This field is required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      inviteCode: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { data } = await createUserQuery(values)

      if (data.data == null) {
        if (data.errors[0].message.includes('email'))
          formik.setFieldError('email', 'Email is taken')

        if (data.errors[0].message.includes('username'))
          formik.setFieldError('username', 'Username is taken')

        if (data.errors[0].message.includes('invite'))
          formik.setFieldError('inviteCode', data.errors[0].message)
      } else {
        toast.success('Successfully registered, check your email for verification')

        setTimeout(() => router.push('/', null, { shallow: true }), 2500)
        return
      }
    },
  })

  const checkUsername = async () => {
    setUsernameLoading(true)

    const {
      data: { data },
    } = await getUserQuery({ username: formik.values.username })

    if (data == null) formik.setFieldError('username', 'Username is taken')

    setUsernameLoading(false)
  }

  const checkEmail = async () => {
    setEmailLoading(true)

    const {
      data: { data },
    } = await getUserQuery({ email: formik.values.email })

    if (data == null) formik.setFieldError('email', 'Email is taken')

    setEmailLoading(false)
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="w-10/12 h-5/6 p-5 flex flex-col justify-center">
        <div className="mt-2 text-center">
          <p className="text-3xl font-bold font-mono">Register</p>
        </div>
        <form className="flex flex-col items-center mt-14" onSubmit={formik.handleSubmit}>
          <div className="relative flex items-center">
            {usernameLoading ? (
              <CircularProgress size={25} className="m-auto mt-5" style={{ color: 'black' }} />
            ) : (
              <>
                <IconButton
                  onClick={checkUsername}
                  className="-left-10 top-5"
                  style={{ outline: 0, position: 'absolute', padding: 0 }}
                >
                  <ReloadOutlined />
                </IconButton>
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
              </>
            )}
          </div>
          <div className="relative flex items-center">
            {emailLoading ? (
              <CircularProgress size={25} className="m-auto mt-5" style={{ color: 'black' }} />
            ) : (
              <>
                <IconButton
                  onClick={checkEmail}
                  className="-left-10 top-5"
                  style={{ outline: 0, position: 'absolute', padding: 0 }}
                >
                  <ReloadOutlined />
                </IconButton>
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
              </>
            )}
          </div>
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
            id="inviteCode"
            name="inviteCode"
            label="Invite Code"
            type="text"
            value={formik.values.inviteCode}
            onChange={formik.handleChange}
            error={Boolean(formik.values.inviteCode) && Boolean(formik.errors.inviteCode)}
            helperText={Boolean(formik.values.inviteCode) && formik.errors.inviteCode}
          />
          <div className="text-center mt-10">
            <Button
              className="w-40 transform transition duration-75 ease-in-out active:scale-95 hover:scale-105"
              color="primary"
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
              I am already member
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Register
