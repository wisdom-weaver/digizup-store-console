import React, { useState, useEffect } from 'react'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import 'materialize-css';
import { TextInput, Icon } from 'react-materialize';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import { withRouter, NavLink } from 'react-router-dom';
import { addCategoryAction, categoryLogResetAction } from '../store/actions/categoryActions'
import { v1 as uuid } from 'uuid';
import InfoCard from '../components/InfoCard';

function AddCategory(props) {
    const {addCategory, categoryLogReset} = props;
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryUrlid, setNewCategoryUrlid] = useState('');
    const categoryReducer = useSelector(state=>state.categoryReducer)
    
    useEffect(()=>{
        setTimeout(()=>{categoryLogReset()},3000)
    },[categoryReducer])

    useFirestoreConnect({
        collection: 'categories'
    })
    const categories = useSelector(state=>state.firestore.ordered.categories);
    const [categoriesLog, setCategoriesLog] = useState('');
    useEffect(()=>{
        if(!isLoaded(categories)) return setCategoriesLog('LOADING_CATEGORIES');
        if(!categories || categories.length == 0) return setCategoriesLog('NOT_FOUND_CATEGORIES')
        return setCategoriesLog('LOADED_CATEGORIES')
    },[categories])

    const submitNewCategory= ()=>{
        if(newCategoryName == '' || newCategoryUrlid == '') return;
        addCategory({
            title: newCategoryName,
            urlid: newCategoryUrlid.toLowerCase().split(' ').join('-')
        })
    }
    return (
        <div className="AddCategory Page">
            <div className="container">
            <h5 className="center head heavy_text">Add Category:</h5>
            <div className="row">
                <div className="col s12 m6">
                    <TextInput 
                        id="newcatname"
                        s={12}
                        label='New Category Name=>'
                        onChange={(e)=>{setNewCategoryName(e.target.value)}}
                    />
                </div>
                <div className="col s12 m6">
                    <TextInput 
                        id="newcaturlid"
                        s={12}
                        label='New Category url-id=>'
                        onChange={(e)=>{setNewCategoryUrlid(e.target.value)}}
                    />
                </div>
                <div className="col s12 center">
                    {(categoryReducer.categoryMessage==null  || categoryReducer.categoryMessage == '')?(
                    <div  onClick={()=>{submitNewCategory()}} className="btn dark_btn"><Icon>edit</Icon> Add Category</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_ADD_IN_PROGRESS')?(
                    <div className="btn dark_btn"> Adding Category... </div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_ADD_SUCCESS')?(
                    <div className="btn dark_btn"><Icon>done_all</Icon> Updated</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_ADD_ERROR')?(
                    <div onClick={()=>{submitNewCategory()}} className="btn red_btn"><Icon>clear</Icon>Retry </div>
                    ):(null)}
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <h5 className="center head heavy_text">Existing Categories:</h5>
                </div>
                <div className="col s12">
                    {(categoriesLog == 'LOADING_CATEGORIES')?(
                        <InfoCard> <h5 className="center">Loading...</h5> </InfoCard>
                    ):(null)}
                    {(categoriesLog == 'NOT_FOUND_CATEGORIES')?(
                        <InfoCard> <h5 className="center">No categories found</h5> </InfoCard>
                    ):(null)}
                    {(categoriesLog == 'LOADED_CATEGORIES')?(
                        <table className="white">
                        <tbody>
                        <tr><td>Category name</td><td>Category url-id</td><td>Category id</td></tr> 
                        {categories.map((category)=>(
                        <tr key={uuid()}><td className="head regular_text"><NavLink className='head' to={`/editCategory/${category.id}`}>{category.title}</NavLink></td><th>{category.urlid}</th><td>{category.id}</td></tr>
                        ))}
                        </tbody>
                        </table>
                    ):(null)}
                </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>{
    return {}
}
const mapDispatchToProps =(dispatch) => {
    return {
        addCategory: (data)=>{dispatch( addCategoryAction(data) )},
        categoryLogReset: (data)=>{dispatch( categoryLogResetAction(data) )}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(AddCategory)
