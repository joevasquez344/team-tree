import React from 'react'
import {useAuth} from '../../context/auth/AuthContext'

const Auth = ({Component, pageProps}) => {
    const {authUser} = useAuth()
  return (
    <Component {...pageProps} />
  )
}

export default Auth