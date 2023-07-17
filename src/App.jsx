import { useEffect, useMemo, useState } from 'react'
import './styles/App.css'
import { Player } from 'textalive-app-api'
import TextAliveController from './components/TextAliveController.jsx'
import { contestSongs } from './ContestSongsConstraint.js'
import { isMobile } from 'react-device-detect'
import { Text } from '@chakra-ui/react'

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

  if (isMobile) {
    document.addEventListener('touchmove', function (event) {
      event.preventDefault()
      const touch = event.changedTouches

      for (let i = 0; i < touch.length; i++) {
        const x = Math.floor(touch[i].pageX)
        const y = Math.floor(touch[i].pageY)

        setMouseCoordinate({ x: x, y: y })
        lyricCoordinate = { x: x, y: y }
      }
    })
  } else {
    document.addEventListener('mousemove', function (event) {
      setMouseCoordinate({ x: event.clientX, y: event.clientY })
      lyricCoordinate = { x: event.clientX, y: event.clientY }
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
          player.createFromSongUrl(contestSongs[1].url, {
            video: contestSongs[1].video,
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
  }, [mediaElement])

  return (
    <>
      {player && app && (
        <TextAliveController
          playButton={isPlayButtonDisabled}
          disabled={app.managed}
          player={player}
          songName={songName}
          songList={contestSongs}
          artistName={artistName}
          setLyrics={setLyrics}
        />
      )}
      <div>
        {lyrics.map((lyric, index) => (
          <div
            key={index}
            className={'ripples'}
            style={{
              position: 'absolute',
              left: lyric.x,
              top: lyric.y,
              zIndex: -1,
            }}
          >
            {lyric.char}
          </div>
        ))}
      </div>
      <Text
        p={2}
        id="coordinates"
      >{`${mouseCoordinate.x}px, ${mouseCoordinate.y}px`}</Text>
      <div
        id="stalker"
        style={{
          transform: `translate(${mouseCoordinate.x}px, ${mouseCoordinate.y}px)`,
        }}
      ></div>
      {media}
    </>
  )
}

export default App
