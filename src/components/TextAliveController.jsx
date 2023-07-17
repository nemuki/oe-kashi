import { Box, Button, HStack, Select, Text, VStack } from '@chakra-ui/react'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'

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
  }, [props])
  const onChangeSongUrl = useCallback(
    (url, video) => {
      props.player && url && props.player.createFromSongUrl(url, video)
      props.setLyrics([{ x: 0, y: 0, char: '' }])
    },
    [props],
  )

  return (
    <VStack align="fit" p={2} style={{ zIndex: 0 }}>
      <HStack>
        <Button
          colorScheme="teal"
          isDisabled={props.playButton}
          leftIcon={
            status !== 'play' ? (
              <IconPlayerPlayFilled size={16} />
            ) : (
              <IconPlayerPauseFilled size={16} />
            )
          }
          onClick={status !== 'play' ? handlePlay : handlePause}
          size="sm"
        >
          {status !== 'play' ? '再生' : '一時停止'}
        </Button>
        <Button
          isDisabled={props.disabled || status === 'stop'}
          onClick={handleStop}
          size="sm"
          type="button"
        >
          リセット
        </Button>
        <Select
          onChange={(event) => {
            if (event.target.value !== '') {
              onChangeSongUrl(
                contestSongs[event.target.value].url,
                contestSongs[event.target.value].video,
              )
            }
          }}
          placeholder="楽曲を選択"
          size="sm"
          w="auto"
        >
          {contestSongs.map((song, index) => (
            <option key={index} value={index}>
              {song.name}
            </option>
          ))}
        </Select>
      </HStack>
      <Box>
        <Text>artist: {props.artistName}</Text>
        <Text>song: {props.songName}</Text>
      </Box>
    </VStack>
  )
}

export default TextAliveController
