const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const path = require('path');

const config = {
    user: "produkt1",
    // Password optional, prompted if none given
    password: process.env.CDN_PASS,
    host: process.env.CDN_HOST,
    localRoot: __dirname+"/uploads",
    remoteRoot: "/api.produkty24.kz/",
    // include: ["*", "**/*"],      // this would upload everything except dot files
    include: ["*"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: ["node_modules/**"],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: false
};

const deploy = () => {
    ftpDeploy
    .deploy(config)
    .then(res => console.log("finished:", res))
    .catch(err => console.log(err));
}

module.exports = deploy;