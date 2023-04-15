function TextAliveHeader(props) {
    return (
        <div id="header">
            <div id="control" className="far">
                <button
                    type={'button'}
                    onClick={props.playMusic}
                    id="play"
                    className={props.onTimerReady ? '' : 'disabled'}
                >
                    {props.playOrPause}
                </button>
                <button id="stop" className={props.onTimerReady ? '' : 'disabled'}>
                    リセット
                </button>
            </div>
            <div id="meta">
                <div id="artist">artist: {props.artist}</div>
                <div id="song">song: {props.songName}</div>
            </div>
        </div>
    )
}

export default TextAliveHeader
