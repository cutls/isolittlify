import React from "react";
import classNames from "classnames";

interface Props {
    callBasic: () => void;
}
export default class NoStateScreen extends React.Component<Props, {}> {
    render() {
        return (
            <>
                <a
                    href={`${process.env.SERVER_URI}/v1/login?state=hogehoge`}
                    className={classNames(
                        "inline-block",
                        "text-white",
                        "rounded-full",
                        "px-10",
                        "py-5",
                        "font-bold",
                        "bg-spotify-green",
                        "hover:bg-spotify-green-light",
                        "transition-colors",
                        "duration-300"
                    )}
                    onClick={() => {
                        this.props.callBasic();
                    }}
                >
                    更新する
                </a>
            </>
        );
    }
}
