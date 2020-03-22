import React from "react";
import classNames from "classnames";

interface Props {
    uri:
        | SpotifyApi.TrackObjectFull
        | SpotifyApi.AlbumObjectSimplified
        | SpotifyApi.ContextObject
        | SpotifyApi.ArtistObjectSimplified;
    title?: string;
    className?: string;
}

export default class SpotifyURILink extends React.Component<Props, {}> {
    render() {
        if (!this.props.uri) return <a>{this.props.children}</a>;
        const link = this.props.uri.external_urls;
        if (!link) return <a>{this.props.children}</a>;
        return (
            <a
                href={link.spotify}
                title={this.props.title}
                className={classNames(this.props.className, "hover:underline")}
                target="_blank"
                rel="noreferrer noopener"
            >
                {this.props.children}
            </a>
        );
    }
}
