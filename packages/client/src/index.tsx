import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import queryString from "query-string";
import classNames from "classnames";
import Player from "./component/Player";
import NoStateScreen from "./component/NoStateScreen";
import LoginScreen from "./component/LoginScreen";
import Config, { State as ConfigState } from "./component/Config";
import history from "./history";
import SpotifyWebApi from "spotify-web-api-js";
const sleep = (msec: number) =>
    new Promise(resolve => setTimeout(resolve, msec));

interface Props {
    qs: queryString.ParsedQuery<string>;
}

interface State {
    nokori: number;
    state: boolean;
    wait: boolean;
    playing: SpotifyApi.TrackObjectFull | null;
    context: SpotifyApi.ContextObject | null;
    accessToken: string | null;
    progressMs: number | null;
    reasonableContext: string;
}

class App extends React.Component<Props, State> {
    interval!: number;
    constructor(props: Props) {
        super(props);
        this.state = {
            nokori: 15000,
            state: false,
            wait: false,
            playing: null,
            context: null,
            accessToken: this.props.qs.access_token?.toString() || null,
            progressMs: 0,
            reasonableContext: "",
        };
    }

    UNSAFE_componentWillMount = () => {
        console.log(this.props.qs);

        if (Object.keys(this.props.qs).length === 0) {
            if (localStorage.config) {
                let config: ConfigState = {};
                try {
                    config = JSON.parse(localStorage.config);
                } catch (e) {
                    console.error(e);
                }
                if (config.auto_auth) {
                    location.href = `${process.env.SERVER_URI}/v1/login?state=hogehoge`;
                }
            } else {
                localStorage.config = JSON.stringify({});
            }
        }
    };
    componentDidMount = () => {
        this.interval = window.setInterval(async () => {
            const nkr = this.state.nokori;
            if (nkr < 0) {
                await sleep(1000);
                this.basic();
            } else {
                this.setState({
                    nokori: nkr - 1000,
                });
            }
        }, 1000);
        this.basic();
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    basic = async () => {
        console.log("do");
        if (this.state.wait) {
            return;
        } else {
            this.setState({
                wait: true,
            });
        }
        const S = new SpotifyWebApi();
        const at = this.state.accessToken;
        if (at) {
            S.setAccessToken(at);
            await sleep(500);
            const currentData = await S.getMyCurrentPlayingTrack();
            if (!currentData) return;
            const currentTrack = currentData.item;
            const currentContext = currentData.context;
            const progressMs = currentData.progress_ms;
            if (!currentTrack || !progressMs || !currentContext) return;
            const duration = currentTrack.duration_ms;
            console.log(duration - progressMs);
            this.setState({
                playing: currentTrack,
                context: currentContext,
                state: currentData.is_playing,
                progressMs: progressMs,
                nokori: duration - progressMs,
                wait: false,
            });
            const artists = currentTrack.artists.map(v => v.name).join(", ");
            document.title = `${currentTrack.name} · ${artists}`;

            this.getReasonableContext(currentContext, currentTrack);
        } else {
            this.setState({
                nokori: 15000,
                wait: false,
            });
        }
    };
    getReasonableContext = async (
        context: SpotifyApi.ContextObject,
        track: SpotifyApi.TrackObjectFull
    ) => {
        const S = new SpotifyWebApi();
        const at = this.state.accessToken;
        if (!at) return;
        S.setAccessToken(at);
        if (context.type == "playlist") {
            const uri = context.uri;
            const m = uri.match(/spotify:playlist:([a-zA-Z0-9_]+)/);
            if (m && m.length > 1) {
                const playlistId = m[1];
                const playlist = await S.getPlaylist(playlistId);
                this.setState({
                    reasonableContext: playlist.name,
                });
            }
        } else if (context.type == "album") {
            this.setState({
                reasonableContext: track.album.name,
            });
        } else if (context.type == "artist") {
            const artists = track.artists.map(v => v.name).join(", ");
            this.setState({
                reasonableContext: artists,
            });
        }
    };

    render() {
        return (
            <div
                className={classNames(
                    "bg-white",
                    "text-black",
                    "dark:bg-gray-900",
                    "dark:text-gray-200"
                )}
            >
                {this.state.accessToken ? (
                    this.state.playing ? (
                        <Player
                            state={this.state.state}
                            nowPlaying={this.state.playing}
                            nowContext={this.state.context}
                            at={this.state.accessToken}
                            progressMs={this.state.progressMs}
                            callBasic={() => this.basic()}
                        />
                    ) : (
                        <NoStateScreen callBasic={() => this.basic()} />
                    )
                ) : (
                    <LoginScreen />
                )}
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={history}>
        <Route
            path={"/config"}
            exact={true}
            render={props => <Config {...props} />}
        />
        <Route
            path={"/"}
            exact={true}
            render={props => (
                <App qs={queryString.parse(props.location.search)} />
            )}
        />
    </Router>,
    document.getElementById("root")
);
