import React, { Component } from 'react'
import { connect } from 'react-redux'

import i18n from '@/utils/i18n'
import { Form, Input, Row, Col } from 'antd'
import moment from 'moment'
import classNames from 'classnames'
import './viewField.less'
import FormField from './index'
import { getType } from '@/utils/language'

class StepField extends Component { 
    constructor() { 
        super()
    }

    //  渲染每一行
    renderRow(stepData, item) { 
        let rowClassName = 'step-row-half'
        let labelClassName = ''
        let valueClassName = ''
        if (item.longField) {
            rowClassName = 'step-row-full'
            labelClassName = 'step-row-label-lg'
            valueClassName = 'step-row-value-sm'
        } else if (item.columns > 1) {
            rowClassName = 'step-row-full'
            labelClassName = 'step-row-label-sm'
            valueClassName = 'step-row-value-lg'
        }
        // if (item.relationFunc) { 
        //     rowClassName = 'step-row-full'
        // }
        return (
            <div className={rowClassName}>
                <div className={`step-row-label ${labelClassName}`} title={item.label}>{item.label}{item.label&& ':'}</div>
                <div className={`step-row-value ${valueClassName}`}>{stepData[item.key]}</div>
            </div>
        )
    }

    renderRelation = (fieldsData, stepData, item) => { 
        let temp = []
        let recursionFuc = (fieldsData, stepData, item) => { 
            if (item) {
                temp.push(this.renderRow(stepData, item))
                let tempItem = null
                let key = null
                if (item.relationFunc) {
                    item.optionList && item.optionList.length && item.optionList.forEach((option) => { 
                        if (option.value == item.defaultValue) { 
                            key = option.relationField
                        }
                    })
                    fieldsData.forEach((field) => { 
                        if (key == field.key) { 
                            tempItem = field
                        }
                    })
                }
                recursionFuc(fieldsData, stepData, tempItem)
            }
        }
        recursionFuc(fieldsData, stepData, item)
        return temp
    }

    renderField(fieldsData) {
        let elementArray = []
        let formField = new FormField()
        let stepData = formField.formatFieldData(fieldsData)
        if (fieldsData.length && stepData) {
            //  根据已有字段及值渲染dom
            fieldsData.forEach((item, index) => { 
                if (this.props.showChanged) {
                    elementArray.push(this.renderRow(stepData, item))
                } else {
                    if (!item.relation) { 
                        elementArray = elementArray.concat(this.renderRelation(fieldsData, stepData, item))
                    }
                }
            })
        }
        return elementArray
    }

    render() {
        const { fieldsData, title, className, children } = this.props
        let stepClassName = classNames('step-panel', className)
        return (
            <div className={stepClassName}>
                <div className="step-tit">{title}</div>
                <div className="step-body">
                    {
                        fieldsData.map(el=>{
                            return <div className="step-field">
                            <div className="step-title">{el.languageSettingMap[getType()]}</div>
                            <div className="step-data">
                                {this.renderField(el.fieldList)}
                            </div>
                        </div>
                        })
                    }
                    {
                        fieldsData.description && <div className="step-description">
                            <div className="step-description-tit">{i18n['realaccount.homony.comment']}</div>
                            <div className="step-description-con">{fieldsData.description}</div>
                        </div>
                    }
                    {children}
                </div>
            </div>
            
        )
    }
}

export default StepField