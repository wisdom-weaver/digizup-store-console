import React, { Fragment } from 'react';
import { BrowserRouter, Switch, Route, withRouter, NavLink } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';
import Store from './views/Store';
import Navbar from './components/Navbar';
import Login from './views/Login';
import Signup from './views/Signup';
import Product from './views/Product';
import Home from './views/Home';
import { initAction } from './store/actions/authActions';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import AddProduct from './views/AddProduct';
import Delayed from './utils/Delayed';
import InfoCard from './components/InfoCard';
import SearchProduct from './views/SearchProduct';
import SearchOrder from './views/SearchOrder';
import Order from './views/Order';


function App(props) {
  const {initAction} = props;
  // initAction();
  const authuid = useSelector((state)=>state.firebase.auth.uid)??null;
  const profile = useSelector(state=> state.firebase.profile)??{};
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop >
          <Navbar />
          <Switch>

            <Route exact path="/login"> <Login /> </Route>
            <Route exact path="/signup"> <Signup /> </Route>
            
            <Delayed waitBeforeShow={2000}>
              <Fragment>
                {(authuid && profile.isAdmin)?(
                  <Fragment>
                      <Route exact path="/product/:productid"> <Product /> </Route>
                      <Route exact path="/addProduct" > <AddProduct /> </Route> 
                      <Route exact path="/searchProduct" > <SearchProduct />  </Route> 
                      <Route exact path="/searchOrder" > <SearchOrder /> </Route> 
                      <Route exact path="/order/:oaid" > <Order /> </Route> 
                      <Route exact path="/"> <Home /> </Route>
                    </Fragment>
                  ):(
                    <div className="Page">
                      <InfoCard>
                        <h4 className="center primary-green-dark-text"> <span>Sign</span><span className="heavy_text">Up</span></h4>
                        <p className="flow-text center">
                          Please <NavLink to="/login" ><span className="heavy_text text-link">SignIn</span></NavLink> to continue.
                        </p>
                      </InfoCard>
                    </div>
                )}            
              </Fragment>
            </Delayed>

          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state)=>{
  return {}
}
const mapDispatchToProps = (dispatch)=>{
  return {
    initAction: ()=>{ dispatch(initAction()) }
  }
}

export default 
compose(
  connect(mapStateToProps, mapDispatchToProps),
)(App)
