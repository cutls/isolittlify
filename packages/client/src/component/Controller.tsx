import React from "react";
import classNames from "classnames";
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    Sliders,
    RefreshCcw,
} from "react-feather";
import mastodon from "../images/mastodon.svg";

import ExternalLink from "./ExternalLink";
import { State as IConfig, Theme } from "./Config";
import SpotifyWebApi from "spotify-web-api-js";
const S = new SpotifyWebApi();

interface Props {
    state: boolean;
    at: string;
    progressMs: number | null;
    share: string;
    callBasic: () => boolean;
}

export default class Controller extends React.Component<Props, {}> {
    public componentDidMount() {
        window.addEventListener("storage", this.onUpdateConfig);
        this.onUpdateConfig();
    }

    public componentWillUnmount() {
        window.removeEventListener("storage", this.onUpdateConfig);
    }

    private onUpdateConfig() {
        const config: IConfig = JSON.parse(localStorage.config || "{}");

        switch (config.theme) {
            case Theme.DARK:
                document.documentElement.dataset["theme"] = "dark";
                break;
            case Theme.LIGHT:
                document.documentElement.dataset["theme"] = "light";
                break;
            default:
                // REF: https://github.com/ChanceArthur/tailwindcss-dark-mode/blob/master/prefers-dark.js
                if (
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                ) {
                    console.log(
                        "matchmedia:",
                        window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                    );
                    document.documentElement.dataset["theme"] = "dark";
                } else {
                    document.documentElement.dataset["theme"] = "light";
                }
        }
    }

    private getInstance() {
        const config: IConfig = JSON.parse(localStorage.config || "{}");
        return config.instance;
    }

    render() {
        const state = this.props.state;
        const progressMs = this.props.progressMs;
        S.setAccessToken(this.props.at);
        return (
            <div
                className={classNames(
                    "controller-column",
                    "flex",
                    "items-center",
                    "select-none",
                    "bg-gray-200",
                    "border-t",
                    "dark:bg-gray-800",
                    "dark:border-gray-700"
                )}
            >
                <div
                    className={classNames(
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        this.props.callBasic("refresh");
                    }}
                >
                    <RefreshCcw size={16} />
                </div>
                <div
                    className={classNames(
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        if (progressMs && progressMs < 5000) {
                            S.skipToPrevious();
                        }
                        S.seek(0);
                        this.props.callBasic();
                    }}
                >
                    <ChevronLeft size={16} />
                </div>
                <div
                    className={classNames(
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        if (!state) S.play();
                        else S.pause();
                        this.props.callBasic();
                    }}
                >
                    {!state ? (
                        <Play className={classNames("filled")} size={20} />
                    ) : (
                        <Pause className={classNames("filled")} size={20} />
                    )}
                </div>
                <div
                    className={classNames(
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        S.skipToNext();
                        this.props.callBasic();
                    }}
                >
                    <ChevronRight size={16} />
                </div>
                <div
                    className={classNames(
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    onClick={() => {
                        window.open("/config");
                    }}
                >
                    <Sliders size={16} />
                </div>
                <ExternalLink
                    className={classNames(
                        "flex-none",
                        "h-full",
                        "px-8",
                        "hover:text-gray-500",
                        "dark:hover:text-gray-600"
                    )}
                    href={`https://${this.getInstance()}/share?text=${encodeURIComponent(
                        this.props.share
                    )}`}
                >
                    <img src={mastodon} />
                </ExternalLink>
            </div>
        );
    }
}
