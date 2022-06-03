const formatStringToString = (stringDate) => {
    if (stringDate) {
        let date = new Date(stringDate);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        minutes= minutes < 10 ? "0" + minutes : minutes;
        let strTime = hours + ":" + minutes;
        let strDate = `${date.getDate() / 10 >= 1 ? date.getDate() : "0" + date.getDate()}/${(date.getMonth() + 1) / 10 >= 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}/${date.getFullYear()}`;

        return strDate + ' ' + strTime;
    }
    return ''
};
export {
    formatStringToString
}