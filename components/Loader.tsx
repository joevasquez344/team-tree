import React from 'react'
import { ThreeCircles } from 'react-loader-spinner';


const Loader = () => {
    return (
        <div className='w-full h-screen flex justify-center'>
            <ThreeCircles
            height="50"
            width="50"
            color="dodgerblue"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
        />
        </div>
    )
}

export default Loader