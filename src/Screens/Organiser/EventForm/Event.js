import React, { Component } from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography, MenuIcon } from '@material-ui/core';
import '../../../App.css';
import firebase from 'firebase';
import swal from 'sweetalert2';
import { light } from '@material-ui/core/styles/createPalette';


class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            details: '',
            photo: '',
            location: '',
            address: '',
            startTime: '',
            endTime: '',
            sittingDetails: '',
            seats: '',
            selected: '',
            price: ''
        }

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleFileUpload() {
        let that = this;
        var preview = document.querySelector('img'); //selects the query named img
        var file = document.querySelector('input[type=file]').files[0]; //sames as here
        var reader = new FileReader();

        reader.onloadend = function () {
            let pic = { "url": "", val: "0" };
            pic.url = reader.result;
            console.log('pic.url', pic.url)
            // this.picArray.push(pic);
            that.setState({ photo: pic.url });
        };

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            preview.src = "";
        }
    }

    submit() {
        const { name, details, photo, location, address, startTime, endTime, sittingDetails, seats, selected, price } = this.state;
        const db = firebase.database();
        const userUID = localStorage.getItem('UserUID');
        console.log(userUID)
        if (name && details && photo && location && address && startTime && endTime && sittingDetails && seats && selected === "Paid" && price) {
            const eventObj = {
                name, details, photo, location, address, startTime, endTime, sittingDetails, seats, selected, price, userUID
            }
            swal.showLoading();
            console.log('eventObj', eventObj);
            db.ref('Events/').push(eventObj)
                .then(() => {
                    swal({
                        title: "success",
                        text: "Event Added",
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    setTimeout(() => {
                        this.props.history.push('/home')
                    }, 1500)
                })
                .catch((error) => {
                    swal({
                        title: "error",
                        text: error.message,
                        type: 'error'
                    })
                })
        }
        else if (name && details && photo && location && address && startTime && endTime && sittingDetails && seats && selected === "Free") {
            const eventObj = {
                name, details, photo, location, address, startTime, endTime, sittingDetails, seats, selected, userUID
            }
            console.log('eventObj', eventObj);
            swal.showLoading();
            db.ref('Events/').push(eventObj)
                .then(() => {
                    swal({
                        title: "success",
                        text: "Event Added",
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    setTimeout(() => {
                        this.props.history.push('/home')
                    }, 1500)
                })
                .catch((error) => {
                    swal({
                        title: "error",
                        text: error.message,
                        type: 'error'
                    })
                })
        }
        else {
            swal({
                title: "error",
                text: 'Something Went Wrong',
                type: 'error'
            })
        }
    }

    render() {
        const { name, details, location, address, startTime, endTime, sittingDetails, seats, selected, price } = this.state;
        return (
            <div>
                <AppBar position="static" className="HomeBar" style={{ backgroundColor: "rgb(34, 157, 179)", height: '80px', textAlign: 'center' }}>
                    <h1>Event form</h1>
                </AppBar>
                <div className="Authentication" style={{ textAlign: "center" }}>
                    <br />
                    <label>Event Name</label>
                    <br />
                    <input type="text" value={name} onChange={e => { this.setState({ name: e.target.value }) }} />
                    <br />
                    <label>Event Details</label>
                    <br />
                    <textarea value={details} onChange={e => { this.setState({ details: e.target.value }) }} />
                    <br />
                    <input type="file" style={{ paddingLeft: '0px', height: '27px' }} onChange={this.handleFileUpload} />
                    <br />
                    {/* <img src={this.state.photo} />
                    <br /> */}
                    <label>Location</label>
                    <br />
                    <input type="text" value={location} onChange={e => { this.setState({ location: e.target.value }) }} />
                    <br />
                    <label>Address</label>
                    <br />
                    <input type="text" value={address} onChange={e => { this.setState({ address: e.target.value }) }} />
                    <br />
                    <label>Start Time</label>
                    <br />
                    <input type="text" value={startTime} onChange={e => { this.setState({ startTime: e.target.value }) }} />
                    <br />
                    <label>End Time</label>
                    <br />
                    <input type="text" value={endTime} onChange={e => { this.setState({ endTime: e.target.value }) }} />
                    <br />
                    <label>Sitting Arrangement Details</label>
                    <br />
                    <textarea type="text" value={sittingDetails} onChange={e => { this.setState({ sittingDetails: e.target.value }) }} />
                    <br />
                    <label>Number Of Seats</label>
                    <br />
                    <input type="number" value={seats} onChange={e => { this.setState({ seats: e.target.value }) }} />
                    <br />
                    <label className="Radio">
                        <input type="radio" name="panel" value="Free" checked={selected === 'Free'} onChange={(e) => this.setState({ selected: e.target.value })} />
                        Free
                    </label>
                    <label className="Radio">
                        <input type="radio" name="panel" value="Paid" checked={selected === 'Paid'} onChange={(e) => this.setState({ selected: e.target.value })} />
                        Paid
                    </label>
                    {selected === "Paid" &&
                        <span>
                            <br />
                            <label>Price Per Seat</label>
                            <br />
                            <input type="number" value={price} onChange={e => { this.setState({ price: e.target.value }) }} />
                        </span>
                    }
                    <br />
                    <Button style={{ color: 'rgb(34, 157, 179)' }} onClick={this.submit} >Submit</Button>
                    <br />
                    <Button style={{ marginBottom: '20px' }} color={"secondary"} onClick={() => { this.props.history.push('/home') }}>Cancle</Button>
                </div>
            </div>
        )
    }
}

export default Event;