import React from 'react';
import css from "./item.less";

export class Item extends React.Component {

    render() {
        let src = this.props.src ? this.props.src : null;
        return (
            <div className={css["item"]} style={this.props.itemStyle}>
                <div 
                    className={css["icon"]}
                    style={{
                        background: `url(${src})`,
                        backgroundSize: "100%"
                    }}
                >
                </div>
                <div 
                    className={css["title"]}
                    style={this.props.titleStyle}
                >
                    {this.props.title}
                </div>
                <div 
                    className={css["content"]}
                    style={this.props.contentStyle}
                >
                    {this.props.content}
                </div>
            </div>
        )
    }

}

Item.propTypes = {
    src: React.PropTypes.any,
    itemStyle: React.PropTypes.object,
    titleStyle: React.PropTypes.object,
    title: React.PropTypes.string,
    content: React.PropTypes.string
}