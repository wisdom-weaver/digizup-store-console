export default SearchProduct
import React, { useState, Fragment } from 'react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector, connect } from 'react-redux';
import { useEffect } from 'react';
// import 'materilize-css'
import { TextInput, Icon } from 'react-materialize'
import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { v1 as uuid } from 'uuid';
import { NavLink } from 'react-router-dom';
import InfoCard from '../components/InfoCard';
import ProductSearchCard from '../components/ProductSearchCard';

function SearchOrder() {
    
    const [orderQuery, setOrderQuery ] = useState({
        collection: 'ordersForAdmins',
        doc: 'default'
    })
    useFirestoreConnect([productsQuery]);
    
    const orders = useSelector(state=> state.firestore.ordered.products)??[];
    useEffect(()=>{
        console.log('products=>', products)
    },[products]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [log,setLog] = useState('');
    const submitOrderSearch = ()=>{
        console.log('submitOrderSearch');
        setLog('FETCHING')
        // if(!productSearchTerm) return;
        // var local = productSearchTerm.trim();
        // console.log('productSearchTerm => ',productSearchTerm);
        // if(local == 'all'){
            // setProductsQuery({
                // collection: 'products',
            // });
        // }else{
            // setProductsQuery({
                // collection: 'products',
                // doc: local
            // });
        // }
    }
    const searchBar = (
        <div className="searchbar_container">
        <div className="searchInput" >
            <input 
                id="searchInput" 
                type="text"
                value={productSearchTerm}
                onChange={ e=>{ setProductSearchTerm(e.target.value) }}
                onKeyDown={ e=>{ if(e.keyCode==13)
                    submitOrderSearch();
                }}
            />
        <Icon>search</Icon>
      </div>
      </div>
    )
    const ProductsViewJSX= 
        (orders && order.length>0)?(
            <div className="row">
                <div className="col s12" key={uuid()}> 
                    {order.map(order=>(
                        <p>{order.id}</p>
                    ))}    
                </div>
            </div>
        ):(
            <InfoCard>
                <p className="flow-text center">No Orders Found</p>
            </InfoCard>
        )
    

    return (
        <div className="SearchOrder Page">
            <div className="container">
                <h4 className="head center"> Search <span className="heavy_text">Order</span> </h4>
                <div className="searchbar">
                    {searchBar}
                </div>
                {ProductsViewJSX}
            </div>    
        </div>
    )
}

export default SearchOrder
