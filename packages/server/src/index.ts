import express = require("express");
import helmet = require("helmet");
import cors = require("cors");
import router from "./routes/v1";
require("dotenv").config({ path: require("find-config")(".env") });

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error(
        "env.SPOTIFY_CLIENT_ID or env.SPOTIFY_CLIENT_SECRET is not set!"
    );
    process.exit(1);
}

app.use(helmet())
    .use(cors())
    .use(express.urlencoded({ extended: true }))
    .use("/v1/", router);

app.get("/", function(_req, res) {
    res.redirect(301, "https://github.com/eai04191/littlify");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});