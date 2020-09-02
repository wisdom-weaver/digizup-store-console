import React, {Fragment, useEffect} from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import {v1 as uuid} from 'uuid'
import { compose } from 'redux';

import 'materialize-css';
import { Divider, Collapsible, CollapsibleItem } from 'react-materialize'
import { useState } from 'react';

function ProductSearchCard({product}) {
    const optionsKeys = Object.keys(product).filter(each=>each.startsWith('option_')).sort() ?? [];
    const optionCategories  = product?.optionCategories ?? [];
    const op_indexes = (option) => option.split('_').slice(1).map(each=>parseInt(each))
    const [dropdownStateOpen, setDropDownStateOpen ] = useState(false);
    const ProductCardWithOptionsJSX = (product && product.hasOptions==true && optionsKeys)?(
        <div className="col s12" key={uuid()}> 
            <div className="card round-card">
            <Collapsible
                style={{
                    'border': 'none',
                    "box-shadow": 'none',
                }}
                accordion={false}>
               <CollapsibleItem
                  expanded={false}
                //   onClick={()=>{setDropDownStateOpen(!dropdownStateOpen)}}
                  header={
                      <Fragment>
                      <table 
                        // onClick={()=>{setDropDownStateOpen(true)}} 
                        className="white">
                          <tbody>
                            <tr key={uuid()}>
                                <th>{product.id}</th>
                            </tr>
                            <tr>
                                <td>Product Name: <NavLink to={`/product/${product.id}`} > <span className="text-link heavy_text">{product.productName}</span></NavLink></td>
                                <td className="no-wrap valign-wrapper" >hasOptions:{(product.hasOptions?(<Icon className="primary-green-dark-text" >done_all</Icon>):(<Icon className="primary-red-text" >close</Icon>))}</td>                    
                                <td>{ <div className="btn dark_btn">{(dropdownStateOpen)?('Hide'):('Show')} Options</div> }</td>
                            </tr>
                          </tbody>
                      </table>
                      <Divider />
                      <Divider />
                      <Divider />
                      </Fragment>
                  }
                //   icon={<Icon>filter_drama</Icon>}
                  node="div"
                >
                <table>
                <tbody>
                        {optionsKeys.map(optionk=>(
                        <Fragment key={uuid()}>
                        <tr>
                            <td>OptionName: 
                                <NavLink to={`/product/${product.id}/?productOption=${optionk}`} > <span className="text-link heavy_text">{product[optionk].productFullName}</span></NavLink>
                            </td>
                        </tr>
                        <tr>
                            <td>Option id: {optionk}</td>
                            <td>
                                {op_indexes(optionk).map((each,index)=>
                                <p className="line-break" key={uuid()}>
                                    <span>{optionCategories[index]}: </span><span className="heavy_text">{product[optionCategories[index]][each].optionName} <br /></span> 
                                </p>
                                )}
                            </td>
                            <td>
                                <p>
                                <label>
                                    <input name={`${product.id}-${optionk}-inStockRadio`} readOnly={true} type="radio" checked={product[optionk].inStock == true} />
                                    <span>{(product[optionk].inStock)?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>In Stock</span></Fragment>
                                                                    ):(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>Out of Stock</span></Fragment>)}
                                    </span>
                                </label>
                                </p>
                            </td>
                        <tr><Divider /></tr>
                        </tr>
                        </Fragment>
                        ))}
                </tbody>
                </table>
                </CollapsibleItem>
            </Collapsible>
            <Divider />
            <Divider />
            <Divider />
            </div>
        </div>
    ):(null)

    const ProductCardWithoutOptionsJSX = (product && product.hasOptions==false)?(
        <div className="col s12" key={uuid()}> 
        <div className="card round-card">
        <div className="card-content">
            <table>
            <tbody>
                <tr key={uuid()}>
                    <th>{product.id}</th>
                    <td className="no-wrap valign-wrapper" >hasOptions:{(product.hasOptions?(<Icon className="primary-green-dark-text" >done_all</Icon>):(<Icon className="primary-red-text" >close</Icon>))}</td>
                    <td>
                        <label>
                            <input type="radio" name={`${product.id}+-inStockRadio`} id={`${product.id}+-inStockRadio`} readOnly={true} checked={product.inStock == true} />
                            <span>{(product.inStock)?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>In Stock</span></Fragment>
                                                   ):(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>Out of Stock</span></Fragment>)}
                            </span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Product Name: <NavLink to={`/product/${product.id}`} > <span className="text-link">{product.productName}</span></NavLink></td>
                </tr>
            </tbody>
            </table>
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

export default compose(
    withRouter
)(ProductSearchCard)
