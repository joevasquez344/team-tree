import React from 'react'

const Card = ({ item, component: Component }: any) => (
    <div className='border-b sm:border-r sm:border-b lg:border p-3 lg:shadow-lg'>
        <Component item={item} />
    </div>
)

export default Card