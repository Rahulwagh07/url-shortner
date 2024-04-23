import React from 'react'
import ShortenUrlForm from '../components/HomePage/ShortUrlForm'
import HeroSection from '../components/HomePage/HeroSection'
import Stats from '../components/HomePage/Stats'
import Footer from '../components/HomePage/Footer'

function Home() {
  return (
    <div className='w-11/12 mx-auto'>
    <HeroSection/>
    <Stats/>
    <Footer/>
    </div>
  )
}

export default Home