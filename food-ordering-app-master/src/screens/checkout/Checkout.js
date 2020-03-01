import React, {Component} from 'react';
import '../checkout/Checkout.css';
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import {GridListTile, Typography} from '@material-ui/core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

library.add(faCircle);

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    gridListMain: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '600px'
    },
    card: {
        maxWidth: 560,
        margin: 10,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    title: {
        fontWeight: 'strong',
        color: 'red',
    },
    actions: {
        display: 'flex',
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    snackbar: {
        margin: theme.spacing.unit,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    button: {
        margin: '20px'
    }
});


function getSteps() {
    return ['Delivery', 'Payment'];
}


function isNum(val) {
    return /^\d+$/.test(val);
}

class Checkout extends Component {

    constructor() {
        super();

        this.state = {
            id: "",
            paymentId: "",
            location: "",
            tabValue: 0,
            activeStep: 0,
            flat: "",
            city: "",
            open: false,
            locality: "",
            zipcode: "",
            statename: "",
            iconClass: "",
            addressClass: "",
            selectedIndex: "",
            flatRequired: "dispNone",
            cityRequired: "dispNone",
            stateRequired: "dispNone",
            zipcodeRequired: "dispNone",
            localityRequired: "dispNone",
            incorrectZipcode: "dispNone",
            orderPlaced: "dispNone",
            incorrectDetails: "false",
            address: "",
            categories: [],
            totalCartItemsValue: "",
            orderNotificationMessage: "",
            states: [],
            stateId: '',
            selectedAddress: [],
            cartItems: [],
            paymentModes: [],
            addresses: [],
            restaurant:[]
        }
    }

    componentWillMount() {

        if (sessionStorage.getItem("access-token") == null) {
            this.props.history.push('/');
        }
        else {
            let resourcePath = "/address/customer";
            let resourcePath1 = "/payment/";
            let resourcePath2 = "/states/";
            let data = null;
            let xhr = new XMLHttpRequest();
            let xhr1 = new XMLHttpRequest();
            let xhr2 = new XMLHttpRequest();
            let that = this;
            console.log("baseurl : " + this.props.baseUrl + resourcePath);
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                    that.setState({
                        addresses: JSON.parse(this.responseText).addresses
                    });
                }
            });

            xhr.open("GET", this.props.baseUrl + resourcePath);
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
            xhr.send(data);

            xhr1.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                    that.setState({
                        paymentModes: JSON.parse(this.responseText).paymentMethods
                    });
                }
            });

            xhr1.open("GET", this.props.baseUrl + resourcePath1);
            xhr1.setRequestHeader("accessToken", sessionStorage.getItem("access-token"));
            xhr1.send(data);

            xhr2.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                    that.setState({
                        states: JSON.parse(this.responseText).states
                    });
                }
            });

            xhr2.open("GET", this.props.baseUrl + resourcePath2);
            xhr2.send(data);
        }

    }

    tabChangeHandler = (event, tabValue) => {
        this.setState({tabValue});
    }

    locationChangeHandler = event => {
        this.setState({stateId: event.target.value, location: event.target.text});
    }


    handleNext = () => {
        if (this.state.tabValue === 1) {

            this.state.flat === "" ? this.setState({
                incorrectDetails: "true",
                flatRequired: "dispBlock"
            }) : this.setState({incorrectDetails: "false", flatRequired: "dispNone"});
            this.state.city === "" ? this.setState({
                incorrectDetails: "true",
                cityRequired: "dispBlock"
            }) : this.setState({incorrectDetails: "false", cityRequired: "dispNone"});
            this.state.locality === "" ? this.setState({
                incorrectDetails: "true",
                localityRequired: "dispBlock"
            }) : this.setState({incorrectDetails: "false", localityRequired: "dispNone"});
            this.state.zipcode === "" ? this.setState({
                incorrectDetails: "true",
                zipcodeRequired: "dispBlock"
            }) : this.setState({incorrectDetails: "false", zipcodeRequired: "dispNone"});
            if (this.state.zipcode !== "") {
                if (this.state.zipcode.length === 6 && isNum(this.state.zipcode)) {
                    this.setState({incorrectDetails: "false", incorrectZipcode: "dispNone"})
                }
                else {
                    this.setState({incorrectDetails: "true", incorrectZipcode: "dispBlock"})
                }
            }
            if (this.state.incorrectDetails === "false") {
                let  savedAddress = {
                    "id": "",
                    "flatBuilNo": this.state.flatBuilNo,
                    "locality": this.state.locality,
                    "city": this.state.city,
                    "zipcode": this.state.zipcode,
                    "state": {
                        "id": this.state.stateId,
                        "stateName": this.state.location
                    }
                }
                this.setState({
                    selectedAddress: savedAddress,
                });
            }
        }

        if (this.state.activeStep === 1 && this.state.paymentId !== "") {
            this.setState(state => ({
                orderPlaced: "dispBlock",
                activeStep: state.activeStep + 1
            }));
        }

        if (this.state.activeStep !== 1 && this.state.incorrectDetails === "false" && this.state.selectedAddress.length !== 0) {
            this.setState(state => ({
                activeStep: state.activeStep + 1,
            }));
        }

    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    paymentHandleChange = event => {
        console.log("payment handler.............")
        this.setState({paymentId: event.target.value});
    };

    inputFlatChangeHandler = (e) => {
        this.setState({
            flatBuilNo: e.target.value,
        });
    }

    inputCityChangeHandler = (e) => {
        this.setState({city: e.target.value});
    }

    inputLocalityChangeHandler = (e) => {
        this.setState({locality: e.target.value});
    }

    inputZipcodeChangeHandler = (e) => {
        this.setState({zipcode: e.target.value});
    }

    inputStateChangeHandler = (e) => {
        this.setState({stateId: e.target.value});
    }

    changeHandler = () => {
        ReactDOM.render(<Checkout/>, document.getElementById('root'));
    }

    iconClickHandler = (address, index) => {
        this.state.addresses.map(obj => (
            obj.id === address.id ?
                this.setState({
                    selectedAddress: address,
                    selectedIndex: index,
                    addressClass: "selectionGrid",
                    iconClass: "green"
                })
                :
                console.log("dint match " + obj.id)
        ));
    }

    snackBarCloseHandler = () => {
        this.setState({
            open: false
        });
    }

    confirmOrderHandler = (name, value) => {
        let resourcePath3 = "/order";
        let xhr = new XMLHttpRequest();
        let that = this;
        let address = this.state.selectedAddress;
        let parameters;
        let item_quantities;
        let restuarntid;

        if (this.props.location.cartItems === undefined) {
           
            that.setState({
                open: true,
                orderNotificationMessage: "Unable to place your order! Please try again!"
            });
            return;
        } else {
            this.props.location.cartItems.map(item => {
                this.state.cartItems.push({
                    "item_id": item.id,
                    "quantity": item.quantity,
                    "price":item.price
                });
            });

            item_quantities = this.state.cartItems;
        }
        if (address.length === 0) {
           
            that.setState({
                open: true,
                orderNotificationMessage: "Unable to place your order! Please try again!"
            });
            return;
        }
        if (address.id !== "") {
           // this.props.location.restaurants.map(item => {
                  // restuarntid = item.id;
           // });
           var data = {};
           
            data = "address_id:"  +  this.state.selectedAddress.id + 
                ",payment_id:" + this.state.paymentId +
                ",restaurant_id:" + this.props.location.restaurant.id +
                ",coupon_id:" + "" +
                ",discount:" + 0 +
                ",item_quantities:" + item_quantities +
                ",bill:" + this.props.location.totalCartValue;


        } else {
            parameters = "flatBuilNo=" + address.flatBuilNo +
                "&locality=" + address.locality +
                "&city=" + address.city +
                "&zipcode=" + address.zipcode +
                "&stateId=" + address.state.id +
                "&paymentId=" + Number(this.state.paymentId) +
                "&bill=" + this.props.location.totalCartValue;

        }

        
        //console.log("order placed params : " + data);
        //console.log("order placed body : " + item_quantities);

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 201) {
                that.setState({
                    open: true,
                    orderNotificationMessage: "Your order placed successfully! Your order ID is " + this.responseText
                });
            }
            else {
                console.log(this.responseText);
                that.setState({
                    open: true,
                   
                    orderNotificationMessage: "Unable to place your order! Please try again!"
                });
            }
        });
               
        xhr.open("POST", this.props.baseUrl + resourcePath3);
        
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhr.send(JSON.stringify({address_id:this.state.selectedAddress.id, payment_id:this.state.paymentId,restaurant_id:this.props.location.restaurant.id,coupon_id:"",discount:0,item_quantities:item_quantities,bill:this.props.location.totalCartValue}));

    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state
        console.log(this.props.location);
        const {cartItems, totalCartValue,restaurant} = this.props.location;
        return (
            <div className="checkout">
                <Header {...this.props} isHomePage={false}/>
                <div className="main-body-container">
                    <div>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => {
                                return (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            {index === 0 &&
                                            <div>
                                                <Tabs className="addTabs" value={this.state.tabValue}
                                                      onChange={this.tabChangeHandler}>
                                                    <Tab label="EXISTING ADDRESS"/>
                                                    <Tab label="NEW ADDRESS"/>
                                                </Tabs>

                                                {this.state.tabValue === 0 &&
                                                (this.state.addresses.length !== 0 ?
                                                        <GridList cellHeight={"auto"} className={classes.gridListMain}
                                                                  cols={3}>
                                                            {this.state.addresses.map((address, i) => (
                                                                <GridListTile key={i} style={{padding: '20px'}}>
                                                                    <div id={i} key={i}
                                                                         className={this.state.selectedIndex === i ? 'selectionGrid' : 'grid'}
                                                                         style={{padding: '10px'}}>
                                                                        <Typography style={{
                                                                            fontSize: '20px',
                                                                            marginRight: '20px',
                                                                            marginBottom: '5px'
                                                                        }}>{address.flat_building_name}</Typography>
                                                                        <Typography style={{
                                                                            fontSize: '20px',
                                                                            marginRight: '20px',
                                                                            marginBottom: '10px'
                                                                        }}>{address.locality}</Typography>
                                                                        <Typography style={{
                                                                            fontSize: '20px',
                                                                            marginRight: '20px',
                                                                            marginBottom: '10px'
                                                                        }}>{address.city}</Typography>
                                                                        <Typography style={{
                                                                            fontSize: '20px',
                                                                            marginRight: '20px',
                                                                            marginBottom: '10px'
                                                                        }}>{address.state.state_name}</Typography>
                                                                        <Typography style={{
                                                                            fontSize: '20px',
                                                                            marginRight: '20px',
                                                                            marginBottom: '10px'
                                                                        }}>{address.pincode}</Typography>
                                                                        <IconButton id={i} key={i}
                                                                                    style={{marginLeft: '60%'}}
                                                                                    onClick={() => this.iconClickHandler(address, i)}>
                                                                            <CheckCircle
                                                                                className={this.state.selectedIndex === i ? 'green' : 'grid'}/>
                                                                        </IconButton>
                                                                    </div>
                                                                </GridListTile>
                                                            ))}
                                                        </GridList>
                                                        :
                                                        <div style={{marginBottom: '100px'}}>
                                                            <Typography style={{color: 'grey', fontSize: '18px'}}>There
                                                                are no saved addresses! You can save an address using
                                                                your ‘Profile’ menu option.</Typography>
                                                        </div>
                                                )}
                                                {this.state.tabValue === 1 &&
                                                <div className="dispFlex">
                                                    <FormControl required>
                                                        <InputLabel htmlFor="flat">Flat/Building No.</InputLabel>
                                                        <Input id="flat" type="text" flat={this.state.flat}
                                                               defaultValue={this.state.flat}
                                                               onChange={this.inputFlatChangeHandler}/>
                                                        <FormHelperText className={this.state.flatRequired}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <br/><br/>
                                                    <FormControl required>
                                                        <InputLabel htmlFor="locality">Locality</InputLabel>
                                                        <Input id="locality" locality={this.state.locality}
                                                               defaultValue={this.state.locality}
                                                               onChange={this.inputLocalityChangeHandler}/>
                                                        <FormHelperText className={this.state.localityRequired}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <br/><br/>
                                                    <FormControl required>
                                                        <InputLabel htmlFor="city">City</InputLabel>
                                                        <Input id="city" city={this.state.city}
                                                               defaultValue={this.state.city}
                                                               onChange={this.inputCityChangeHandler}/>
                                                        <FormHelperText className={this.state.cityRequired}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <br/><br/>
                                                    <FormControl required>
                                                        <InputLabel htmlFor="location">State</InputLabel>
                                                        <Select
                                                            value={this.state.stateId}
                                                            onChange={this.inputStateChangeHandler}
                                                        >
                                                            {this.state.states.map(loc => (
                                                                <MenuItem key={"loc" + loc.id} value={loc.id}>
                                                                    {loc.state_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText className={this.state.stateRequired}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <br/><br/>
                                                    <FormControl required>
                                                        <InputLabel htmlFor="zipcode">Zipcode</InputLabel>
                                                        <Input id="zipcode" zipcode={this.state.zipcode}
                                                               defaultValue={this.state.zipcode}
                                                               onChange={this.inputZipcodeChangeHandler}/>
                                                        <FormHelperText className={this.state.zipcodeRequired}>
                                                            <span className="red">required</span>
                                                        </FormHelperText>
                                                        <FormHelperText className={this.state.incorrectZipcode}>
                                                            <span className="red">Zipcode must contain only numbers and must be 6 digits long</span>
                                                        </FormHelperText>
                                                    </FormControl>
                                                    <br/><br/>
                                                </div>
                                                }
                                            </div>
                                            }
                                            {
                                                index === 1 &&
                                                <div>
                                                    <FormControl component="fieldset" className={classes.formControl}>
                                                        <FormLabel component="legend">Select Mode of Payment</FormLabel>
                                                        <RadioGroup
                                                            aria-label="Gender"
                                                            name="gender1"
                                                            className={classes.group}
                                                            value={this.state.paymentId}
                                                            onChange={this.paymentHandleChange}
                                                        >
                                                            {this.state.paymentModes.map((payment) => {
                                                                return (
                                                                    <FormControlLabel key={payment.id}
                                                                                      value={""+ payment.id}
                                                                                      defaultValue={payment.payment_name}
                                                                                      control={<Radio/>}
                                                                                      label={payment.payment_name}/>
                                                                )
                                                            })}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                            }
                                            <div className={classes.actionsContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.handleBack}
                                                        className={classes.button}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.handleNext}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                );
                            })}
                        </Stepper>

                        <div className={this.state.orderPlaced}>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <Typography>View the summary and place your order now!</Typography>
                                    <Button onClick={this.handleReset} className={classes.button}>CHANGE</Button>
                                </Paper>
                            )}
                        </div>
                    </div>

                    <div className="orderSummary">
                        <Card style={{height: '100%'}}>
                            <CardContent>
                                <Typography style={{marginLeft: '40px', fontWeight: 'bold', marginBottom: '30px'}}
                                            gutterBottom variant="h5" component="h2">
                                    Summary
                                </Typography>
                                <Typography style={{marginLeft: '40px', marginBottom: '30px'}}
                                            gutterBottom variant="h5" component="h2">
                                   {restaurant.restaurant_name}
                                </Typography>
                              
                                {cartItems !== undefined && cartItems.map(item => (
                                   
                                    <div className="order-body-container" key={"item" + item.id}>
                                        
                                       
                                        <div className="div-container div-items">{item.type === 'Veg' &&
                                        <FontAwesomeIcon icon="circle" className="veg-item-color"/>}
                                            {item.type === 'Non-Veg' &&
                                            <FontAwesomeIcon className={item.type} icon={["far", "stop-circle"]} />} {item.item_name}
                                           
                                        </div>
                                        
                                        <div className="div-container"> {item.quantity}</div>
                                        <div className="div-container"><FontAwesomeIcon icon="rupee-sign"/> {item.price}
                                        </div>
                                    </div>
                                ))}
                                <Divider/>
                                <div className="body-container">
                                    <span style={{fontWeight: 'bold'}}
                                          className="div-container div-items">Net Amount </span>
                                    <span className="rupee-container"><FontAwesomeIcon
                                        icon="rupee-sign"/> {totalCartValue}</span>
                                </div>
                                <br/>
                                <Button className="button-container" style={{marginLeft: '55px'}} variant="contained"
                                        onClick={this.confirmOrderHandler} color="primary">
                                    Place Order
                                </Button>
                                <Snackbar
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    open={this.state.open}
                                    autoHideDuration={6000}
                                    onClose={this.handleClose}
                                    ContentProps={{
                                        'aria-describedby': 'message-id',
                                    }}
                                    message={<span id="message-id">{this.state.orderNotificationMessage}</span>}
                                    action={[
                                        <IconButton
                                            key="close"
                                            aria-label="Close"
                                            color="inherit"
                                            className={classes.close}
                                            onClick={this.snackBarCloseHandler}
                                        >
                                            <CloseIcon/>
                                        </IconButton>,
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Checkout);