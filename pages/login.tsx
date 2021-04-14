import { useRouter } from 'next/router'
import { Card, TextField, Button } from '@material-ui/core'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import { loginQuery } from '../utils/client'

const Login = () => {
  const router = useRouter()

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('This field is required'),
    password: yup
      .string()
      .min(8, 'Must be minimum 8 characters')
      .max(32, 'Must be maximum 32 characters')
      .required('This field is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { data } = await loginQuery(values)

      if (data.data == null) {
        toast.error(data.errors[0].message)
        return
      }

      toast.success('Successfully logged in, redirecting to homepage')

      setTimeout(() => router.push('/', null, { shallow: true }), 2500)
      return
    },
  })

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="w-10/12 h-5/6 flex flex-col justify-center items-center">
        <div className="relative -top-16">
          <p className="text-3xl font-bold font-mono">Log in</p>
        </div>
        <form className="flex flex-col items-center" onSubmit={formik.handleSubmit}>
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
          <div className="mt-10">
            <Button
              className="w-40 transform transition duration-75 ease-in-out active:scale-95 hover:scale-105"
              color="primary"
              variant="contained"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Login
