import { useEffect, useState } from 'react'
import './App.css'
import { Player } from 'textalive-app-api'
import TextAliveHeader from './components/header.jsx'

// TextAlive Player
const player = new Player({
    // オプション一覧
    // https://developer.textalive.jp/packages/textalive-app-api/interfaces/playeroptions.html
    app: { token: import.meta.env.VITE_TEXT_ALIVE_APP_API_TOKEN },
    mediaElement: document.querySelector('#media'),
    mediaBannerPosition: 'bottom right',
})

player.addListener({
    /* APIの準備ができたら呼ばれる */
    onAppReady(app) {
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
    },
})

function App() {
    const [artist, setArtist] = useState('')
    const [songName, setSongName] = useState('')
    const [playOrPause, setPlayOrPause] = useState('再生')
    const [stateOnTimerReady, setStateOnTimerReady] = useState(false)

    useEffect(() => {
        player.addListener({
            onAppReady,
            onVideoReady,
            onTimerReady,
            onPlay,
            onPause,
        })
    }, [])

    /* 楽曲情報が取れたら呼ばれる */
    const onVideoReady = () => {
        // 楽曲情報を表示
        setArtist(player.data.song.artist.name)
        setSongName(player.data.song.name)
    }

    /* 再生コントロールができるようになったら呼ばれる */
    const onTimerReady = () => {
        setStateOnTimerReady(true)
    }

    /* 楽曲の再生が始まったら呼ばれる */
    const onPlay = () => {
        setPlayOrPause('停止')
    }

    /* 楽曲の再生が止まったら呼ばれる */
    const onPause = () => {
        setPlayOrPause('再生')
    }

    const playMusic = () => {
        if (player) {
            if (player.isPlaying) {
                player.requestPause()
            } else {
                player.requestPlay()
            }
        }
    }

    const resetMusic = () => {
        if (player) {
            player.requestStop()
        }
    }

    return (
        <div className="App">
            <TextAliveHeader
                artist={artist}
                songName={songName}
                onTimerReady={stateOnTimerReady}
                playOrPause={playOrPause}
                playMusic={playMusic}
                resetMusic={resetMusic}
            />
            <div id="media"></div>
        </div>
    )
}

export default App
