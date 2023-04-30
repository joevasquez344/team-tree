import React, {useState} from 'react'

const useText = () => {
const [input, setInput] = useState("");
const handleInputChange = (e) => {
    setInput(e.target.value)
}

 return {
    input,
    handleInputChange
 }
}

export default useText