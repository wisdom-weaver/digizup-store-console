import React, {Fragment, useEffect} from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import {v1 as uuid} from 'uuid'
import { compose } from 'redux';

import 'materialize-css';
import { Divider, Collapsible, CollapsibleItem } from 'react-materialize'
import { useState } from 'react';
import { updateProductInstock } from '../store/actions/productAction';
import { connect } from 'react-redux';

function ProductSearchCard({product, updateProductInstock}) {
    const optionsKeys = Object.keys(product?.productOptions ?? {}).sort() ?? [];
    const optionCategories  = product?.optionCategories ?? [];
    const op_indexes = (option) => option.split('_').slice(1).map(each=>parseInt(each))
    const ProductCardWithOptionsJSX = (product && product.hasOptions==true && optionsKeys)?(
        <div className="col s12" key={uuid()}> 
            <div className="card round-card">
            <div className="card-content">
                <table 
                className="small-table">
                    <tbody>
                      <tr key={uuid()}>
                          <th>{product.id}</th>
                      </tr>
                      <tr>
                          <td>Product Name:  <span className="text-link heavy_text">{product.productName}</span></td>
                          <td className="no-wrap valign-wrapper" >hasOptions:{(product.hasOptions?(<Icon className="primary-green-dark-text" >done_all</Icon>):(<Icon className="primary-red-text" >close</Icon>))}</td>
                      </tr>
                    </tbody>
                </table>
                {optionsKeys.map(optionk=>
                (product.productOptions[optionk].isActive)?(
                <Fragment key={uuid()}>
                <p className="white small-font" >
                    OptionName: 
                        <NavLink to={`/product/${product.id}/?productOption=${optionk}`} > <span className="text-link heavy_text">{product.productOptions[optionk].productFullName}</span></NavLink>
                    
                </p>
                <table className="small-table" >
                <tbody>
                <tr className="white" >
                    <td>Option id: {optionk}</td>
                    <td>
                        {op_indexes(optionk).map((each,index)=>
                        <p className="line-break" key={uuid()}>
                            <span>{optionCategories[index]}: </span><span className="heavy_text">{product.optionCategoriesObject[optionCategories[index]][each].optionName} <br /></span> 
                        </p>
                        )}
                    </td>
                    <td>
                        <p>
                        <label onClick={()=>{
                            updateProductInstock(product.id, product.hasOptions, optionk, !product.productOptions[optionk].inStock )
                        }} >
                            <input name={`${product.id}-${optionk}-inStockRadio`} readOnly={true} type="radio" checked={product.productOptions[optionk].inStock == true} />
                            <span>{(product.productOptions[optionk].inStock)?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>In Stock</span></Fragment>
                                                            ):(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>Out of Stock</span></Fragment>)}
                            </span>
                        </label>
                        </p>
                    </td>
                </tr>
                </tbody>
                </table>
                <p> <Divider /> </p>
                </Fragment>
                ):(null))}
            </div>
            <Divider />
            </div>
        </div>
    ):(null)

    const ProductCardWithoutOptionsJSX = (product && product.hasOptions==false)?(
        <div className="col s12" key={uuid()}> 
        <div className="card round-card">
        <div className="card-content">
        <table className="small-table" >
            <tbody>
                <tr key={uuid()}>
                    <th>{product.id}</th>
                    <td className="no-wrap valign-wrapper" >hasOptions:{(product.hasOptions?(<Icon className="primary-green-dark-text" >done_all</Icon>):(<Icon className="primary-red-text" >close</Icon>))}</td>
                    <td>
                        <label>
                            <input type="radio" name={`${product.id}+-inStockRadio`} id={`${product.id}+-inStockRadio`} readOnly={true} checked={product.inStock == true} />
                            <span 
                            onClick={()=>{ updateProductInstock(product.id, product.hasOptions, null, !product.inStock ) }}>{
                                (product.inStock)
                                ?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>In Stock</span></Fragment>)
                                :(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>Out of Stock</span></Fragment>)
                            }</span>
                        </label>
                    </td>
                </tr>
            </tbody>
            </table>
            <p className="small-font">Product Name: <NavLink to={`/product/${product.id}`} > <span className="text-link">{product.productName}</span></NavLink></p>
            <Divider />
            <Divider />
            <Divider />
        </div>
        </div> 
        </div>
    ):(null)

    return (
        <Fragment>
            {(product)?(
                <Fragment>
                    {(product.hasOptions == true )?(ProductCardWithOptionsJSX):('')}
                    {(product.hasOptions == false)?(ProductCardWithoutOptionsJSX):('')}
                </Fragment>
            ):(null)}
        </Fragment>
    )
}

const mapStateToProps = (state)=>{
    return {}
}
const mapDispatchToProps = (dispatch) =>{
    return {
        updateProductInstock: (productid, hasOptions, option ,inStock)=>{ dispatch( updateProductInstock(productid, hasOptions, option ,inStock) ) }
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(ProductSearchCard)
