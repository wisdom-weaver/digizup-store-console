import React, { useEffect, useState } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import queryString from 'query-string'
import { renderIntoDocument } from 'react-dom/test-utils';

import $ from 'jquery';

import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.carousel.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.theme.green.css'; //Allows for server-side rendering.

import { v1 as uuid } from "uuid";
import Delayed from '../utils/Delayed';

function Product(props) {

    const history = useHistory();
    const {productid} = props.match.params;
    useFirestoreConnect([
        {collection: 'products', doc: productid}
    ])
    const product = useSelector(({firestore:{data}})=> data.products && data.products[productid] )
    
    const toOptionIndexArray = (optionString)=>{
        return optionString?.split('_').slice(1);
    }
    const toOptionString = (array)=>{
        return "option"+array?.reduce((acum, each)=> acum+="_"+each, '');
    }

    return (
        <div className='Product Page'>
            <div className="container">
                <h1>Products Page</h1>                
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {

    }
}

export default 
compose(
    connect(mapStateToProps,mapDispatchToProps),
    withRouter
)(Product)
