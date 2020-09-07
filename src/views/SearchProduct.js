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

function SearchProduct() {
    
    const [productsQuery, setProductsQuery ] = useState({
        collection: 'products',
        doc: 'default'
    })
    useFirestoreConnect([productsQuery]);
    
    const products = useSelector(state=> state.firestore.ordered.products)??[];
    useEffect(()=>{
        console.log('products=>', products)
    },[products]);
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const submitProductSearch = ()=>{
        // if(!productSearchTerm) return;
        var local = productSearchTerm.trim();
        console.log('productSearchTerm => ',productSearchTerm);
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
    const ProductsViewJSX= (productSearchTerm)?(
        (products && products.length>0)?(
            <div className="row">
                    <div className="col s12" key={uuid()}> 
                        {products.map(product=>(
                            <ProductSearchCard key={uuid()} product={product} />
                        ))}    
                    </div>
            </div>
        ):(
            <InfoCard>
                <p className="flow-text center">NoProducts Found</p>
            </InfoCard>
        )
    ):(
        <InfoCard>
            <p className="flow-text center">Please search by product id or tags</p>
        </InfoCard>
    )
    

    return (
        <div className="SearchProduct Page">
            <div className="container">
                <h4 className="head center"> Search <span className="heavy_text">Product</span> </h4>
                <div className="searchbar">
                    {searchBar}
                </div>
                {ProductsViewJSX}
            </div>    
        </div>
    )
}
export default SearchOrder