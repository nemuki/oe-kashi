import { useCallback, useEffect, useState } from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'

function TextAliveController(props) {
  const [status, setStatus] = useState('stop')

  useEffect(() => {
    const listener = {
      /* 楽曲の再生が始まったら呼ばれる */
      onPlay: () => setStatus('play'),

      /* 楽曲の再生が止まったら呼ばれる */
      onPause: () => setStatus('pause'),

      /* 再生コントロールができるようになったら呼ばれる */
      onStop: () => setStatus('stop'),
    }
    props.player.addListener(listener)
    return () => props.player.removeListener(listener)
  }, [props.player])

  const handlePlay = useCallback(
    () => props.player && props.player.requestPlay(),
    [props.player],
  )
  const handlePause = useCallback(
    () => props.player && props.player.requestPause(),
    [props.player],
  )
  const handleStop = useCallback(() => {
    props.player && props.player.requestStop()
    props.setLyrics([{ x: 0, y: 0, char: '' }])
  }, [props.player])

  return (
    <VStack align={'fit'} style={{ zIndex: 0 }}>
      <HStack>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={status !== 'play' ? handlePlay : handlePause}
          id="play"
          isDisabled={props.playButton}
          leftIcon={
            status !== 'play' ? (
              <IconPlayerPlay size={16} />
            ) : (
              <IconPlayerPause size={16} />
            )
          }
        >
          {status !== 'play' ? '再生' : '一時停止'}
        </Button>
        <Button
          size="sm"
          type={'button'}
          onClick={handleStop}
          id="stop"
          isDisabled={props.disabled || status === 'stop'}
        >
          リセット
        </Button>
      </HStack>
      <Box>
        <Text id="artist">artist: {props.artistName}</Text>
        <Text id="song">song: {props.songName}</Text>
      </Box>
    </VStack>
  )
}

export default TextAliveController
