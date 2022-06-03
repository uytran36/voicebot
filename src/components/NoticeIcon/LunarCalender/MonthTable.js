import React, { Component } from 'react'
import HeadRow from './HeadRow'
import DateCell from './DateCell';
import Utils from './utils'
import './style.css'
class MonthTable extends Component {
    constructor(props) {
        super()
        var selectDate = Utils.getDateInfo(),
            selectMonth = Utils.getSelectedMonth()
        this.state = {
            selectedMonth: selectMonth,
            selectedDate: selectDate//Utils.getDateInfo()
        }
        this.onChangeMonth = this.onChangeMonth.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.setSelectDate = this.setSelectDate.bind(this)
    }
    onChangeYear(YY) {
        var sm = this.state.selectedMonth
        this.setState(Object.assign({}, this.state, { selectedMonth: { mm: sm.mm, yy: YY } }))
    }
    setSelectDate(date){
        console.log({date})
        this.setState(Object.assign({}, this.state, { selectedDate: date }))
    }
    onChangeMonth(MM) {
        var sm = this.state.selectedMonth
        this.setState(Object.assign({}, this.state, { selectedMonth: { mm: MM, yy: sm.yy } }))
    }
    render() {
        var { mm, yy } = this.state.selectedMonth;
        var currentMonth = Utils.getMonth(mm, yy);
        var prevMonth = Utils.getMonth(mm === 1 ? 12 : mm - 1, mm === 1 ? yy - 1 : yy);
        var nextMonth = Utils.getMonth(mm === 12 ? 1 : mm + 1, mm === 12 ? yy + 1 : yy);
        if (currentMonth.length == 0) return <div>Blank</div>;
        var ld1 = currentMonth[0];
        var emptyCells = (ld1.jd + 1) % 7;

        return (
            <table className="thang"  cellPadding="0" cellSpacing="0"  >
                <HeadRow mm={mm} yy={yy} onChangeYear={this.onChangeYear} onChangeMonth={this.onChangeMonth} />
                <tbody>
                    {Array(5).fill().map((v, i) => {
                        return (
                            <tr key={i}>
                                {Array(7).fill().map((v, j) => {
                                    var k = 7 * i + j;
                                    var solar = k - emptyCells + 1;
                                    var ld1 = currentMonth[k - emptyCells];
                                    var cellData = { lunarDate: ld1, solarDate: solar, solarMonth: mm, solarYear: yy, selDate: this.state.selectedDate };

                                    if (!ld1 && solar <= 0) {
                                        ld1 = prevMonth[prevMonth.length - 1 + solar];
                                        solar = prevMonth.length + solar;
                                        cellData = { lunarDate: ld1, solarDate: solar, solarMonth: mm - 1, solarYear: yy, selDate: this.state.selectedDate };
                                    }
                                    if (!ld1 && solar > currentMonth.length) {
                                        ld1 = nextMonth[solar - currentMonth.length - 1];
                                        solar = solar - currentMonth.length;
                                        cellData = { lunarDate: ld1, solarDate: solar, solarMonth: mm + 1, solarYear: yy, selDate: this.state.selectedDate };
                                    }

                                    return (k < emptyCells || k >= emptyCells + currentMonth.length) ?
                                        <DateCell setDateCurren={this.props.setDateCurren} setSelectDate={this.setSelectDate} data={cellData} key={k} mId={k} mode={true} /> :
                                        <DateCell setDateCurren={this.props.setDateCurren} setSelectDate={this.setSelectDate} data={cellData} key={k} mId={k} />
                                })
                                }
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

export default MonthTable