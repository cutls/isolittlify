import React from "react";
import classNames from "classnames";

interface Props {
    href: string | null;
    title?: string;
    className?: string;
}

export default class ExternalLink extends React.Component<Props, {}> {
    render() {
        let href = this.props.href;
        if (!href) href = "#";
        return (
            <a
                href={href}
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
