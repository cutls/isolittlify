import SpotifyWebApi from "spotify-web-api-js";
const sleep = (msec: number) =>
    new Promise(resolve => setTimeout(resolve, msec));
type Command = {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    callback: (player: SpotifyWebApi.SpotifyWebApiJs) => void;
};

type Property = keyof Command | keyof KeyboardEvent;

export default class Shortcut {
    private readonly player: SpotifyWebApi.SpotifyWebApiJs;
    private readonly state: boolean;
    private readonly callBasic!: () => void;
    private readonly properties: Property[] = [
        "key",
        "ctrlKey",
        "shiftKey",
        "altKey",
        "metaKey",
    ];
    private readonly commands: Command[] = [
        {
            key: " ", // Space Key
            callback: async player => {
                if (this.state) player.pause();
                else player.play();
                await sleep(1500);
                this.callBasic();
            },
        },
        {
            key: "r",
            ctrlKey: true,
            callback: async player => {
                this.callBasic();
            },
        },
        {
            key: "ArrowLeft",
            callback: async player => {
                player.skipToPrevious();
                await sleep(1500);
                this.callBasic();
            },
        },
        {
            key: "ArrowRight",
            callback: async player => {
                player.skipToNext();
                await sleep(1500);
                this.callBasic();
            },
        },
    ];
    private readonly handler = this.keyDownHandler.bind(this);

    constructor(
        player: SpotifyWebApi.SpotifyWebApiJs,
        state: boolean,
        callBasic: () => void
    ) {
        this.player = player;
        this.state = state;
        this.callBasic = callBasic;
    }

    enable() {
        window.addEventListener("keydown", this.handler);
    }

    disable() {
        window.removeEventListener("keydown", this.handler);
    }

    keyDownHandler(e: KeyboardEvent) {
        for (const cmd of this.commands) {
            let invalid = false;

            for (const prop of this.properties) {
                // コンビネーションキーが指定されていない場合は押されてない事を確認する
                if (
                    !cmd[prop as keyof Command] &&
                    !e[prop as keyof KeyboardEvent]
                )
                    continue;

                // コンビネーションキーが指定されいる場合は押されている事を確認する
                if (
                    cmd[prop as keyof Command] ===
                    e[prop as keyof KeyboardEvent]
                )
                    continue;

                invalid = true;
                break;
            }

            if (invalid) continue;

            cmd.callback(this.player);

            break;
        }
    }
}
