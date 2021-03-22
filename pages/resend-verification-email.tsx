import { useState } from 'react'
import { Card, TextField, Button } from '@material-ui/core'
import { toast } from 'react-toastify'

import { resendVerificationQuery } from '../utils/client'

const ResendVerificationEmail = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setEmailError('')
    setLoading(true)

    if (email.length <= 0) {
      setEmailError('This field is required')

      setLoading(false)
      return
    }

    const { data } = await resendVerificationQuery(email)

    if (data.data == null) {
      setEmailError(data.errors[0].message)

      setLoading(false)
      return
    }

    toast.success('Successfully resend verification, check your email')

    setLoading(false)
    return
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="relative w-10/12 h-5/6 p-5 flex flex-col justify-center items-center">
        <p className="absolute top-20 text-3xl font-bold font-mono">Resend Verification</p>
        <form className="w-56 h-32 flex flex-col justify-between" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(emailError)}
            helperText={Boolean(emailError) && emailError}
          />
          <Button color="primary" variant="contained" type="submit" disabled={loading}>
            Resend
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default ResendVerificationEmail
