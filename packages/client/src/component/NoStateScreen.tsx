import React from "react";

interface Props {
    state: string;
}
export default class NoStateScreen extends React.Component<Props, {}> {
    render() {
        return (
            <>
                <p>Littlifyに接続して再生しましょう！</p>
            </>
        );
    }
}
