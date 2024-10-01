import Feature from '@/components/ui/ui/Feature'
import Footer from '@/components/ui/ui/Footer'
import Information from '@/components/ui/ui/Information'
import MainBanner from '@/components/ui/ui/MainBanner'
import UserTestimonials from '@/components/ui/ui/UserTestimonials'


const HomePage = () => {
  return (
    <div>
      <MainBanner />
      <Feature />
      <Information />
      <UserTestimonials />
      <Footer />
    </div>
  )
}

export default HomePage
