import React, { Fragment, useEffect } from 'react'
import InfoCard from '../components/InfoCard'
import { NavLink, withRouter } from 'react-router-dom'
import { Icon } from '@material-ui/core'
import { useState } from 'react'
import { compose } from 'redux'
import $ from 'jquery';
import 'materialize-css';
import { TextInput, Chip, Divider, Collapsible, CollapsibleItem } from 'react-materialize'
import {v1 as uuid } from 'uuid';
import { setProductAction, productUpdateReset,updateProductPrice } from '../store/actions/productAction'
import { connect, useSelector } from 'react-redux'
import { reactReduxFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase'

function EditProduct(props) {

    const {productid} = props.match.params;
    const {updateProductPriceFn} = props;
    // console.log(productid);
    useFirestoreConnect({
        collection: 'products',
        doc: productid,
        storeAs: `editproduct=${productid}`
    })
    const editProductCol = useSelector(state=>state.firestore.ordered[`editproduct=${productid}`]);
    const [loadingLog, setLoadingLog] = useState('');

    const [product,setProduct] = useState({});
    useEffect(()=>{
        // console.log(editProductCol);
        if(!isLoaded(editProductCol)) return setLoadingLog('LOADING');
        if(!editProductCol || editProductCol.length ==0) return setLoadingLog('NOT_FOUND');
        setProduct(editProductCol[0])     
        return setLoadingLog("LOADED");
    },[editProductCol])

    const priceAdjustmentJSX = (product)?(
        <Fragment>
            <h5 className="center">Adjust Price</h5>
            {(product.hasOptions == true)?(
                <div className="row">
                {Object.keys(product.productOptions).filter(optionk=>product.productOptions[optionk].isActive).sort().map((optionk)=>(
                <Fragment key={uuid()}>
                    <div className="col s3">
                        <p className="head center-align">
                            {optionk} <br/>
                            {product.productOptions[optionk].productFullName}
                        </p>
                    </div>
                    <div className="col s6">
                        <input 
                            id={`${optionk}-Price`}
                            type="text"
                            placeholder={product.productOptions[optionk].price}
                        />
                    </div>
                    <div className="col s3">
                        <div 
                        onClick={()=>{
                            var price = $(`input#${optionk}-Price`).val();
                            $(`input#${optionk}-Price`).val('')
                            updateProductPriceFn({
                                hasOptions: product.hasOptions,
                                productid: productid,
                                productOption: optionk,
                                price: price
                            })
                        }}
                        className="btn dark_btn">
                            Update
                        </div>
                    </div>
                    <div className="col s12">
                        <hr/>
                    </div>
                </Fragment>
                ))}
                </div>
            ):(
                <div className="row">
                    <div className="col s3">
                        <p className="head center-align">
                            {product.productName}
                        </p>
                    </div>
                    <div className="col s6">
                        <input 
                            id={`Price`}
                            type="text"
                            placeholder={product.price}
                        />
                    </div>
                    <div className="col s3">
                        <div 
                        onClick={()=>{
                            var price = $(`input#Price`).val();
                            $(`input#Price`).val('')
                            updateProductPriceFn({
                                hasOptions: product.hasOptions,
                                productid: productid,
                                productOption: false,
                                price: price
                            })
                        }}
                        className="btn dark_btn">
                            Update
                        </div>
                    </div>
                    <div className="col s12">
                        <hr/>
                    </div>
                </div>
            )}
        </Fragment>
    ):(null)

    return (
        <div className="EditProduct Page" >
            <div className="container">
                <h4 className="center head">Edit <span className=" heavy_text">Product</span></h4>
                <p className="small-text center">{productid}</p>
                {(loadingLog == "LOADING")?(
                    <InfoCard> <h5 className="center">Loading...</h5> </InfoCard>
                ):(null)}
                {(loadingLog == "NOT_FOUND")?(
                    <InfoCard> <h5 className="center">Not Found</h5> </InfoCard>
                ):(null)}
                {(loadingLog == "LOADED")?(
                    <Fragment>
                        {priceAdjustmentJSX}
                    </Fragment>
                ):(null)}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        productMessage  : state.productUpdates.productMessage,
        productError    : state.productUpdates.productError,
        productLog      : state.productUpdates.productLog,
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setProductAction: (product)=>{dispatch(setProductAction(product))},
        productUpdateReset: ()=>{ dispatch(productUpdateReset()) },
        updateProductPriceFn: (update)=>{ dispatch(updateProductPrice(update)) }
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(EditProduct)
