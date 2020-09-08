import React, { useState, useEffect, Fragment } from 'react'
import 'materialize-css';
import { Dropdown, TextInput, Icon, Collapsible,CollapsibleItem } from 'react-materialize'
import { v1 as uuid } from 'uuid';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { NavLink, useHistory, withRouter } from 'react-router-dom';
import moment from 'moment';
import { compose } from 'redux';
import queryString from 'query-string';
import InfoCard from '../components/InfoCard';
import _ from 'lodash'
function SearchOrder() {
    const history = useHistory();
    var queryPar = queryString.parse(history.location.search);
    var soCat = queryPar?.searchOrderCategory ?? 'oa-id';
    var soTerm= queryPar?.searchOrderTerm ?? '' ;
    
    
    const [searchOrderCategory, setSearchOrderCategory] = useState(soCat);
    const [searchOrderTerm, setSearchOrderTerm] = useState(soTerm);
    const searchCategories = ['order-id','user-id','oa-id'];
    const [log, setLog]  = useState('');

    const getQuery = (searchOrderTerm, searchOrderCategory)=>{
        if(searchOrderTerm =='') return {doc: 'default'};
        if(searchOrderTerm == 'all')return {};
        else if(searchOrderCategory == 'order-id')return {where: ['orderid', '==', searchOrderTerm]};
        else if(searchOrderCategory == 'consumer-id')return {where: ['consumeruid', '==', searchOrderTerm]};
        else if(searchOrderCategory == 'oa-id') return {doc: searchOrderTerm};
    }

    const [query, setQuery] = useState(getQuery(soTerm, soCat));
    useFirestoreConnect({collection: 'ordersForAdmins', ...query, storeAs: 'ordersForAdmins'});
    const ordersForAdmins = useSelector(state=> state.firestore.ordered.ordersForAdmins);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        if(!isLoaded(ordersForAdmins)) return;
        if((!ordersForAdmins || ordersForAdmins.length == 0)&&searchOrderTerm!=''){setLog('NOT_FOUND'); setOrders([]); return;}
        setOrders(_.orderBy(ordersForAdmins,['createdAt'],['desc']));
        setLog('FETCHED');
    },[ordersForAdmins])

    const orderSearchFn = (searchOrderTerm, searchOrderCategory)=>{
        // console.log('orderSearchFn');
        setOrders([]);
        setLog('SEARCHING');
        setQuery(getQuery(searchOrderTerm,searchOrderCategory));
    }
    

    useEffect(()=>{
        return history.listen(async ()=>{
            console.log('history effect');
            queryPar = queryString.parse(history.location.search);
            soTerm= queryPar?.searchOrderTerm ?? '' ;
            if(soTerm == '') return;
            soCat = queryPar?.searchOrderCategory ?? 'oa-id';
            setSearchOrderCategory(soCat);
            setSearchOrderTerm(soTerm);
            orderSearchFn(soTerm, soCat);
            return;
        })
    },[history])
    
    useEffect(()=>{
        console.log('orders',orders);
    },[orders])

    const updateHistoryLink = ()=>{
        history.push(`/searchOrder?searchOrderTerm=${searchOrderTerm.split(' ').join('')}&searchOrderCategory=${searchOrderCategory}`);
    }
    const resetHistoryLink = ()=>{
        history.push(`/searchOrder`);
    }

    const seachDropdown = (
        <Dropdown
        id="orderSearchDropdown"
        options={{
          alignment: 'left',
          autoTrigger: true,
          closeOnClick: true,
          constrainWidth: false,
          container: null,
          coverTrigger: true,
          hover: false,
          inDuration: 150,
          onCloseEnd: null,
          onCloseStart: null,
          onOpenEnd: null,
          onOpenStart: null,
          outDuration: 250
        }}
        trigger={
          <div className='btn categories_dropdown_trigger' >{searchOrderCategory.slice(0,15)+((searchOrderCategory.length>15)?"..":'')+" \u25BC"}</div>
        }
      >
        {searchCategories?.map( eachcategory=> ( <a key={uuid()} onClick={()=>{setSearchOrderCategory(eachcategory)}}>{eachcategory}</a> ) )}
      </Dropdown>
    )

    const searchBar = (
        <div className="searchbar_container">
        <div className="searchInput" >
        {seachDropdown}
        <input 
            id="searchInput" 
            type="text"
            value={searchOrderTerm}
            onChange={(e)=>{ setSearchOrderTerm(e.target.value); }}
            onKeyDown={(e)=>{if(e.keyCode == 13){
                updateHistoryLink();
                // orderSearchFn(searchOrderTerm, searchOrderCategory);
            }}}
        />
        <div className="head cursor-pointer" onClick={()=>{ updateHistoryLink();  }}>
            <Icon>search</Icon>
        </div>
      </div>
      </div>
    )
    
    const utilityButtonsArea = (
        <div className="utilityButtonsArea center">
            <div className="row">
                <div onClick={()=>{ resetHistoryLink(); setLog('SEARCHING'); setOrders([]); setQuery({}) }} className="col s6 l4"><div className="btn light_btn">Get All Orders</div></div>
                <div onClick={()=>{ resetHistoryLink(); setLog('SEARCHING'); setOrders([]); setQuery({where:['isOpen','==',true]}) }} className="col s6 l4"><div className="btn dark_btn">Get Open Orders</div></div>
                <div onClick={()=>{ resetHistoryLink(); setLog('SEARCHING'); setOrders([]); setQuery({where:['isOpen','==', false]}) }} className="col s6 l4"><div className="btn red_btn">Get Closed Orders</div></div>
            </div>
        </div>
    );

    const OrderViewJSX = (orders && orders.length>0)?(
        <div className="orders-view">
        <Collapsible accordion={false}>
            {orders.map((order,index)=>(
                <CollapsibleItem
                    key={uuid()}
                    expanded={false}
                    header={
                    <p className="small-text">
                        oa-id: <span className="regular_text small-text head">{order.id}</span>
                    </p>}
                    // icon={<Icon>filter_drama</Icon>}
                    node="div"
                >
                    <div className="row">
                        <div className="col s6 l3 center">
                            <h6>
                            {(order.isOpen)
                            ?( <span className="head"> <Icon>done_all</Icon> Order is Open </span> )
                            :( <span className="primary-red-text"> <Icon>clear</Icon> Order is Closed </span> )}
                            </h6>
                        </div>
                        <div className="col s6 l3 center">
                            <NavLink to={`/order/`+order.id}>
                                <div className="btn dark_btn">ManageOrder</div>
                            </NavLink>
                        </div>
                        <div className="col s6 l3 center">
                            <p className="left-align">{moment(order.createdAt.toDate()).format('MMM Do YY, h:mm a')}</p>
                        </div>
                        <div className="s12 m0"></div>
                        <div className="col s6 l3 center">
                            <p className="center">order status: <span className="heavy_text">{order.status}</span></p>
                        </div>
                        
                    </div>
                </CollapsibleItem>
            ))}
        </Collapsible>
        </div>
    ):( 
        <Fragment>
            {(log == '')?(<InfoCard><h5 className="center">Search using oa-id user-id or order-id </h5></InfoCard>):(null)}
            {(log=='SEARCHING')?(<InfoCard><h5 className="center">Searching ....</h5></InfoCard>):(null)}
            {(log=='NOT_FOUND')?(<InfoCard><h5 className="center">No Orders Found</h5></InfoCard>):(null)}
        </Fragment>
    )

    return (
        <div className="Search Order Page">
            <div className="container">
                <h4 className="head center"> Search <span className="heavy_text">Order</span> </h4>
                <div className="searchbar">
                    {searchBar}
                    <h6 className="center heavy_text">OR</h6>
                    {utilityButtonsArea}
                </div>

                {OrderViewJSX}
            </div>    
        </div>
    )
}

export default compose(
    withRouter
)(SearchOrder)
