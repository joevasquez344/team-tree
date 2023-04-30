import React from 'react'

const ExpandButton = ({ height, width }: any) => {
    let h = 6;
    let w = 6;

    if (height) {
        h = height;
    }

    if (width) {
        w = width;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-${w} h-${h} text-gray-500`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg >

    )
}

export default ExpandButton