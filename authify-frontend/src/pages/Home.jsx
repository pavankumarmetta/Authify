import React from 'react'
import Menubar from '../components/Menubar'
import Header from '../components/Header'

export default function Home() {
  return (
   <div className="flex flex-col items-center justify-center min-vh-100">
        <Menubar />
        <Header/>
   </div>
  )
}
