import React, { useState, Fragment } from 'react';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector, connect } from 'react-redux';
import { useEffect } from 'react';
// import 'materilize-css'
import { TextInput, Icon } from 'react-materialize'
import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { v1 as uuid } from 'uuid';
import { NavLink } from 'react-router-dom';
import InfoCard from '../components/InfoCard';
import ProductSearchCard from '../components/ProductSearchCard';

function SearchProduct() {
    const initQuery = {
        collection: 'products',
        doc: 'default'
    }
    const [productsQuery, setProductsQuery ] = useState(initQuery);
    useFirestoreConnect([productsQuery]);
    
    const products = useSelector(state=> state.firestore.ordered.products)??[];
    const [productsLog, setProductsLog] = useState('');
    useEffect(()=>{
        if(JSON.stringify(initQuery) === JSON.stringify(productsQuery)){ console.log('init query');return setProductsLog(''); }
        // console.log('passed',initQuery == productsQuery, initQuery, productsQuery);
        if(!isLoaded(products)) return setProductsLog('LOADING_PRODUCTS');
        if(!products || products.length == 0) return setProductsLog('NOT_FOUND_PRODUCTS')
        return setProductsLog('LOADED_PRODUCTS')
    },[products]);
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const submitProductSearch = ()=>{
        setProductsLog('LOADING_PRODUCTS');
        var local = productSearchTerm.trim();
        // console.log('productSearchTerm => ',productSearchTerm);
        if(local == 'all'){
            setProductsQuery({
                collection: 'products',
            });
        }else{
            setProductsQuery({
                collection: 'products',
                doc: local
            });
        }

    }
    const searchBar = (
        <div className="searchbar_container">
        <div className="searchInput" >
        <input 
          id="searchInput" 
          type="text"
          value={productSearchTerm}
          onChange={ e=>setProductSearchTerm(e.target.value) }
          onKeyDown={ e=>{ if(e.keyCode==13)submitProductSearch();} }
        />
        <Icon>search</Icon>
      </div>
      </div>
    )
    const ProductsViewJSX= (products && products.length>0)?(
        <div className="row">
                <div className="col s12" key={uuid()}> 
                    {products.map(product=>(
                        <ProductSearchCard key={uuid()} product={product} />
                    ))}    
                </div>
        </div>
    ):(null)
    

    return (
        <div className="SearchProduct Page">
            <div className="container">
                <h4 className="head center"> Search <span className="heavy_text">Product</span> </h4>
                <div className="searchbar">
                    {searchBar}
                </div>
                {(productsLog == '')?(<InfoCard><p className="flow-text center">Please search by product id </p></InfoCard>):(null)}
                {(productsLog == 'LOADING_PRODUCTS')?(<InfoCard><p className="flow-text center">Searching....</p></InfoCard>):(null)}
                {(productsLog == 'NOT_FOUND_PRODUCTS')?(<InfoCard><p className="flow-text center">NoProducts Found</p></InfoCard>):(null)}
                {(productsLog == 'LOADED_PRODUCTS')?(ProductsViewJSX):(null)}
                
            </div>    
        </div>
    )
}

export default SearchProduct
