const MONTHS = new Set (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']);
const YEARS =   new Set(["2020", "2021", "2019", "2018"]);
const URLS = {
    pa: "https://www.playpennsylvania.com/sports-betting/revenue",
    nj: "https://www.playnj.com/sports-betting/revenue",
    in: "https://www.playindiana.com/revenue",
    wv: "https://www.playwv.com/revenue"
}

module.exports = {
    MONTHS,
    YEARS,
    URLS
}