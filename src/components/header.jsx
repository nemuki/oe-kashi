function TextAliveHeader(props) {
    return (
        <div id="header">
            <div id="control" className="far">
                <a href="#" onClick={props.onPlay} id="play" className={props.onTimerReady ? '' : 'disabled'}>
                    &#xf144;
                </a>
                <a href="#" onClick={props.onPlay} id="stop" className={props.onTimerReady ? '' : 'disabled'}>
                    &#xf28d;
                </a>
            </div>
            <div id="meta">
                <div id="artist">artist: {props.artist}</div>
                <div id="song">song: {props.songName}</div>
            </div>
        </div>
    )
}

export default TextAliveHeader
