import { useEffect, useMemo, useState } from 'react'
import './styles/App.css'
import { Player } from 'textalive-app-api'
import TextAliveController from './components/TextAliveController.jsx'
import { contestSongs } from './ContestSongsConstraint.js'
import { isMobile } from 'react-device-detect'

function App() {
  const [app, setApp] = useState(null)
  const [player, setPlayer] = useState(null)
  const [mediaElement, setMediaElement] = useState(null)

  const [artistName, setArtistName] = useState('')
  const [songName, setSongName] = useState('')
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true)
  const [lyrics, setLyrics] = useState([{ x: 0, y: 0, char: '' }])

  const [song, setSong] = useState(contestSongs[1])

  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    [],
  )

  let mouseCoordinates = { x: 0, y: 0 }

  const stalker = document.getElementById('stalker')
  const coordinates = document.getElementById('coordinates')

  if (isMobile) {
    document.addEventListener('touchmove', function (event) {
      event.preventDefault()
      const touch = event.changedTouches

      for (let i = 0; i < touch.length; i++) {
        const x = touch[i].pageX
        const y = touch[i].pageY

        stalker.style.transform = `translate(${x}px, ${y}px)`
        coordinates.innerText = `x: ${x}, y: ${y}`
        mouseCoordinates = { x: x, y: y }
      }
    })
  } else {
    document.addEventListener('mousemove', function (event) {
      stalker.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
      coordinates.innerText = `x: ${event.clientX}, y: ${event.clientY}`
      mouseCoordinates = { x: event.clientX, y: event.clientY }
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
          player.createFromSongUrl(song.url, {
            video: song.video,
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
                    x: mouseCoordinates.x,
                    y: mouseCoordinates.y,
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
        <>
          <TextAliveController
            playButton={isPlayButtonDisabled}
            disabled={app.managed}
            player={player}
            songName={songName}
            artistName={artistName}
            setLyrics={setLyrics}
          />
        </>
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
      <p id="coordinates"></p>
      <div id="stalker"></div>
      {media}
    </>
  )
}

export default App
