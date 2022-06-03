import React from "react"
import Utils from './utils'
import { Select } from 'antd';

const { Option } = Select;
class HeadRow extends React.Component {
    render() {
        var monthName = this.props.mm + "/" + this.props.yy
        var {mm, yy} = this.props

        return (
            <thead>
                <tr>
                    <td colSpan="3" >
                        <Select value={this.props.yy}className="tennam" onSelect={this.props.onChangeYear}>
                            <Option value={2020}> 2020</Option>
                            <Option value={2021}> 2021</Option>
                            <Option value={2022}> 2022</Option>
                        </Select>
                    </td>
                    <td colSpan="4" >
                        <Select value={this.props.mm} className="tennam" onSelect={this.props.onChangeMonth}>
                            <Option value={1}>T1</Option>
                            <Option value={2}>T2</Option>
                            <Option value={3}>T3</Option>
                            <Option value={4}>T4</Option>
                            <Option value={5}>T5</Option>
                            <Option value={6}>T6</Option>
                            <Option value={7}>T7</Option>
                            <Option value={8}>T8</Option>
                            <Option value={9}>T9</Option>
                            <Option value={10}>T10</Option>
                            <Option value={11}>T11</Option>
                            <Option value={12}>T12</Option>
                        </Select>
                    </td>
                </tr>
                <tr>
                    {
                        Array(7).fill().map((v, i) => {
                            return <td className="ngaytuan" key={i}>{Utils.DAYNAMES[i]}</td>
                        })
                    }
                </tr>
            </thead>
        )
    }
}

export default HeadRow