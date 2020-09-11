import React, { useEffect, useState, Fragment } from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { withRouter, useHistory, NavLink } from 'react-router-dom'
import { authMessageResetAction } from '../store/actions/authActions';
import Delayed from '../utils/Delayed';
import InfoCard from '../components/InfoCard';

function Home(props) {
    const history = useHistory();

    const HomePageJSX = (
        <Fragment>
            <div className="container">
            <h3 className="center head"><span className="heavy_text">Digizup</span> Store <span className="heavy_text">Console</span></h3>
            <div className="card round-card">
            <div className="card-content">
            <div className="row"> 
                <div className="col s6 center">
                    <p className="flow-text center">Add Product</p>
                    <NavLink to="/addProduct"><div className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div></NavLink> 
                </div>
                <div className="col s6 center">
                    <p className="flow-text center">Add Category</p>
                    <NavLink to="/addCategory"><div className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div></NavLink> 
                </div>
                <div className="col s6 center">
                    <p className="flow-text center">Search Product</p>
                    <NavLink to="/searchProduct"><div className="btn-floating primary-green-dark-bg"><i className="material-icons">search</i></div></NavLink> 
                </div>
                <div className="col s6 center">
                    <p className="flow-text center">Search Order</p>
                    <NavLink to="/searchOrder"><div className="btn-floating primary-green-dark-bg"><i className="material-icons">search</i></div></NavLink> 
                </div>
            </div>
            </div>
            </div>
            </div>
        </Fragment>
    )
        

    return (
        <div className="Home Page">
            {HomePageJSX}
        </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log('state=>',state);
    return {
        
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        authMessageResetAction: ()=>{dispatch(authMessageResetAction())}
    }
}

export default  compose(
    connect(mapStateToProps,null),
    withRouter
)(Home)