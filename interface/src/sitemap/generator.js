
require("babel-register")({
    presets: ["es2015", "react"]
});

const router = require("./routes").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
    return (
        new Sitemap(router)
            .build(((process.env.REACT_APP_LOCALHOST) ? process.env.REACT_APP_LOCALHOST : "https://pogpvp.com"))
            .save("./public/sitemap/sitemap.xml")
    );
}

generateSitemap();