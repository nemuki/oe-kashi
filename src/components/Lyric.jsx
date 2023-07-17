import { Text } from '@chakra-ui/react'

function Lyric(props) {
  return (
    <Text
      className="ripples"
      style={{
        position: 'absolute',
        left: props.coordinateX,
        top: props.coordinateY,
        zIndex: -1,
      }}
    >
      {props.char}
    </Text>
  )
}

export default Lyric
