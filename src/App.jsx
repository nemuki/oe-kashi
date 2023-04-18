import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Player } from 'textalive-app-api'
import TextAliveController from './components/TextAliveController.jsx'
import Mouse from './components/Mouse.jsx'
import { contestSongs } from './ContestSongsConstraint.js'

function App() {
    const [app, setApp] = useState(null)
    const [player, setPlayer] = useState(null)
    const [mediaElement, setMediaElement] = useState(null)

    const [song, setSong] = useState(contestSongs[1])
    const [artistName, setArtistName] = useState('')
    const [songName, setSongName] = useState('')
    const [lyrics, setLyrics] = useState([{ x: 0, y: 0, char: '' }])

    const media = useMemo(() => <div className="media" ref={setMediaElement} />, [])

    useEffect(() => {
        if (typeof window === 'undefined' || !mediaElement) {
            return
        }

        console.log('--- [app] create Player instance ---')
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
                console.log('--- [app] initialized as TextAlive app ---')
                console.log('managed:', app.managed)
                console.log('host:', app.host)
                console.log('song url:', app.songUrl)
                if (!app.songUrl) {
                    // https://developer.textalive.jp/events/magicalmirai2023/
                    // king妃jack躍 / 宮守文学 feat. 初音ミク
                    player.createFromSongUrl(song.url, {
                        video: song.video,
                    })
                }
                setApp(app)
            },
            /* 楽曲情報が取れたら呼ばれる */
            onVideoReady: () => {
                console.log('--- [app] video is ready ---')
                console.log('player:', player)
                console.log('player.data.song:', player.data.song)
                console.log('player.data.song.name:', player.data.song.name)
                console.log('player.data.song.artist.name:', player.data.song.artist.name)
                console.log('player.data.songMap:', player.data.songMap)

                setSongName(player.data.song.name)
                setArtistName(player.data.song.artist.name)

                let charLyrics = player.video.firstChar
                while (charLyrics && charLyrics.next) {
                    charLyrics.animate = (now, u) => {
                        if (u.startTime <= now && u.endTime > now) {
                            onpointermove = (event) => {
                                setLyrics((lyrics) => [...lyrics, { x: event.x, y: event.y, char: u.text }])
                            }
                        }
                    }
                    charLyrics = charLyrics.next
                }
            },
        }
        player.addListener(playerListener)

        setPlayer(player)
        return () => {
            console.log('--- [app] shutdown ---')
            player.removeListener(playerListener)
            player.dispose()
        }
    }, [mediaElement])

    return (
        <>
            {player && app && (
                <>
                    <TextAliveController
                        disabled={app.managed}
                        player={player}
                        songName={songName}
                        artistName={artistName}
                        setLyrics={setLyrics}
                    />
                </>
            )}
            <Mouse />
            <div>
                {lyrics.map((lyric, index) => (
                    <div key={index} style={{ position: 'absolute', left: lyric.x, top: lyric.y }}>
                        {lyric.char}
                    </div>
                ))}
            </div>
            {media}
        </>
    )
}

export default App
