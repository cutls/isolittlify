import React from "react";

import SpotifyURILink from "./SpotifyURILink";

interface Props {
    artists: SpotifyApi.ArtistObjectSimplified[];
}

export default class Artists extends React.Component<Props, {}> {
    render() {
        return this.props.artists
            .map<React.ReactNode>(artist => (
                <SpotifyURILink key={artist.uri} uri={artist}>
                    {artist.name}
                </SpotifyURILink>
            ))
            .reduce((acc, cur) => [acc, ", ", cur]);
    }
}
