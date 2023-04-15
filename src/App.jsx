import { useEffect, useState } from 'react'
import './App.css'
import { Player } from 'textalive-app-api'

function App() {
    const [artist, setArtist] = useState('')
    const [songName, setSongName] = useState('')

    useEffect(() => {
        const player = new Player({
            app: { token: import.meta.env.TEXT_ALIVE_APP_TOKEN },
            mediaElement: document.querySelector('#media'),
            mediaBannerPosition: 'bottom right',
        })

        player.addListener({
            /* APIの準備ができたら呼ばれる */
            onAppReady(app) {
                if (app.managed) {
                    document.querySelector('#control').className = 'disabled'
                }
                if (!app.songUrl) {
                    document.querySelector('#media').className = 'disabled'

                    // https://developer.textalive.jp/events/magicalmirai2023/
                    // king妃jack躍 / 宮守文学 feat. 初音ミク
                    player.createFromSongUrl('https://piapro.jp/t/ucgN/20230110005414', {
                        video: {
                            // 音楽地図訂正履歴: https://songle.jp/songs/2427948/history
                            beatId: 4267297,
                            chordId: 2405019,
                            repetitiveSegmentId: 2405019,
                            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FucgN%2F20230110005414
                            lyricId: 56092,
                            lyricDiffId: 9636,
                        },
                    })
                }
            },

            /* 楽曲情報が取れたら呼ばれる */
            onVideoReady() {
                // 楽曲情報を表示
                setArtist(player.data.song.artist.name)
                setSongName(player.data.song.name)
            },

            /* 再生コントロールができるようになったら呼ばれる */
            onTimerReady() {
                document.querySelector('#control > a#play').className = ''
                document.querySelector('#control > a#stop').className = ''
            },

            /* 楽曲の再生が始まったら呼ばれる */
            onPlay() {
                const a = document.querySelector('#control > a#play')
                while (a.firstChild) a.removeChild(a.firstChild)
                a.appendChild(document.createTextNode('\uf28b'))
            },

            /* 楽曲の再生が止まったら呼ばれる */
            onPause() {
                const a = document.querySelector('#control > a#play')
                while (a.firstChild) a.removeChild(a.firstChild)
                a.appendChild(document.createTextNode('\uf144'))
            },
        })
    }, [])

    return (
        <div className="App">
            <div id="header">
                <div id="control" className="far">
                    <a href="#" id="play" className="disabled">
                        &#xf144;
                    </a>
                    <a href="#" id="stop" className="disabled">
                        &#xf28d;
                    </a>
                </div>
                <div id="meta">
                    <div id="artist">artist: {artist}</div>
                    <div id="song">song: {songName}</div>
                </div>
            </div>

            <div id="media"></div>
        </div>
    )
}

export default App
