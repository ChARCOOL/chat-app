import { useState } from 'react'
import { Card, TextField, Button } from '@material-ui/core'
import { toast } from 'react-toastify'

import { resendVerificationQuery } from '../../utils/client'

const ResendVerification = () => {
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
      <Card className="w-10/12 h-5/6 flex flex-col justify-center items-center">
        <div className="relative -top-16">
          <p className="text-2xl font-bold font-mono">Resend Verification</p>
        </div>
        <form className="flex flex-col items-center mt-14" onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(emailError)}
            helperText={Boolean(emailError) && emailError}
          />
          <div className="mt-10">
            <Button
              className="w-40 transform transition duration-75 ease-in-out active:scale-95 hover:scale-105"
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
            >
              Resend
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ResendVerification
