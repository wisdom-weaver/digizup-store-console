import React, { useEffect, useState, Fragment } from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { withRouter, useHistory, NavLink } from 'react-router-dom'
import { authMessageResetAction } from '../store/actions/authActions';
import Delayed from '../utils/Delayed';

function Home(props) {
    const history = useHistory();
    const profile = useSelector(state=> state.firebase.profile);
    useEffect(()=>{
        if(!profile) return;
        if(profile.isLoaded && !profile.isAdmin){ 
            setTimeout(()=>{
                history.push('/login');
            },10000)
        }
    },[profile])

    const HomePageJSX = (profile.isLoaded && !profile.isAdmin)?(
        <Fragment>
            <h1>Console Home</h1>
        </Fragment>
    ):(null)

    return (
        <div className="Home Page">
            <Delayed waitBeforeShow={2000}>
                {(profile?.isAdmin)?(
                    <Fragment>
                        {HomePageJSX}
                    </Fragment>
                ):(
                    <div className="row">
                    <div className="col s12 m8 l6 offset-m2 offset-l3">
                    <div className="card round-card">
                    <div className="card-content">
                    <h4 className="center primary-green-dark-text"> <span>Sign</span><span className="heavy_text">Up</span></h4>
                    <p className="flow-text center">
                        Please <NavLink to="/signin" ><span className="heavy_text text-link">SignIn</span></NavLink> to continue.
                    </p>
                    </div>
                    </div>
                    </div>
                </div>
                )}
            </Delayed>
        </div>
    )
}

const mapStateToProps = (state)=>{
    console.log('state=>',state);
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