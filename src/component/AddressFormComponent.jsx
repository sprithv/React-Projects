import React,{Component} from 'react';
import axios from 'axios';

//API Key constant
const APP_KEY = 'TidSoV8wUEQKamXjFUv52sBNjGOcm9wUyXddsGXS0U8';
const COUNTRY_CODE = "USA";
const MAX_RESULTS_COUNT = 5;
let addressJSONArray ={};

class AddressFormComponent extends Component {
    constructor(props){
        super();
        this.state = {
            userInput:'',
            activeOption: 0,
            showSuggestions:false,
            city: '',
            country: '',
            county: '',
            postalCode: '',
            state: '',
            suggestions: [],
            street:''
        }
        this.makeAddressAPICall = this.makeAddressAPICall.bind(this);
        this.handleAddressAPIResponse = this.handleAddressAPIResponse.bind(this);
        this.showWhiteBorderBottom = this.showWhiteBorderBottom.bind(this);
        this.fillAddressForm = this.fillAddressForm.bind(this);
    }

    fillAddressForm(event){
        //console.log(event.currentTarget.dataset.id);
        const userSelected = event.currentTarget.dataset.id.toLowerCase();
        if(addressJSONArray.length > 0){
            addressJSONArray.forEach(addressJSON => console.log(addressJSON))
            const addressInState = addressJSONArray.filter(addrObj => {
                let key = Object.keys(addrObj);
                let addrJSON;
                if(userSelected.indexOf(key[0]) > -1){
                    addrJSON = addrObj[key];
                }
                return addrJSON;
            });
                
            //console.log(addressInState[0][userSelected])
            this.setState({
                city:addressInState[0][userSelected].city,
                state:addressInState[0][userSelected].state,
                street:addressInState[0][userSelected].street,
                country:addressInState[0][userSelected].country,
                postalCode:addressInState[0][userSelected].postalCode,
                activeOption: 0,
                suggestions: [],
                showOptions: false,
            })
            console.log(this.state.city)
        }
    }
    render(){
        const {
            state:{
                activeOption,
                showSuggestions,
                suggestions,
                userInput
            }
        } = this;
        let suggestionList;

        if(showSuggestions && userInput){
            if(suggestions.length > 0){
                //console.log("suggestions "+suggestions)
                suggestionList = (
                <div id="autocomplete-list" className="autocomplete-items" >
                    {suggestions.map((suggestion,index) =>{
                        return(
                            <div key={index} onClick={this.fillAddressForm} data-id={suggestion}>{suggestion}</div>
                        );
                    }
                    )}
                </div>
                )
            }
        }
        return (
        <>
            <div className="container">
                <div className="row">
                <form className="form-horizontal">
                    <fieldset>
                    {/* Address form */}
                    <h2>Address Form</h2>
                    {/* full-name input*/}
                    <div className="control-group">
                        <label className="control-label">Full Name</label>
                        <div className="controls">
                        <input id="full-name" name="full-name" type="text" placeholder="full name" className="input-xlarge" />
                        <p className="help-block" />
                        </div>
                    </div>
                    {/* address-line1 input*/}
                    <div className="control-group">
                        <label className="control-label">Address 1</label>
                        <div class="autocomplete">
                        {/* <p className="help-block">Street address, P.O. box, company name, c/o</p> */}
                        <input autoComplete="off" id="address-line1" name="address-line1" type="text" placeholder="address line 1" className="input-xlarge" 
                        value={this.state.userInput} onChange={this.makeAddressAPICall}/>
                        {suggestionList}
                        </div>
                    </div>
                    {/* address-line2 input*/}
                    <div className="control-group">
                        <label className="control-label">Address Line 2</label>
                        <div className="controls">
                        <input id="address-line2" name="address-line2" type="text" placeholder="address line 2" className="input-xlarge" 
                        value={this.state.street}/>
                        <p className="help-block">Apartment, suite , unit, building, floor, etc.</p>
                        </div>
                    </div>
                    {/* city input*/}
                    <div className="control-group">
                        <label className="control-label">City / Town</label>
                        <div className="controls">
                        <input id="city" name="city" type="text" placeholder="city" className="input-xlarge" 
                        value={this.state.city}/>
                        <p className="help-block" />
                        </div>
                    </div>
                    {/* region input*/}
                    <div className="control-group">
                        <label className="control-label">State / Province / Region</label>
                        <div className="controls">
                        <input id="region" name="region" type="text" placeholder="state / province / region" className="input-xlarge" 
                        value={this.state.state}/>
                        <p className="help-block" />
                        </div>
                    </div>
                    {/* postal-code input*/}
                    <div className="control-group">
                        <label className="control-label">Zip / Postal Code</label>
                        <div className="controls">
                        <input id="postal-code" name="postal-code" type="text" placeholder="zip or postal code" className="input-xlarge" 
                        value={this.state.postalCode}/>
                        <p className="help-block" />
                        </div>
                    </div>
                    {/* country select */}
                    <div className="control-group">
                        <label className="control-label">Country</label>
                        <div className="controls">
                        <input id="country" name="country" type="text" placeholder="country" className="input-xlarge" 
                        value={this.state.country}/>
                        <p className="help-block" />
                        </div>
                    </div>
                    </fieldset>
                </form>
                </div>
            </div>
        </>)
    }

    makeAddressAPICall(e){
        //console.log("makeAddressAPICall using "+e.target.value);
        this.setState({
            userInput:e.target.value
        });
        const query = e.target.value;
        axios.get('https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?countryCode=USA',
        {
            'params':{
                'apiKey':APP_KEY,
                'query':query,
                'maxresults':MAX_RESULTS_COUNT,
                'country':COUNTRY_CODE
            }
        }
        )
        .then(
            response => this.handleAddressAPIResponse(response)
        )
    }

    handleAddressAPIResponse(response){
        const userInputValue = this.state.userInput;
        //reset input text on clearing the field
        if(!userInputValue.length >0){
            this.setState({userInputValue:''});
            return;
        }
        const addressList = response.data.suggestions;
        
        const labels = addressList.map(address => address.label)        //get individual address labels

        //addressJSONArray = addressList.map((address) => address.address);

        addressJSONArray = addressList.map((eachAddr) => {
            let addressLabelArray ={};
            addressLabelArray[eachAddr.label.toLowerCase()] = eachAddr.address;
            return addressLabelArray;
        });
        //console.log(userInputValue+"-"+labels);
        
        //check if the userinput is present in the labels
        const suggestions = labels.filter(function filterResults(label){
            return label.toLowerCase().indexOf(userInputValue.toLowerCase()) > -1
        })
        
        //console.log(suggestions);
        this.setState({
            activeOption: 0,
            showSuggestions:true,
            suggestions:suggestions,
            userInput:userInputValue
        });
    }
    
    showWhiteBorderBottom(){
        return({borderBottomColor: "white"});
    }
}

export default AddressFormComponent;