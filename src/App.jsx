import { useEffect, useMemo, useState } from 'react'
import './styles/App.css'
import { Player } from 'textalive-app-api'
import TextAliveController from './components/TextAliveController.jsx'
import { contestSongs } from './ContestSongsConstraint.js'

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

  document.addEventListener('mousemove', function (e) {
    stalker.style.transform =
      'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
    coordinates.innerText = `x: ${e.clientX}, y: ${e.clientY}`
    mouseCoordinates = { x: e.clientX, y: e.clientY }
  })

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
      <p id="coordinates">zx</p>
      <div id="stalker"></div>
      {media}
    </>
  )
}

export default App
