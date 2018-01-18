import React,{Component}from 'react'
import { Table,Tabs,Input, Button,Icon,Select,DatePicker } from 'antd';
const Option = Select.Option;

class City extends Component{
  render() {
    return(
       <Select defaultValue="城市" style={{ width: 120 }} onChange={this.city} allowClear={true}>
         <Option value="root">汇总</Option>
         <Option value="all">所有</Option>
         <Option value="240">沈阳</Option>
         <Option value="410">铁岭</Option>
         <Option value="411">大连</Option>
         <Option value="412">鞍山</Option>
         <Option value="413">抚顺</Option>
         <Option value="414">本溪</Option>
         <Option value="415">丹东</Option>
         <Option value="416">锦州</Option>
         <Option value="417">营口</Option>
         <Option value="418">阜新</Option>
         <Option value="419">辽阳</Option>
         <Option value="421">朝阳</Option>
         <Option value="427">盘锦</Option>
         <Option value="429">葫芦岛</Option>
         <Option value="000">辽宁省</Option>
      </Select>
    )}
}
export default City;
