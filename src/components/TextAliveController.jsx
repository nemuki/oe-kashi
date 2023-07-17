import { useCallback, useEffect, useState } from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'

function TextAliveController({
  playButton,
  disabled,
  player,
  artistName,
  songName,
  setLyrics,
}) {
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
    player.addListener(listener)
    return () => player.removeListener(listener)
  }, [player])

  const handlePlay = useCallback(() => player && player.requestPlay(), [player])
  const handlePause = useCallback(
    () => player && player.requestPause(),
    [player],
  )
  const handleStop = useCallback(() => {
    player && player.requestStop()
    setLyrics([{ x: 0, y: 0, char: '' }])
  }, [player])

  return (
    <VStack align={'fit'} style={{ zIndex: 0 }}>
      <HStack>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={status !== 'play' ? handlePlay : handlePause}
          id="play"
          isDisabled={playButton}
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
          isDisabled={disabled || status === 'stop'}
        >
          リセット
        </Button>
      </HStack>
      <Box>
        <Text id="artist">artist: {artistName}</Text>
        <Text id="song">song: {songName}</Text>
      </Box>
    </VStack>
  )
}

export default TextAliveController
