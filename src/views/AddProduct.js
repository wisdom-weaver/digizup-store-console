import React, { Fragment, useEffect } from 'react'
import InfoCard from '../components/InfoCard'
import { NavLink, withRouter } from 'react-router-dom'
import { Icon } from '@material-ui/core'
import { useState } from 'react'
import { compose } from 'redux'

import 'materialize-css';
import { TextInput, Chip, Divider, Collapsible, CollapsibleItem } from 'react-materialize'
import {v1 as uuid } from 'uuid';
import { addProductAction, productUpdateReset } from '../store/actions/productAction'
import { connect } from 'react-redux'
import { reactReduxFirebase } from 'react-redux-firebase'

function AddProduct(props) {

    const [product,setProduct] = useState({});

    const [stage, setStage] = useState('init');
    const [rerender, setRerender] = useState(false);

    const [productName, setProductName]                       = useState( product.productName             ??  ''      );
    const [price, setPrice]                                   = useState( product.price                   ??  0       );
    const [images, setImages]                                 = useState( product.images                  ??  [''] );
    const [description, setDescription]                       = useState( product.description             ??  ''      );
    const [features, setFeatures]                             = useState( product.features                ??  ['']      );
    const [specs, setSpecs]                                   = useState( product.specs                   ??  [{specKey:'', specValue:''}]      );
    const [categories, setCategories]                         = useState( product.categories              ??  ['All'] );
    const [tags, setTags]                                     = useState( product.tags                    ??  []      );
    const [hasOptions, setHasOptions]                         = useState( product.hasOptions              ??  false   );
    const [inStock, setInStock]                               = useState( product.inStock                 ??  true    );
    const [optionCategories, setOptionCategories]             = useState( product.optionCategories        ??  []      );
    const [optionCategoriesObject, setOptionCategoriesObject] = useState( product.optionCategoriesObject  ??  {}      );
    const [productOptions, setProductOptions]                 = useState( product.productOptions          ??  {}      );

    useEffect(()=>{
        console.log('optionCategories=>',optionCategories)
        if(!optionCategories) return;
        var local = optionCategoriesObject;
        optionCategories.forEach((each,index)=>{
            if(!Object.keys(local).includes(each)){
                local[each] = [{ 
                    optionName:'',
                    optionFeatures: [''],
                    optionSpecs: [{ specKey:'', specValue:'' }],
                    optionTags: ['']
                }];
            }
        })
        setRerender(!rerender);
    },[optionCategories])

    const [tempCat,setTempCat] = useState('');
    const [tempTag,setTempTag] = useState('');
    const [tempOpCat,setTempOpCat] = useState('');

    const Con = (arA,arB)=>{
        // console.log('in Con',arA,arB)
        var arC = [];
        if(!arB || !arA) return;
        arA.forEach(eachA=>{
            arB.forEach(eachB=>{
                if(eachB?.length> 1){
                    arC.push([eachA,...eachB])
                }else{
                    arC.push([eachA,eachB])
                }
            })
        })
        return arC;
    }
    const concatRec = (arARRAY,C)=>{    
        // console.log('in rec');
        if(arARRAY.length == 1){
            return Con(arARRAY[0],C);
        }
        else{
            // console.log('arARRAY', arARRAY);
            var befLast = new Array (...arARRAY);
            var last = befLast.pop();
            // console.log('befLast', befLast);
            // console.log('last', last);
            // console.log('C', C);
            // console.log(Con(last,C));
            return concatRec( befLast, Con(last,C) );
        }
    }
    const getOptionsIndexAr= (lenar)=>{
        var arARRAY = lenar.map((each)=> new Array(each).fill().map((each,index)=>index) ) 
        // console.log('arArray init=> ',arARRAY);
        var last = arARRAY.pop();
        return concatRec(arARRAY, last);
    }

    const getIndciesFromOptionString = (string) => string.split('_').splice(1);

    const startProductOptions = ()=>{
        if(!optionCategories || optionCategories== [] || optionCategories.length<=0)  return;
        var catlen = optionCategories.map((each)=>optionCategoriesObject[each].length);
        console.log(catlen)
        var optionIndexArr = getOptionsIndexAr(catlen);
        var productOptionsKeys = optionIndexArr.map((each)=>'option_'+each.join('_'));
        console.log(productOptionsKeys);
        var localProductOptions = productOptions;
        productOptionsKeys.forEach(each=>{
            if(!Object.keys(productOptions).includes(each)){
                localProductOptions[each] = {
                    productFullName: '',
                    price: 0,
                    images: [''],
                    inStock: true,
                    isActive: true,
                    optionTags: []
                }
            }
        })
        setStage('productOptions')
    }

    const getProductJSON = ()=>{
        var pro = {} ;
        if(hasOptions == true){
            var localProductOptions = productOptions;
            Object.keys(localProductOptions).forEach((eachOp,index)=>{
                if(localProductOptions[eachOp].isActive == false){
                    localProductOptions[eachOp] = {
                                                      "productFullName": "",
                                                      "price": 0,
                                                      "images": [],
                                                      "inStock": false,
                                                      "isActive": false,
                                                      "optionTags": []
                                                  }
                }
            })
            pro={
                productName,
                productOptions: localProductOptions,
                optionCategories,
                optionCategoriesObject,
                hasOptions, 
                categories,
                tags,
                description,
                specs,
                features
            }
        }else{
            pro={
                productName,
                price: parseFloat(price),
                inStock,
                hasOptions, 
                categories,
                tags,
                images,
                description,
                specs,
                features
            }
        }
        setProduct(pro);
    }

    const {addProductAction, productUpdateReset, productMessage, productError, productLog} = props;
    useEffect(()=>{
        setTimeout(()=>{
            productUpdateReset()
        },7000)
    },[productMessage])
    const submitProduct = ()=>{
        addProductAction(product);
    }

    const initForm = (
        <form className="row">
            <div className="col s12 productName-field">
                <label htmlFor="productName">productName</label>
                <input onChange={(e)=>{setProductName(e.target.value)}} type="text" id="productName" value={productName}/>
            </div>
            <div className="col s12 hasOptions-field" >
            <p>
            <label>
                <input name="hasOptions" 
                readOnly={true} type="radio" checked={hasOptions == true} />
                <span  onClick={()=>{setHasOptions(!hasOptions)}} >{(hasOptions)
                ?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>hasOptions</span></Fragment>)
                :(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>hasOptions</span></Fragment>)}
                </span>
            </label>
            </p>
            </div>
            <div className="col s12 center">
                <div 
                onClick={()=>{
                    if(hasOptions == true) setStage('hasOptions');
                    else setStage('doesnotHasOptions');
                }}
                className="btn dark_btn">Next</div>
            </div>
        </form>
    )

    const descriptionForm = (
        <form  className="row">
            <div className="col s12 input-field">
                <label className="active" >Description</label>
                <textarea style={{'height': `${description.split('\n').length*35}px`}} className="materialize-textarea active" onChange={(e)=>{ setDescription(e.target.value) }} id="description">{description}</textarea>
            </div>
            <div className="col s12 center">
                <div 
                onClick={()=>{
                    setStage('addFeatures');
                }}
                className="btn dark_btn">Next</div>
            </div>
        </form>
    )

    const addFeaturesForm = (
        <form className="row">
            <h6 className="center">Features</h6>
            {features.map((feature,index)=>(
                <Fragment key={uuid()} >
                <TextInput
                id={uuid()}
                s={10}
                label={`Feature#${index} =>`}
                onBlur={(e)=>{
                   var local = features;
                   local[index] = e.target.value;
                   console.log(local);
                    setFeatures(local)
                  }}
                defaultValue={feature}
                />
                <div className="col s2">
                    <div onClick={()=>{
                        var local = features; 
                        local = local.filter((each,eachIndex)=> eachIndex!=index);
                        setFeatures(local); setRerender(!rerender);
                    }}  className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                </div>
                </Fragment>
            ))}
            <div className="col s12 center">
                <div onClick={()=>{ setFeatures([...features, '']) }} className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
            </div>
            <br/>
            <br/>
            <br/>
            <div className="col s12 center">
                <div onClick={()=>{ setStage('addSpecs') }} className="btn dark_btn">Next</div>
            </div>
        </form>
    )

    const addSpecsForm = (
        <form className="row">
            <h6 className="center">Specifications</h6>
            {specs.map((spec,index)=>(
                <Fragment key={uuid()} >
                <TextInput
                    id={uuid()}
                    s={5}
                    label={`Spec#${index}(key) =>`}
                    onBlur={(e)=>{
                        var local = specs; 
                        local[index].specKey= e.target.value;
                        setSpecs(local); setRerender(!rerender);
                    }}
                    defaultValue={spec.specKey}
                />
                <TextInput
                    id={uuid()}
                    s={5}
                    label={`Spec#${index}(value) =>`}
                    onBlur={(e)=>{
                        var local = specs; 
                        local[index].specValue= e.target.value;
                        setSpecs(local); setRerender(!rerender);
                    }}
                    defaultValue={spec.specValue}
                />
                <div className="col s2">
                    <div onClick={()=>{
                        var local = specs; 
                        local = local.filter((each,eachIndex)=> eachIndex!=index);
                        setSpecs(local);
                    }}  className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                </div>
                </Fragment>
            ))}
            <div className="col s12 center">
                <div onClick={()=>{ setSpecs([...specs, {specKey:'', specValue:''} ]) }} className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
            </div>
            <div className="col s12 center">
                <div onClick={()=>{ setStage('addCategoriesAndTags') }} className="btn dark_btn">Next</div>
            </div>
        </form>
    )

    const addCategoriesAndTagsForm = (
        <form className="row">
            <h6 className="center">Categories</h6>
            <div className="col s12">
            {categories.map((category,index)=>(

                <Chip
                key={uuid()}
                close={false}
                options={null}
                onClick={()=>{ setCategories(categories.filter((each,eachIndex)=>eachIndex!=index)) }}
                className="green-dark-chip hoverable"
                >
                <p>{category}</p>
              </Chip>
            ))}
            </div>
            <div className="col s12 input-field">
                <input 
                    onChange={(e)=>{setTempCat(e.target.value)}} 
                    onKeyDown={(e)=>{ if(e.keyCode==13){ e.preventDefault(); setCategories([...categories, tempCat.trim()]); setTempCat('');  } }} 
                    type="text" id='categories-enter' value={tempCat} placeholder='Add Category'
                />
            </div>
            <div className="col s12">
            <Divider />
            <Divider />
            </div>
            <h6 className="center">Tags</h6>
            <div className="col s12">
            {tags.map((tag,index)=>(

                <Chip
                key={uuid()}
                close={false}
                options={null}
                onClick={()=>{ setTags(tags.filter((each,eachIndex)=>eachIndex!=index)) }}
                className="green-dark-chip hoverable"
                >
                <p>{tag}</p>
              </Chip>
            ))}
            </div>
            <div className="col s12 input-field">
                <input 
                    onChange={(e)=>{setTempTag(e.target.value)}} 
                    onKeyDown={(e)=>{ if(e.keyCode==13){ e.preventDefault(); setTags([...tags, ...tempTag.trim().toLowerCase().split(' ').filter(each=>![' ','','\n'].includes(each))]); setTempTag('');  } }} 
                    type="text" id='tags-enter' value={tempTag} placeholder='Add Tag'
                />
            </div>
            <div className="col s6 center">
                <div onClick={()=>{ getProductJSON();setStage('productJSON') }} className="btn dark_btn">View JSON</div>
            </div>
        </form>
    )

    const hasOptionsForm = (hasOptions == true)?(
        <form className="row">
            <h5 className="center">hasOptions=> true</h5>
            <div className="col s12 input-field">
                <input 
                    onChange={(e)=>{setTempOpCat(e.target.value);}} 
                    onKeyDown={(e)=>{if(e.keyCode==13){
                        e.preventDefault();
                        setOptionCategories([...optionCategories, tempOpCat]); setTempOpCat(''); setRerender(!rerender)
                    }}} 
                    type="text" id='tags-enter' value={tempOpCat} placeholder='Add Option Category'
                />
            </div>
            <div className="col s12">
            {optionCategories.map((opCat,index)=>(
                <Chip
                key={uuid()}
                close={false}
                options={null}
                className="green-dark-chip hoverable"
                >
                <p className='flow-text'>{opCat}</p>
                </Chip>
            ))}
            </div>
            <div className="col s12">
                <Fragment>
                {Object.keys(optionCategoriesObject)?.sort().map((opCatOb,index)=>(
                 <Fragment>
                    <Fragment>
                        <p className="white flow-text head">{index}=>{opCatOb}</p>
                    </Fragment>
                    <Fragment>
                    {optionCategoriesObject[opCatOb]?.map((eachElem,elemIndex)=>(
                    <Fragment key={uuid()}>
                    <Fragment>
                        <Fragment>
                        <div className="row">
                        <div className="col s6"><p className="flow-text head heavy_text">{opCatOb}#{elemIndex}=></p></div>
                        <div className="col s6 right-align">
                            <div 
                            onClick={()=>{
                                var local = optionCategoriesObject;
                                local[opCatOb] = local[opCatOb].filter((filter, filterindex)=> elemIndex!=filterindex);
                                setOptionCategoriesObject(local); setRerender(!rerender);
                            }}
                            className="btn red_btn no-wrap"> <i className="material-icons">delete</i> {opCatOb}#{elemIndex}</div>
                        </div>
                        </div>
                        </Fragment>
                        <div className="row">

                            <div className="col s4"><p>OptionName: </p></div>
                            <TextInput
                                id={uuid()}
                                s={8}
                                onBlur={(e)=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionName = e.target.value;
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                defaultValue={eachElem.optionName}
                            />
                        </div>
                        <p className="head">Options Features</p>
                        <div className="row">
                        {eachElem.optionFeatures?.map((eachElemFeature,eachElemFeatureIndex)=>(
                            <Fragment key={uuid()}>
                            <TextInput
                                id={uuid()}
                                s={10}
                                onBlur={(e)=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionFeatures[eachElemFeatureIndex] = e.target.value;
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                defaultValue={eachElemFeature}
                            />
                            <div className="col s2">
                                <div 
                                onClick={(e)=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionFeatures = local[opCatOb][elemIndex].optionFeatures.filter((filter, filterindex)=> eachElemFeatureIndex!=filterindex);
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                            </div>
                            <div className="col s12"></div>
                            </Fragment>    
                        ))}
                        <div className="col s12 center">
                            <div 
                            onClick={(e)=>{
                                var local = optionCategoriesObject;
                                local[opCatOb][elemIndex].optionFeatures.push('');
                                setOptionCategoriesObject(local); setRerender(!rerender);
                            }}
                            className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
                        </div>
                        </div>
                        <p className="head">OptionSpecs</p>
                        <div className="row">
                        {eachElem.optionSpecs?.map((eachElemSpec,eachElemSpecIndex)=>(
                            <Fragment key={uuid()}>
                            <TextInput
                                id={uuid()}
                                s={5}
                                onBlur={(e)=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionSpecs[eachElemSpecIndex].specKey = e.target.value;
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                defaultValue={eachElemSpec.specKey}
                            />
                            <TextInput
                                id={uuid()}
                                s={5}
                                onBlur={(e)=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionSpecs[eachElemSpecIndex].specValue = e.target.value;
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                defaultValue={eachElemSpec.specValue}
                            />
                            <div className="col s2">
                                <div 
                                onClick={()=>{
                                    var local = optionCategoriesObject;
                                    local[opCatOb][elemIndex].optionSpecs = local[opCatOb][elemIndex].optionSpecs.filter((filter, filterindex)=> eachElemSpecIndex!=filterindex);
                                    setOptionCategoriesObject(local); setRerender(!rerender);
                                }}
                                className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                            </div>
                            <div className="col s12"></div>
                            </Fragment>    
                        ))}
                        <div className="col s12 center">
                            <div 
                            onClick={()=>{
                                var local = optionCategoriesObject;
                                local[opCatOb][elemIndex].optionSpecs.push({ specKey: '', specValue: '' });
                                setOptionCategoriesObject(local); setRerender(!rerender);
                            }}
                            className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
                        </div>
                        </div>
                    <Divider />
                    <Divider />
                    <Divider />
                    </Fragment>
                    </Fragment>
                    ))}
                    <div className="row">
                        <div className="col s6 center">
                            <div 
                            onClick={()=>{
                                var local = optionCategoriesObject;
                                delete local[opCatOb];
                                var localopcategories = optionCategories.filter(eachcat=>eachcat!=opCatOb);
                                setOptionCategories(localopcategories);
                                setOptionCategoriesObject(local); setRerender(!rerender);
                            }}
                            className="btn red_btn no-wrap"> <i className="material-icons">delete</i> {opCatOb} Category</div>
                        </div>
                        <div className="col s6 center">
                            <div 
                            onClick={()=>{
                                var local = optionCategoriesObject;
                                local[opCatOb].push({ 
                                    optionName:'',
                                    optionFeatures: [''],
                                    optionSpecs: [{ specKey:'', specValue:'' }]
                                });
                                setOptionCategoriesObject(local); setRerender(!rerender);
                            }}
                            className="btn dark_btn">
                                <i className="material-icons">add</i> {opCatOb} Option
                            </div>
                        </div>
                    </div>
                    <div className="center">
                        
                    </div>
                    </Fragment>
                 </Fragment>
                ))}
                </Fragment>
            <div className="center">
                <div  onClick={()=>{ startProductOptions() }} className="btn dark_btn">
                    Proceed to Product Options
                </div>
            </div>
            </div>
        </form>
    ):(null)
    
    const productOptionsForm = (hasOptions == true)?(
        <Fragment>
        {Object.keys(productOptions).map((productOption,index)=>(
            
                <Fragment key={uuid()}>
                <div className="row">
                    <div className="col s12">
                        <table className="white">
                        <tbody>
                        <tr><th className="head">{productOption}</th>{optionCategories && optionCategories.map((each,index)=>(<th key={uuid()}>{optionCategoriesObject[each][getIndciesFromOptionString(productOption)[index]].optionName}</th>))}</tr>
                        </tbody>
                        </table>
                    </div>
                    <div className="col s6">
                    <p>
                    <label>
                        <input
                        readOnly={true} type="radio" checked={productOptions[productOption].isActive} />
                        <span  
                        onClick={()=>{
                            console.log('clicked');
                            var local = productOptions;
                            local[productOption].isActive  = !local[productOption].isActive;
                            console.log(local);
                            setProductOptions(local); setRerender(!rerender);
                        }} 
                        >{(productOptions[productOption].isActive)
                        ?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>isActive</span></Fragment>)
                        :(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>not Active</span></Fragment>)}
                        </span>
                    </label>
                    </p>
                    </div>
                    {(productOptions[productOption].isActive)?(
                        <Fragment>
                        <div className="col s6">
                        <p>
                        <label>
                            <input
                            readOnly={true} type="radio" checked={productOptions[productOption].inStock} />
                            <span  
                            onClick={()=>{
                                // console.log('clicked');
                                var local = productOptions;
                                local[productOption].inStock  = !local[productOption].inStock;
                                // console.log(local);
                                setProductOptions(local); setRerender(!rerender);
                            }} 
                            >{(productOptions[productOption].inStock)
                            ?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>inStock</span></Fragment>)
                            :(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>out of Stock</span></Fragment>)}
                            </span>
                        </label>
                        </p>
                        </div>
                        <div className="col s12"></div>
                        <div className="col s4"><p className="head">ProductFullName</p></div>
                        <TextInput
                            id={uuid()}
                            s={8}
                            onBlur={(e)=>{
                                var local = productOptions;
                                local[productOption].productFullName = e.target.value;
                                setProductOptions(local); setRerender(!rerender);
                            }}
                            defaultValue={productOptions[productOption].productFullName}
                        />
                        <div className="col s12"></div>
                        <div className="col s4"><p className="head">ProductPrice</p></div>
                        <TextInput
                            id={uuid()}
                            s={8}
                            type='number'
                            onBlur={(e)=>{
                                var local = productOptions;
                                local[productOption].price = parseFloat(e.target.value);
                                setProductOptions(local); setRerender(!rerender);
                            }}
                            defaultValue={productOptions[productOption].price}
                        />
                        {(productOptions[productOption].images && productOptions[productOption].images.length> 0)?(
                            <Fragment>
                            <p className="left-align head">Product Images</p>
                            {productOptions[productOption].images.map((image,imIndex)=>(
                                <Fragment key={uuid()}>
                                <div className="row">
                                <TextInput
                                id={uuid()}
                                s={8}
                                onBlur={(e)=>{
                                    var local = productOptions;
                                    local[productOption].images[imIndex] = e.target.value;
                                    setProductOptions(local); setRerender(!rerender);
                                }}
                                defaultValue={image}
                                />  
                                <div className="col s2">
                                    <div 
                                    onClick={()=>{
                                        var local = productOptions;
                                        local[productOption].images = local[productOption].images.filter((each,eaindex)=>eaindex!=imIndex);
                                        setProductOptions(local); setRerender(!rerender);
                                    }}
                                    className="btn-floating red_btn"> <i className="material-icons">delete</i> </div>
                                </div>
                                </div>
                            </Fragment>
                            ))}
                            </Fragment>
                        ):(
                            <p className="head center heavy_text">No images right now</p>
                        )}
                            <div className="col s12 center">
                                <div 
                                onClick={()=>{
                                    var local = productOptions;
                                    local[productOption].images.push('');
                                    setProductOptions(local); setRerender(!rerender);
                                }}
                                className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
                            </div>
                            <div className="col s4">Option tags</div>
                            {(productOptions[productOption].optionTags.map(((tag,tagindex)=>(
                                <Chip
                                key={uuid()}
                                close={false}
                                options={null}
                                onClick={()=>{ 
                                    var local = productOptions;
                                    local[productOption].optionTags = local[productOption].optionTags.filter((each,eachIndex)=>eachIndex!=tagindex);
                                    setProductOptions(local); setRerender(!rerender);
                                }}
                                className="green-dark-chip hoverable"
                                >
                                <p>{tag}</p>
                              </Chip>
                            ))))}
                            <TextInput
                                id={uuid()}
                                s={12}
                                onKeyDown={(e)=>{if(e.keyCode == 13){
                                    var local = productOptions;
                                    local[productOption].optionTags = [ ...local[productOption].optionTags , ...e.target.value.trim().toLowerCase().split(' ').filter(each=>![' ','','\n'].includes(each)) ];
                                    setProductOptions(local); setRerender(!rerender);
                                }}}
                                defaultValue={''}
                            />
                        </Fragment>
                    ):(null)}

                </div>
                </Fragment>
        ))}
        <div className="center">
            <div
            onClick={()=>{ setStage('addDescription') }}
            className="btn dark_btn">
                Next
            </div>
        </div>
        </Fragment>
    ):(null)

    const doesnotHasOptionsForm = (hasOptions == false)?(
        <form className="row">
            <TextInput
                id={uuid()}
                s={6}
                type='number'
                label={'Product Price'}
                onChange={(e)=>{ setPrice(parseFloat(e.target.value)) }}
                value={price}
            />
            <div className="col s6">
                <p>
                <label>
                    <input
                    readOnly={true} type="radio" checked={inStock} />
                    <span  
                    onClick={()=>{ setInStock(!inStock); setRerender(!rerender) }} 
                    >{(inStock)
                    ?(<Fragment><span className="left-align primary-green-dark-text"><Icon>done_all</Icon>inStock</span></Fragment>)
                    :(<Fragment><span className="left-align primary-red-text"       ><Icon>close</Icon>out of Stock</span></Fragment>)}
                    </span>
                </label>
                </p>
            </div>
            <div className="col s12 center">
            </div>
            <div className="col s12"><h6 className="head">Images :</h6></div>
            {images.map((image,index)=>(
            <Fragment key={uuid()} >
                <TextInput
                id={uuid()}
                s={10}
                label={`Image#${index} =>`}
                onBlur={(e)=>{
                   var local = images;
                   local[index] = e.target.value;
                   console.log(local);
                    setImages(local)
                  }}
                defaultValue={image}
                />
                <div className="col s2">
                    <div onClick={()=>{
                        var local = images; 
                        local = local.filter((each,eachIndex)=> eachIndex!=index);
                        setImages(local); setRerender(!rerender);
                    }}  className="btn-floating primary-red-bg"><i className="material-icons">delete</i></div>
                </div>
            </Fragment>
            ))}
        <div className="col s12 center">
            <div onClick={()=>{ setImages([...images, '']) }} className="btn-floating primary-green-dark-bg"><i className="material-icons">add</i></div>
        </div>
        <br/>
        <br/>
        <br/>
        <div className="col s12 center">
            <div
                onClick={()=>{ setStage('addDescription') }}
                className="btn dark_btn">
                    Next
            </div>
        </div>
    </form>
    ):(null)

    const productJSON = (
        <div className="productJSON">
            <p className="line-break">
                {JSON.stringify(product,null,4)}

            </p>

            <div className="row">
                <div className="s12 center">
                    <p className="log center">
                        <span className={(productMessage=='PRODUCT_ADD_ERROR')?("error"):("success")}>{productLog}</span>
                    </p>
                </div>
                <div className="col s6 center">
                    <div onClick={()=>{setStage('init')}} className="btn light_btn">
                        <i className="material-icons">edit</i> Start
                    </div>
                </div>
                <div className="col s6 center">
                    {(productMessage == 'PRODUCT_UPDATE_RESET')?(<div className="btn dark_btn" onClick={submitProduct} ><i className="material-icons">add</i> Upload Product</div>):('')}
                    {(productMessage == 'PRODUCT_ADD_IN_PROGRESS')?(<div className="btn dark_btn"> Uploading....</div>):('')}
                    {(productMessage == 'PRODUCT_ADD_ERROR')?(<div className="btn red_btn" onClick={submitProduct} > Failed! <i  className="material-icons">replay</i> Retry</div>):('')}
                    {(productMessage == 'PRODUCT_ADD_SUCCESS')?(<div className="btn dark_btn"><i  className="material-icons">done_all</i>Uploaded</div>):('')}
                </div>
            </div>
        </div>
    )
    const formStage = {
        'init'                 :  {form: initForm                 ,show: true                , btnTitle:'Home' },
        'hasOptions'           :  {form: hasOptionsForm           ,show: (hasOptions==true ) , btnTitle:'Has Options' },
        'productOptions'       :  {form: productOptionsForm       ,show: (hasOptions==true ) , btnTitle:'Product Options' },
        'doesnotHasOptions'    :  {form: doesnotHasOptionsForm    ,show: (hasOptions==false) , btnTitle:'No Options' },
        'addDescription'       :  {form: descriptionForm          ,show: true                , btnTitle:'Description' },
        'addFeatures'          :  {form: addFeaturesForm          ,show: true                , btnTitle:'Features' },
        'addSpecs'             :  {form: addSpecsForm             ,show: true                , btnTitle:'Specifications' },
        'addCategoriesAndTags' :  {form: addCategoriesAndTagsForm ,show: true                , btnTitle:'Categories and Tags' },
        'productJSON'          :  {form: productJSON              ,show: true                , btnTitle:'Product Upload' }
    }

    return (
        <div className="AddProduct Page" >
            <div className="container">
                <h4 className="center head">Add <span className=" heavy_text">Product</span></h4>
                <Collapsible>
                    <CollapsibleItem
                    header={
                        <p className="center head heavy_text"> Navigation </p>
                    }
                    >
                        <div className="row-flex-center flex-wrap">
                            {Object.keys(formStage).map((each)=>(
                            (formStage[each].show)
                            ?(<div key={uuid()} className="btn dark_btn" onClick={()=>{setStage(each)}} >{formStage[each].btnTitle}</div>)
                            :(<div key={uuid()} className="btn dark_btn disabled" onClick={()=>{setStage(each)}} >{formStage[each].btnTitle}</div>)
                            ))}
                            <a href="/addProduct"><div key={uuid()} className="btn red_btn" onClick={()=>{setProduct({})}} >reset product</div></a>
                        </div>
                    </CollapsibleItem>
                </Collapsible>
                { formStage[stage].form }
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
        addProductAction: (product)=>{dispatch(addProductAction(product))},
        productUpdateReset: ()=>{ dispatch(productUpdateReset()) }
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(AddProduct)
