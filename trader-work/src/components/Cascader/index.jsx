import React from 'react';
import { render as domRender } from 'react-dom';
import { Select } from 'antd'
import api from '@/api'
const Option = Select.Option


class CascaderPlace extends React.Component{
    
    state = {
      provinceData: [],
      cityData: [],
      areaData: [],
      cityData1: [],
      areaData1: [],
      chosenData: [],
    }
    componentDidMount() {
      const countriesData = JSON.parse(localStorage.getItem('CACHEDCOUNTRIES'))
      const provinceMap = {}
      const provinceData = countriesData.filter(el=>{
        if(el.pid === '0'){
          provinceMap[el.id] = true
          return true
        }
      })
      this.setState({
        provinceData
      })
      
      const cityData = []
      const cityMap = {}
      countriesData.forEach(el=>{
        if(provinceMap[el.pid]){
          cityMap[el.id] = true
          cityData.push(el)
        }
      })
      this.setState({
        cityData
      })
      
      const areaData = []
      countriesData.forEach(el=>{
        if(cityMap[el.pid]){
          areaData.push(el)
        }
      })
      this.setState({
        areaData
      })
    }
    handleProvince = (value)=>{
      let cityData1 = this.state.cityData.filter(el=>{
        return el.pid === value
      })
      this.state.chosenData = []
      this.state.chosenData.push(value)
      this.setState({
        cityData1
      })
    }
    handleCity = (value)=>{
      let areaData1 = this.state.areaData.filter(el=>{
        return el.pid === value
      })
      this.state.chosenData.push(value)
      this.setState({
        areaData1
      })
    }
    handleArea = (value)=>{
      this.state.chosenData.push(value)
      this.props.onChange(this.state.chosenData)
    }
    render() {
      
      
      return  <div>
                <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{width: '30%',marginRight: '3%'}} onChange={this.handleProvince} placeholder={this.props.placeholder}>
                  {
                    this.state.provinceData.map(el=>{
                      return <Option value={el.id}>{el.value}</Option>
                    })
                  }
                </Select>
                <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{width: '30%',marginRight: '3%'}} onChange={this.handleCity} placeholder={this.props.placeholder}>
                  {
                    this.state.cityData1.map(el=>{
                      return <Option value={el.id}>{el.value}</Option>
                    })
                  }
                </Select>
                <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{width: '30%',marginRight: '3%'}} onChange={this.handleArea} placeholder={this.props.placeholder}>
                  {
                    this.state.areaData1.map(el=>{
                      return <Option value={el.id}>{el.value}</Option>
                    })
                  }
                </Select>
              </div>
              
    }
}
export default CascaderPlace