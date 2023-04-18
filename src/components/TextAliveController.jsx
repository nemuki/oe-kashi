import { useCallback, useEffect, useState } from 'react'

function TextAliveController({ disabled, player, artistName, songName, setLyrics }) {
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
    const handlePause = useCallback(() => player && player.requestPause(), [player])
    const handleStop = useCallback(() => {
        player && player.requestStop()
        setLyrics([{ x: 0, y: 0, char: '' }])
    }, [player])

    return (
        <div id="header">
            <div id="control" className="far">
                <button
                    type={'button'}
                    onClick={status !== 'play' ? handlePlay : handlePause}
                    id="play"
                    disabled={disabled}
                >
                    {status !== 'play' ? '再生' : '一時停止'}
                </button>

                <button type={'button'} onClick={handleStop} id="stop" disabled={disabled || status === 'stop'}>
                    リセット
                </button>
            </div>
            <div id="meta">
                <div id="artist">artist: {artistName}</div>
                <div id="song">song: {songName}</div>
            </div>
        </div>
    )
}

export default TextAliveController
