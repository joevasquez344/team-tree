import React from 'react'

const AddButton = ({height, width, bgHeight, bgWidth, padding}: any) => {
    if(!height && !width) {
        height = "6"
        width = "6"
    } 
    if(!padding) {
        padding = "2"
    }
    return (
        <div className={`p-${padding} h-${bgHeight && bgHeight} w-${bgWidth && bgWidth} flex justify-center items-center rounded-full bg-gray-900 cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${width} h-${height} text-white`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>

    )
}

export default AddButton