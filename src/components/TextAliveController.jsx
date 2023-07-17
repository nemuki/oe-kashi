import { useCallback, useEffect, useState } from 'react'
import { Box, Button, HStack, Select, Text, VStack } from '@chakra-ui/react'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { contestSongs } from '../ContestSongsConstraint.js'

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
  const onChangeSongUrl = useCallback(
    (url) => {
      props.player && url && props.player.createFromSongUrl(url)
    },
    [props.player],
  )

  return (
    <VStack align={'fit'} p={2} style={{ zIndex: 0 }}>
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
        <Select
          placeholder="楽曲を選択"
          size={'sm'}
          w={'auto'}
          onChange={(event) => {
            if (event.target.value !== '') {
              onChangeSongUrl(contestSongs[event.target.value].url)
            }
          }}
        >
          {contestSongs.map((song, index) => (
            <option value={index}>{song.name}</option>
          ))}
        </Select>
      </HStack>
      <Box>
        <Text id="artist">artist: {props.artistName}</Text>
        <Text id="song">song: {props.songName}</Text>
      </Box>
    </VStack>
  )
}

export default TextAliveController
