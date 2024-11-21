import { useEffect, useState } from "react"

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { ...windowSize, isDesktop: windowSize.width > 1023 }
}

export default useWindowSize
