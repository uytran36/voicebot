import React, { Component } from 'react'
import { notification } from 'antd'
import Utils from '../utils'

class DateCell extends Component {
    constructor(props) {
        super()
        this.state = {
            cellClass: "ngaythang",
            lunarClass: "am",
            solarClass: 't2t6',
            solarColor: "black"
        }
        this.alertDayInfo = this.alertDayInfo.bind(this)
    }

    alertDayInfo = function (e) {
        var today = new Date();
        var selectedDate = new Date(this.props.data.solarMonth + "/" + this.props.data.solarDate + "/" + this.props.data.solarYear);
        var checkDate = new Date((today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear());
        if (selectedDate.getTime() >= checkDate.getTime()) {
            var date = { sday: this.props.data.solarDate, smonth: this.props.data.solarMonth, syear: this.props.data.solarYear }
            this.props.setDateCurren(this.props.data.solarMonth + "/" + this.props.data.solarDate + "/" + this.props.data.solarYear)
            this.props.setSelectDate(Utils.getDateInfo(date))
        } else {
            notification.error({
                message: `Ngày không hợp lệ`,
                description:
                    'Vui lòng chọn ngày lớn hơn hoặc bằng hiện tại!!',
                placement: 'topRight'
            });
        }

    }
    render() {
        var today = new Date();
        var { lunarDate, solarDate, solarMonth, solarYear, selDate } = this.props.data
        var { cellClass, solarClass, lunarClass, solarColor } = this.state;
        lunarClass = this.props.mode ? "am3" : "am";
        solarColor = this.props.mode ? "gray" : "black";
        var dow = (lunarDate.jd + 1) % 7;
        if (dow == 0) {
            solarClass = "cn";
            solarColor = this.props.mode ? "gray" : "red";
        } else if (dow == 6) {
            solarClass = "t7";
            solarColor = this.props.mode ? "gray" : "green";
        }
        var checkDate = { sday: today.getDate(), smonth: today.getMonth() + 1, syear: today.getFullYear() }
        var selectDate = selDate;
        if (solarDate == checkDate.sday && solarMonth == checkDate.smonth && solarYear == checkDate.syear) {
            cellClass = "homnay";
        }
        if (solarDate == selectDate.sday && solarMonth == selectDate.smonth && solarYear == selectDate.syear) {
            cellClass = "ngaychon";
        }
        // if (lunarDate.day == 1 && lunarDate.month == 1) {
        //     cellClass = "tet";
        // }
        if (lunarDate.leap == 1) {
            lunarClass = this.props.mode ? "am3" : "am2";
        }
        var lunar = lunarDate.day;
        if (solarDate == 1 || lunar == 1) {
            lunar = lunarDate.day + "/" + lunarDate.month;
        }
        var id = this.props.mId;
        var title = (lunarDate != null) ? Utils.getDayName(lunarDate) : ""
            //lunarDate.day + "," + lunarDate.month + "," + lunarDate.year + "," + lunarDate.leap +  "," + lunarDate.llen +
            ("," + lunarDate.jd + "," + solarDate + "," + solarMonth + "," + solarYear);
        //(lunarDate != null)? Utils.getDayName(lunarDate):""

        return (
            <td className={cellClass} id={'cell' + id} title={title} onClick={this.alertDayInfo} >
                <div style={{ color: solarColor }} className={solarClass}><a >{solarDate}</a></div>
                <div className={lunarClass}>{lunar}</div>
            </td>
        )

    }
}

export default DateCell