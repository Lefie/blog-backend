
const month_dict = {
    1:"January",
    2:"February",
    3:"March",
    4:"April",
    5:"May",
    6:"June",
    7:"July",
    8:"August",
    9:"September",
    10:"October",
    11:"November",
    12:"December"
}

const format_date = () => {
    const date = new Date()
    const day = date.getDate()
    const month = month_dict[date.getMonth() + 1]
    const year = date.getFullYear()
    const formatted_date = `${month} ${day}, ${year}`
    return formatted_date
}

module.exports = format_date