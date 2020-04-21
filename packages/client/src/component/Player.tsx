import React from "react";
import classNames from "classnames";
import SpotifyURILink from "./SpotifyURILink";
import Shortcut from "./shortcut";
import Controller from "./Controller";
import Artists from "./Artists";
import SpotifyWebApi from "spotify-web-api-js";
const S = new SpotifyWebApi();

interface Props {
    state: boolean;
    nowPlaying: SpotifyApi.TrackObjectFull | null;
    nowContext: SpotifyApi.ContextObject | null;
    at: string;
    progressMs: number | null;
    callBasic: () => void;
}

interface State {
    reasonableContext: string;
}

export default class Player extends React.Component<Props, State> {
    shortcut = new Shortcut(S, this.props.state, this.props.callBasic);
    constructor(props: Props) {
        super(props);
        this.state = {
            reasonableContext: "",
        };
    }

    componentDidMount(): void {
        this.shortcut.enable();
        const track = this.props.nowPlaying;
        const context = this.props.nowContext;
        if (!context || !track) return;
    }

    componentWillUnmount(): void {
        this.shortcut.disable();
    }

    render() {
        S.setAccessToken(this.props.at);
        const track = this.props.nowPlaying;
        const context = this.props.nowContext;
        const progressMs = this.props.progressMs;
        if (!track || !context) return;
        const share = `${track.name}\r\n${track.artists[0].name} - ${track.album.name}\r\nhttps://open.spotify.com/track/${track.id}`;
        return (
            <>
                <div className={classNames("flex", "border-gray-400")}>
                    <div
                        className={classNames(
                            "jucket-column",
                            "flex",
                            "h-screen",
                            "flex-grow-0",
                            "flex-shrink-0",
                            "border-r",
                            "dark:border-gray-700"
                        )}
                    >
                        <img
                            draggable="false"
                            src={track.album.images[0].url}
                            className={classNames(
                                "self-center",
                                "h-screen",
                                "max-w-screen-1/2",
                                "max-h-screen-w-1/2"
                            )}
                        />
                    </div>
                    <div
                        className={classNames(
                            "track-column",
                            "flex-1",
                            "flex",
                            "flex-col",
                            "w-full"
                        )}
                    >
                        <div
                            className={classNames(
                                "flex-1",
                                "flex",
                                "items-center",
                                "pl-8",
                                "text-gray-900",
                                "bg-white",
                                "dark:bg-gray-900",
                                "dark:text-gray-200"
                            )}
                        >
                            <div className={classNames("font-medium")}>
                                <SpotifyURILink
                                    className={classNames("text-2xl")}
                                    uri={track}
                                >
                                    {track.name}
                                </SpotifyURILink>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark:text-gray-500"
                                    )}
                                >
                                    <Artists artists={track.artists} />
                                    {" - "}
                                    <SpotifyURILink uri={track.album}>
                                        {track.album.name}
                                    </SpotifyURILink>
                                </p>
                                <p
                                    className={classNames(
                                        "mt-1",
                                        "text-sm",
                                        "text-gray-700",
                                        "dark:text-gray-500"
                                    )}
                                >
                                    <SpotifyURILink uri={context || "#"}>
                                        {this.state.reasonableContext}
                                    </SpotifyURILink>
                                </p>
                            </div>
                        </div>
                        <Controller
                            state={this.props.state}
                            at={this.props.at}
                            progressMs={progressMs}
                            share={share}
                            callBasic={this.props.callBasic}
                        />
                    </div>
                </div>
            </>
        );
    }
}
