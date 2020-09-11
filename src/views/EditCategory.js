import React, { useState, useEffect, Fragment } from 'react'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import 'materialize-css';
import { TextInput, Icon } from 'react-materialize';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import { withRouter, NavLink, useHistory } from 'react-router-dom';
import { addCategoryAction, categoryLogResetAction, updateCategoryAction, deleteCategoryAction } from '../store/actions/categoryActions'
import { v1 as uuid } from 'uuid';
import InfoCard from '../components/InfoCard';

function EditCategory(props) {
    const history = useHistory();
    const {categoryLogReset,updateCategory, deleteCategory} = props;
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryUrlid, setNewCategoryUrlid] = useState('');
    const categoryReducer = useSelector(state=>state.categoryReducer)
    // console.log(props);
    const {categoryid} = props.match.params;
    useEffect(()=>{
        if(categoryReducer.categoryMessage == 'CATEGORY_DELETE_SUCCESS'){
            history.push('/addCategory');
        }
        setTimeout(()=>{categoryLogReset()},3000)
    },[categoryReducer])

    useFirestoreConnect({
        collection: 'categories',
        doc: categoryid,
        storeAs: `editCategoryDoc=${categoryid}`
    })
    const categoryCol = useSelector(state=>state.firestore.ordered[`editCategoryDoc=${categoryid}`]);
    const [category, setCategory] =useState({});
    const [localCategory, setLocalCategory] =useState({});
    const [categoriesLog, setCategoriesLog] = useState('');
    const [rerender, setRerender] = useState(false);
    const [categoryBanner, setCategoryBanner] = useState([]);
    useEffect(()=>{
        if(!isLoaded(categoryCol)) return setCategoriesLog('LOADING_CATEGORY');
        if(!categoryCol || categoryCol.length == 0) return setCategoriesLog('NOT_FOUND_CATEGORY')
        setCategoriesLog('LOADED_CATEGORY')
        return setCategory(categoryCol[0]);
    },[categoryCol]);
    useEffect(()=>{
        if(!category) return;
        if(category.banner && category.banner.length > 0) setCategoryBanner(category.banner);
    },[category])

    const updateCategoryFn = ()=>{
        if(categoryBanner.length <= 0) return;
        updateCategory({
            docid: categoryid,
            data: { banner: categoryBanner }
        });
    }
    const deleteCategoryFn = ()=>{
        deleteCategory(categoryid);
    }

    const categoryJSX = (category)?(
        <div className="category">
            <div className="card round-card">
                <div className="card-content">
                    <table>
                    <tbody>
                    <tr><td>Category Name</td><th>{category.title}</th></tr>
                    <tr><td>Category url-id</td><th>{category.urlid}</th></tr>
                    </tbody>
                    </table>
                </div>
            </div>
            <div className="card round-card">
                <div className="card-content">
                    <div className="row">
                    <div className="col s12"><p className="head center">Banner Images</p></div>
                    {(categoryBanner)?(
                    <Fragment>
                    {categoryBanner.map((eachB,eachBindex)=>(
                    <Fragment key={uuid()}>
                    <TextInput 
                        s={9}
                        id={`bannerimage-${eachBindex}`}
                        onChange={(e)=>{
                            var local = new Array(...categoryBanner);
                                // console.log(local);
                                local[eachBindex] = {image:e.target.value, productLink:false};
                                setCategoryBanner(local); setRerender(!rerender);
                        }}
                        value={ eachB.image }
                    />
                    <div className="col s2">
                        <div 
                        onClick={()=>{
                            var local = new Array(...categoryBanner);
                            // console.log(local);
                            local = local.filter((ea,eaindex)=>eaindex!=eachBindex);
                            setCategoryBanner(local); setRerender(!rerender);
                        }}
                        className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                    </div>
                    </Fragment>
                    ))}
                    <div 
                    onClick={()=>{
                        var local = new Array(...categoryBanner);
                        // console.log(local);
                        local.push({image:'', productLink:false});
                        setCategoryBanner(local); setRerender(!rerender);
                    }}
                    className="col s12 center">
                        <div className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
                    </div>
                    </Fragment>
                    ):(<p className="center red-text">banner images not set</p> )}
                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col s6 center">
                    {(categoryReducer.categoryMessage==null  || categoryReducer.categoryMessage == '')?(
                    <div onClick={()=>{ deleteCategoryFn() }} className="btn red_btn"><Icon>delete</Icon> Delete Category</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_DELETE_IN_PROGRESS')?(
                    <div  className="btn red_btn"> Deleting... </div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_DELETE_SUCCESS')?(
                    <div className="btn red_btn"><Icon>done_all</Icon> Deleted</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_DELETE_ERROR')?(
                    <div onClick={()=>{ deleteCategoryFn() }} className="btn red_btn"><Icon>clear</Icon> Delete Err</div>
                    ):(null)}
                </div>
                <div className="col s6 center">
                    {(categoryReducer.categoryMessage==null  || categoryReducer.categoryMessage == '')?(
                    <div  onClick={()=>{ updateCategoryFn() }} className="btn dark_btn"><Icon>edit</Icon> Update Category</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_UPDATE_IN_PROGRESS')?(
                    <div className="btn dark_btn"> Updating... </div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_UPDATE_SUCCESS')?(
                    <div className="btn dark_btn"><Icon>done_all</Icon> Updated</div>
                    ):(null)}
                    {(categoryReducer.categoryMessage == 'CATEGORY_UPDATE_ERROR')?(
                    <div onClick={()=>{ updateCategoryFn() }} className="btn red_btn"><Icon>clear</Icon>Retry Upload</div>
                    ):(null)}
                </div>
            </div>
        </div>
    ):(null)

    return (
        <div className="AddCategory Page">
            <div className="container">
            <div className="row">
                <div className="col s12">
                    <h5 className="center head heavy_text">Edit Categories:</h5>
                </div>
                <div className="col s12">
                    {(categoriesLog == 'LOADING_CATEGORY')?(
                        <InfoCard> <h5 className="center">Loading...</h5> </InfoCard>
                    ):(null)}
                    {(categoriesLog == 'NOT_FOUND_CATEGORY')?(
                        <InfoCard> <h5 className="center">No categories found</h5> </InfoCard>
                    ):(null)}
                    {(categoriesLog == 'LOADED_CATEGORY')?(
                        <Fragment>
                            {categoryJSX}
                        </Fragment>
                    ):(null)}
                </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>{
    console.log(state);
    return {}
}
const mapDispatchToProps =(dispatch) => {
    return {
        addCategory: (data)=>{dispatch( addCategoryAction(data) )},
        categoryLogReset: (data)=>{dispatch( categoryLogResetAction(data) )},
        updateCategory: (update)=>{dispatch( updateCategoryAction(update) )},
        deleteCategory: (docid)=>{ dispatch( deleteCategoryAction(docid) ) }
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(EditCategory)
