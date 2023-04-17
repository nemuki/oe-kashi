import { useEffect, useState } from 'react'

function Mouse(props) {
    const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 })

    useEffect(() => {
        onmousemove = (event) => {
            setMouseCoordinates({ x: event.clientX, y: event.clientY })
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
