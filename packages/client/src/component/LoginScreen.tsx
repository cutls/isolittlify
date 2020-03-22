import React from "react";
import SpotifyLoginButton from "./SpotifyLoginButton";
import ExternalLink from "./ExternalLink";
import classNames from "classnames";

export default class LoginScreen extends React.Component {
    render() {
        return (
            <>
                <h1>Isolittlify</h1>
                <p>Littlifyのフォーク</p>
                <p>
                    ベータ版なのに第三者がいじったせいですごい(婉曲)やつができたよ
                </p>
                <p>
                    ソースコード・説明:{" "}
                    <ExternalLink
                        href="https://github.com/cutls/isolittlify"
                        className={classNames("text-blue-500")}
                    >
                        https://github.com/cutls/isolittlify
                    </ExternalLink>
                    (フォーク元{" "}
                    <ExternalLink
                        href="https://github.com/eai04191/littlify"
                        className={classNames("text-blue-500")}
                    >
                        https://github.com/eai04191/littlify
                    </ExternalLink>
                    )
                </p>

                <SpotifyLoginButton />
            </>
        );
    }
}
