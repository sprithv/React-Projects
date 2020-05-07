import React, { Component } from 'react';

//this class should show the results as suggestions
export class AutoComplete extends Component {
    constructor(props){
        super(props);
        this.state = {
            options:''
        }
    }
    render(){
        console.log(this.props.response)
        return (<>
            <div className="suggestions">
                Results
            </div>
        </>)
    }
}

export default AutoComplete;