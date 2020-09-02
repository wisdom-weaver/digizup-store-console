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
            <h1>Console Home</h1>
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