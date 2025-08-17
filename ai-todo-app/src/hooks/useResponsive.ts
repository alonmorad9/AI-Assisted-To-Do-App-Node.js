import { useState, useEffect } from 'react'

export function useResponsive() { // Custom hook to determine the device type based on screen width
  const [isMobile, setIsMobile] = useState(false) // State to track if the device is mobile
  const [isTablet, setIsTablet] = useState(false) // State to track if the device is a tablet

  useEffect(() => { // Effect to check the device type on initial render and window resize
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkDevice() // Check device type on initial render
    window.addEventListener('resize', checkDevice) 
    return () => window.removeEventListener('resize', checkDevice) // Cleanup event listener on unmount
  }, [])

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet } // Return an object with device type states
}