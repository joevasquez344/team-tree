import React, { useState } from 'react'

const useCheckbox = () => {
    const [passwordHidden, setPasswordHidden] = useState(true)
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true)

    const handlePasswordCheckbox = (e) => e.target.checked ? setPasswordHidden(false) : setPasswordHidden(true)

    const handleConfirmPasswordCheckbox = (e) => e.target.checked ? setConfirmPasswordHidden(false) : setConfirmPasswordHidden(true)

    return { passwordHidden, confirmPasswordHidden, handlePasswordCheckbox, handleConfirmPasswordCheckbox }
}

export default useCheckbox