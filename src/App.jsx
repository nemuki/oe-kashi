import { Text } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Player } from 'textalive-app-api'

import { contestSongs } from './ContestSongsConstraint.js'
import Lyric from './components/Lyric.jsx'
import TextAliveController from './components/TextAliveController.jsx'
import './styles/App.css'

function App() {
  const [app, setApp] = useState(null)
  const [player, setPlayer] = useState(null)
  const [mediaElement, setMediaElement] = useState(null)

  const [artistName, setArtistName] = useState('')
  const [songName, setSongName] = useState('')
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true)
  const [lyrics, setLyrics] = useState([{ x: 0, y: 0, char: '' }])
  const [mouseCoordinate, setMouseCoordinate] = useState({ x: 0, y: 0 })

  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    [],
  )

  let lyricCoordinate = { x: 0, y: 0 }

  const setCoordinate = (x, y) => {
    setMouseCoordinate({ x: x, y: y })
    lyricCoordinate = { x: x, y: y }
  }

  if (isMobile) {
    document.addEventListener('touchmove', (event) => {
      event.preventDefault()
      const touch = event.changedTouches

      for (let i = 0; i < touch.length; i++) {
        const x = Math.floor(touch[i].pageX)
        const y = Math.floor(touch[i].pageY)

        setCoordinate(x, y)
      }
    })
  } else {
    document.addEventListener('mousemove', (event) => {
      const x = event.clientX
      const y = event.clientY

      setCoordinate(x, y)
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !mediaElement) {
      return
    }

    const player = new Player({
      // オプション一覧
      // https://developer.textalive.jp/packages/textalive-app-api/interfaces/playeroptions.html
      app: { token: import.meta.env.VITE_TEXT_ALIVE_APP_API_TOKEN },
      mediaElement: mediaElement,
      mediaBannerPosition: 'bottom right',
    })

    const playerListener = {
      /* APIの準備ができたら呼ばれる */
      onAppReady: (app) => {
        if (!app.songUrl) {
          player.createFromSongUrl(contestSongs[3].url, {
            video: contestSongs[3].video,
          })
        }
        setApp(app)
      },
      /* 再生コントロールができるようになったら呼ばれる */
      onTimerReady: () => {
        setIsPlayButtonDisabled(false)
      },
      /* 楽曲情報が取れたら呼ばれる */
      onVideoReady: () => {
        setSongName(player.data.song.name)
        setArtistName(player.data.song.artist.name)

        let oldPhrase = ''
        let charLyric = player.video.firstChar
        while (charLyric && charLyric.next) {
          charLyric.animate = (now, unit) => {
            if (unit.startTime <= now && unit.endTime > now) {
              if (unit.text !== oldPhrase) {
                setLyrics((lyrics) => [
                  ...lyrics,
                  {
                    x: lyricCoordinate.x,
                    y: lyricCoordinate.y,
                    char: unit.text,
                  },
                ])
              }
              oldPhrase = unit.text
            }
          }
          charLyric = charLyric.next
        }
      },
    }
    player.addListener(playerListener)
    setPlayer(player)

    return () => {
      player.removeListener(playerListener)
      player.dispose()
    }
  }, [lyricCoordinate.x, lyricCoordinate.y, mediaElement])

  return (
    <>
      {player && app && (
        <TextAliveController
          artistName={artistName}
          disabled={app.managed}
          playButton={isPlayButtonDisabled}
          player={player}
          setLyrics={setLyrics}
          songName={songName}
        />
      )}
      <main>
        {lyrics.map((lyric, index) => (
          <Lyric
            char={lyric.char}
            coordinateX={lyric.x}
            coordinateY={lyric.y}
            key={index}
          />
        ))}
      </main>
      <Text
        className="coordinates"
        p={2}
      >{`${mouseCoordinate.x}px, ${mouseCoordinate.y}px`}</Text>
      <div
        className="stalker"
        style={{
          transform: `translate(${mouseCoordinate.x}px, ${mouseCoordinate.y}px)`,
        }}
      />
      {media}
    </>
  )
}

export default App
