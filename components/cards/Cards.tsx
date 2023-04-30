import React from 'react'
import Card from './Card'

const Cards = ({ data, component }: any) => (
  <div className='sm:grid sm:grid-cols-2 2xl:grid-cols-3 lg:gap-4 mt-10' >
    {data.map((item: any) => <Card key={item.id} item={item} component={component} />)}
  </ div>
)
export default Cards