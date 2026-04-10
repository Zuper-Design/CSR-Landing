import { Analytics } from '@vercel/analytics/react'
import LandingPage from './components/LandingPage'

export default function App() {
  return (
    <>
      <LandingPage />
      <Analytics />
    </>
  )
}
