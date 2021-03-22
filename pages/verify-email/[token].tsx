import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Card, CircularProgress } from '@material-ui/core'
import { CheckCircleFilled, CloseCircleFilled, ArrowRightOutlined } from '@ant-design/icons'
import Link from 'next/link'

import { verifyEmailQuery } from '../../utils/client'

const verifyEmail: React.FC = () => {
  const router = useRouter()

  const { token } = router.query

  const [isVerified, setIsVerified] = useState<null | boolean>(null)

  useEffect(() => {
    if (typeof token === 'string') {
      verifyEmailQuery(token).then(({ data }) => {
        if (data.data == null) setIsVerified(false)
        else setIsVerified(true)
      })
    }
  }, [token])

  return (
    <div className="flex justify-center items-center w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="relative w-10/12 h-5/6 p-5 flex flex-col items-center">
        {isVerified == null ? (
          <CircularProgress
            className="absolute top-0 bottom-0 left-0 right-0 m-auto"
            color="primary"
            size={80}
          />
        ) : (
          <>
            <div className="absolute top-12 text-center">
              {isVerified === true ? (
                <CheckCircleFilled className="text-8xl pb-3" color="primary" />
              ) : (
                <CloseCircleFilled className="text-8xl pb-3" color="primary" />
              )}

              <p className="font-bold text-3xl pt-3">
                Verification {isVerified === true ? 'success' : 'failed'}
              </p>
            </div>
            <div className="absolute bottom-32 h-40 flex flex-col justify-between text-center text-lg">
              <p className="text-center ml-2.5 mr-2.5">
                {isVerified === true
                  ? 'Thank your for your support, we have successfully verified your email address. You can now proced to the log in page.'
                  : 'It looks like this verification link has expired, no worries you can still resend verification email'}
              </p>
              <span className="align-top transform hover:scale-105 active:scale-95 transition duration-75 ease-in-out">
                {isVerified === true ? (
                  <Link href="/login" shallow={true}>
                    <a style={{ color: '#720058' }}>
                      Take me to log in page <ArrowRightOutlined />
                    </a>
                  </Link>
                ) : (
                  <Link href="/resend-verification-email" shallow={true}>
                    <a style={{ color: '#720058' }}>
                      Resend verification email <ArrowRightOutlined />
                    </a>
                  </Link>
                )}
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default verifyEmail
