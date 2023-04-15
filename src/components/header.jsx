function TextAliveHeader(props) {
    return (
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
                <div id="artist">artist: {props.artist}</div>
                <div id="song">song: {props.songName}</div>
            </div>
        </div>
    )
}

export default TextAliveHeader
