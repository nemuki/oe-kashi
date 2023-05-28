import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'

function Mouse() {
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) {
      ontouchmove = (event) => {
        event.preventDefault()
        const touch = event.changedTouches
        for (let i = 0; i < touch.length; i++) {
          setMouseCoordinates({ x: touch[i].pageX, y: touch[i].pageY })
        }
      }
    } else {
      onpointermove = (event) => {
        setMouseCoordinates({ x: event.clientX, y: event.clientY })
      }
    }
  }, [mouseCoordinates])

  return (
    <>
      <p>
        x: {mouseCoordinates.x}, y:{mouseCoordinates.y}
      </p>
    </>
  )
}

export default Mouse
