import React from 'react'

const Button = ({ text, theme }: any) => {
  let bgColor = ""
  let textColor = ""
  let hoverBgColor = ""
  let hoverTextColor = ""


  if (theme === "blue") {
    bgColor = "bg-gray-700"
    textColor = "text-gray-300"
    hoverBgColor = "bg-gray-600"
    hoverTextColor = "text-gray-300"
  }
  return (
    <div className={`${bgColor} ${textColor} hover:${hoverBgColor} hover:${hoverTextColor} px-5 py-2 transition ease-in-out cursor-pointer duration-200`}>{text}</div>
  )
}

export default Button