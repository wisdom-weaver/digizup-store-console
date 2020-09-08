import React, { useEffect, Fragment } from 'react'
import { compose } from 'redux'
import { withRouter, NavLink } from 'react-router-dom'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { useSelector, connect } from 'react-redux';
import InfoCard from '../components/InfoCard';
import { useState } from 'react';
import { v1 as uuid } from 'uuid';
import { priceFormat } from '../utils/utils';
import 'materialize-css';
import {Select,  Icon, TextInput} from 'react-materialize'
import moment from 'moment';
import { updateOrderAction } from '../store/actions/orderActions';

function Order(props){
    // console.log(props);
    const {updateOrderAction} = props
    const oaid = props.match.params.oaid;
    console.log(oaid)
    useFirestoreConnect({
        collection: 'ordersForAdmins',
        doc : oaid,
        storeAs: `oa=${oaid}`
    })
    const oaCollection = useSelector(state=> state.firestore.ordered[`oa=${oaid}`]);
    const [order, setOrder] = useState();
    const [log, setLog ] = useState('');
    useEffect(()=>{
        if(!isLoaded(oaCollection)){ setLog('LOADING'); return;}
        if(!oaCollection || oaCollection.length == 0){ setLog('NOT_FOUND'); return;}
        setOrder(oaCollection[0]);
    },[oaCollection])
    
    const statusOptions = ['Order Placed', 'Preparing For Dispatch', 'Dispatched', 'In Transit', 'On the Way', 'Out for Delivery', 'Delivered', 'Delayed', 'Cancellation Requested', 'Cancelled']
    const [localStatus, setLocalStatus] = useState(order?.status);
    const [localTrack, setLocalTrack] = useState('');
    
    useEffect(()=>{
        console.log('localStatus =>',localStatus);
    },[localStatus])

    const updateStatus = ()=>{
        console.log('localStatus =>',localStatus);
        updateOrder({
            docid: oaid, 
            data:{
                    status: localStatus,
                    tracking: [
                        {title: localStatus, updateTime: new Date()},
                        ...order?.tracking
                    ],
                    updatedAt: new Date()
            }    
        });
    }

    const addTrack = ()=>{
        console.log('addTrack => ', addTrack);
        updateOrder({
            docid: oaid, 
            data:{
                    tracking: [
                        {title: localTrack, updateTime: new Date()},
                        ...order?.tracking
                    ],
                    updatedAt: new Date()
            }    
        })
    }

    const closeOrder = ()=>{
        updateOrder({
            docid: oaid,
            data:{
                isOpen: false,
                updatedAt: new Date()
            }
        })
    }

    const updateOrder = (update)=>{
        updateOrderAction(update);
    }

    const cartJSX = (order && order.cart)?(
        <div className="cart">
                <div className="card round-card">
                <div className="card-content overflowable">
                <table>
                <tr><td>Product</td><td>Price</td><td>CartQty</td><td>SubTotal</td></tr>
                {order.cart.map(each=>(
                <tr key={uuid()}><td>{each.productName}</td><td>{each.productPrice}</td><td>{each.cartQty}</td><td>{each.productPrice*each.cartQty}</td></tr>
                ))}
                <tr><td></td><td></td><th>Total</th><th className="no-wrap">{priceFormat(order.cart.reduce((ac,each)=>(ac+each.productPrice*each.cartQty),0))}</th></tr>
                </table>
                </div>
                </div>
            </div>
    ):(null)
    
    const accountJSX = (order)?(
        <div className="account">
                <div className="card round-card">
                <div className="card-content overflowable">
                <h6 className="center head heavy_text">Account</h6>
                <table>
                <tbody>
                <tr><td className="small-text">Consumer id</td><th className="small-text">{order.consumeruid}</th></tr>
                <tr><td className="small-text">Order id</td><th className="small-text">{order.orderid}</th></tr>
                <tr><td className="small-text">oa id</td><th className="small-text">{order.id}</th></tr>
                </tbody>
                </table>
                </div>
                </div>
            </div>
    ):(null)

    const addressJSX = (order && order.address)?(
        <div className="address">
            <div className="card round-card">
            <div className="card-content overflowable">
            <h6 className="center head heavy_text">Address</h6>
            <table>
            <tbody>
            <tr><td>Full Name</td><th>{order.address.fullName}</th></tr>
            <tr><td>Address Line</td><th>{order.address.addressLine}</th></tr>
            <tr><td>City</td><th>{order.address.city}</th></tr>
            <tr><td>State</td><th>{order.address.state}</th></tr>
            <tr><td>Country</td><th>{order.address.country}</th></tr>
            <tr><td>Pincode</td><th>{order.address.pincode}</th></tr>
            <tr><td>Phone No</td><th>{order.address.phoneNo}</th></tr>
            <tr><td>Payment Type</td><th>{order.paymentType}</th></tr>
            </tbody>
            </table>
            </div>
            </div>
        </div>
    ):(null)
    const statusJSX = (order)?(
        <div className="status">
            <div className="card round-card overflow-visble">
            <div className="card-content overflow-visble">
            <h6 className="center head heavy_text">Status</h6>
                <div className="row">
                {(order.isOpen)?(
                <div className="col s12 center row">
                    <div className="col s6 center"><h6 className="head heavy_text"><Icon>done_all</Icon>Order is OPEN</h6></div>
                    <div className="col s6 center"><div onClick={()=>{ closeOrder(); }} className="btn red_btn">Close Order</div></div>
                </div>
                ):(
                <div className="col s12 center"><h6 className="primary-red-text heavy_text"><Icon>clear</Icon> Order is Closed </h6></div>
                )}
                <div className="s12"></div>
                <div className="col s12 center">
                    Current Status: <span className="heavy_text">{order.status}</span>
                </div>
                {(order.isOpen)?(
                <Fragment>
                <div className="col s12 l8 center">
                <Select
                  id="statusSelection"
                  multiple={false}
                  onChange={(e)=>{ setLocalStatus(e.target.value); }}
                  s={12}
                  options={{
                    classes: '',
                    dropdownOptions: {
                      alignment: 'left',
                      autoTrigger: true,
                      closeOnClick: true,
                      constrainWidth: true,
                      coverTrigger: true,
                      hover: false,
                      inDuration: 150,
                      onCloseEnd: null,
                      onCloseStart: null,
                      onOpenEnd: null,
                      onOpenStart: null,
                      outDuration: 250
                    }
                  }}
                  value={order.status}
                >
                  <option className="small-text" disabled value="">Update Status</option>
                  {statusOptions.map(eaStatus=>(
                  <option className="small-text" value={eaStatus}>{eaStatus}</option>
                  ))}
                </Select>
                </div>
                <div className="col s12 l4">
                    <div 
                    onClick={()=>{ updateStatus(); }}
                    className="btn dark_btn">
                        Update Status
                    </div>
                </div>
                </Fragment>
                ):(null)}
                </div>
            </div>
            </div>
        </div>
    ):(null)

    const trackingJSX  = (order && order.tracking)?(
        <div className="tracking">
            <div className="card round-card overflow-visble">
            <div className="card-content overflow-visble">
            <h6 className="center head heavy_text">Tracking</h6>
            <div className="row">
            <div className="col s12">
            <table>
            <tbody>
            {order.tracking.map(track=>(
            <tr><td>{track.title}</td><td>{moment(track.updateTime.toDate()).format('MMM Do YY, h:mm a')}</td></tr>
            ))}
            </tbody>
            </table>
            </div>
            {(order.isOpen == true)?(<div className="col s12">
                <div className="valign-wrapper">
                <TextInput
                    id={uuid()}
                    s={8}
                    label='Add Tracking =>'
                    onChange={(e)=>{
                       setLocalTrack(e.target.value);
                    }}
                    onKeyDown={(e)=>{if(e.keyCode == 13){
                        addTrack();
                        setLocalTrack('');
                    }}}
                    value={localTrack}
                />
                <div className="col s2">
                    <div 
                    onClick = {()=>{ 
                        addTrack();
                        setLocalTrack('');
                    }}
                    className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
                </div>
                </div>
            </div>):(null)}

            </div>
            </div>
            </div>
        </div>
    ):(null)

    const OrderViewJSX = (order)?(
        <div className="order-view">
            {/* <p className="line-break small-text">{JSON.stringify(order,null,4)}</p> */}
            {accountJSX}
            {statusJSX}
            {addressJSX}
            {trackingJSX}
            {cartJSX}
        </div>
    ):(
        <Fragment>
            {(log == 'LOADING')?( <InfoCard><h5 className="center">Loading...</h5></InfoCard> ):(null)}
            {(log == 'NOT_FOUND')?( <InfoCard><h5 className="center">
                Order not found<br />
                Please <NavLink to="/searchOrder"><span className="head">Search Order</span></NavLink>
            </h5></InfoCard> ):(null)}
        </Fragment>
    )

    return (
        <div className="Order Page" >
            <div className="container">
            {OrderViewJSX}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {}
};

const mapDispatchToProps = (dispatch)=>{
    return {
        updateOrderAction:  (update)=>{ dispatch(updateOrderAction(update)) }
    }
};

export default 
compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Order)