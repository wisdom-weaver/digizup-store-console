import React, { useState, useEffect, Fragment } from 'react'
import $ from 'jquery';
import { authMessageResetAction, signupAction, signUpExistsAction } from '../store/actions/authActions';
import { connect, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { compose } from 'redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import Delayed from '../utils/Delayed';
import 'materialize-css';
import { Button, Card, Row, Col, Collapsible, CollapsibleItem, Icon } from 'react-materialize';

function Signup(props) {
    
    const history = useHistory();
    const { authMessage, authError, signup, signUpExists, authMessageReset} = props;

    var queryStringParse = queryString.parse(props?.location?.search);
    const [signUpKey,setSignUpKey] = useState(queryStringParse?.signUpKey);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailExists, setEmailExists] = useState('');
    const [passwordExists, setPasswordExists] = useState('');

    const [firstNameBlur, setFirstNameBlur] = useState(false);
    const [lastNameBlur, setLastNameBlur] = useState(false);
    const [emailBlur, setEmailBlur] = useState(false);
    const [passwordBlur, setPasswordBlur] = useState(false);
    const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(false);
    const [emailExistsBlur, setEmailExistsBlur] = useState(false);
    const [passwordExistsBlur, setPasswordExistsBlur] = useState(false);

    useFirestoreConnect([{
        collection: 'signUpKey'
    }])
    const signupKeyCol = useSelector(state => state?.firestore?.ordered?.signUpKey) ?? null;
    const [signUpAuthkey, setSignUpAuthKey] = useState(null);
    useEffect(()=>{
        if(!(signupKeyCol)) return;
        setSignUpAuthKey(signupKeyCol[0].signUpKey);
    },[signupKeyCol]);
    useEffect(()=>{
        console.log('signUpAuthkey',signUpAuthkey);
    },[signUpAuthkey])
    
    var [allValid, setAllValid] = useState(false);
    var [allValidExists, setAllValidExists] = useState(false);
    var [authLog,setAuthLog] =  useState('');


    useEffect(()=>{  if(!firstNameBlur){ return;}  firstNameValidation(); },[firstName]);
    useEffect(()=>{  if(!lastNameBlur){ return;}  lastNameValidation(); },[lastName]);
    useEffect(()=>{  if(!emailBlur){ return;}  emailValidation(); },[email]);
    useEffect(()=>{ if(!passwordBlur){ return;} passwordValidation(); },[password]);
    useEffect(()=>{ if(!confirmPasswordBlur){ return;} confirmPasswordValidation(); },[confirmPassword]);
    
    useEffect(()=>{  if(!emailExistsBlur){ return;}  emailExistsValidation(); },[emailExists]);
    useEffect(()=>{ if(!passwordExistsBlur){ return;} passwordExistsValidation(); },[passwordExists]);
    
    useEffect(()=>{
        console.log('authMessage',authMessage, authError);
        if(authMessage == 'SIGNUP_SUCCESS'){ 
            setAuthLog('You are successfully signed up and logged in.');
            setTimeout(()=>{ history.push('/') },3000)
        }
        else { setAuthLog(authError) };
        setTimeout(()=>{
            authMessageReset();
        },5000)
    },[authMessage]);

    
    var renderLog = (authMessage=="AUTH_MESSAGE_RESET" || authMessage == null)?null
        :(<span className={(authMessage=="SIGNUP_SUCCESS")?"success":"error"} >{authLog}</span>);

    const firstNameValidation = ()=>{
        if(firstName.length==0){ setInvalid('firstName', 'enter your firstName'); return;}
        setValid('firstName'); return;
    }

    const lastNameValidation = ()=>{
        if(lastName.length==0){ setInvalid('lastName', 'enter your lastName'); return;}
        setValid('lastName'); return;
    }

    const emailValidation = ()=>{
        if(email.length==0){ setInvalid('email', 'enter your email'); return;}
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if( !regexEmail.test(email) ){ setInvalid('email', 'email not valid'); return;}
        setValid('email'); return;
    }
    
    const emailExistsValidation = ()=>{
        if(emailExists.length==0){ setInvalid('emailExists', 'enter your email'); return;}
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if( !regexEmail.test(emailExists) ){ setInvalid('emailExists', 'email not valid'); return;}
        setValid('emailExists'); return;
    }

    const passwordValidation = ()=>{
        if(password.length==0){ setInvalid('password', 'enter your password'); return;}
        if( password.length<8){ setInvalid('password', 'password should be a minimum of 8 characters'); return;}
        setValid('password'); return;
    }
    
    const passwordExistsValidation = ()=>{
        if( passwordExists.length==0){ setInvalid('passwordExists', 'enter your password'); return;}
        if( passwordExists.length<8){ setInvalid('passwordExists', 'password should be a minimum of 8 characters'); return;}
        setValid('passwordExists'); return;
    }

    const confirmPasswordValidation = ()=>{
        if(confirmPassword.length==0){ setInvalid('confirmPassword', 'confirm your password'); return;}
        if( confirmPassword!=password){ setInvalid('confirmPassword', 'passwords didnot match'); return;}
        setValid('confirmPassword'); return;
    }

    const setInvalid = (field, errorMessage)=>{
        $(`.${field}-field`).removeClass('valid').addClass('invalid');
        $(`.${field}-helper-text`).html(errorMessage);
    }
    const setValid = (field)=>{
        $(`.${field}-field`).removeClass('invalid').addClass('valid');
        $(`.${field}-helper-text`).html('');
    }

    const formValidation = ()=>{
        setFirstNameBlur(true);
        setLastNameBlur(true);
        setEmailBlur(true);
        setPasswordBlur(true);
        setConfirmPasswordBlur(true);
        firstNameValidation();
        lastNameValidation();
        emailValidation();
        passwordValidation();
        confirmPasswordValidation();
        if($('.signupForm .input-field.invalid').length == 0) allValid= true;
        else allValid = false;
    }
    const formExistsValidation = ()=>{
        setEmailExistsBlur(true);
        setPasswordExistsBlur(true);
        emailExistsValidation();
        passwordExistsValidation();
        if($('.signupFormExists .input-field.invalid').length == 0) allValidExists= true;
        else allValidExists = false;
    }

    const handleSubmit= (e)=>{
        e.preventDefault();
        formValidation();
        console.log('formvalidation', allValid);
        if(allValid){ 
            signup({firstName, lastName, email, password, confirmPassword})
        }
        else console.log('form is invalid');
    }
    const handleExistsSubmit= (e)=>{
        e.preventDefault();
        formExistsValidation();
        console.log(emailExists, passwordExists)
        console.log('formvalidationExists', allValidExists);
        if(allValidExists){ 
            signUpExists({email:emailExists, password:passwordExists})            
        }
        else console.log('form is invalid');
    }

    const SignUpFormJSX = (signUpAuthkey && signUpKey == signUpAuthkey)?(
        <div className="form-container center">
            <div className="card">
                <div className="card-title">
                    <span className="light_text">Sign</span>
                    <span className="heavy_text">Up</span>
                    {/* <span>{signUpKey}</span> */}
                </div>
                <div className="card-content">
                <div className="log center">
                    {renderLog}
                </div>
                    <form className="row signupForm" onSubmit={handleSubmit}>
                        
                        <div className="col s6 input-field firstName-field">
                            <i className="material-icons prefix">person</i>
                            <label htmlFor="firstName">First Name</label>
                            <input onChange={(e)=>{setFirstName(e.target.value)}}  onBlur={()=>{setFirstNameBlur(true); firstNameValidation();}} id="firstName" type="text" value={firstName}/>
                            <span className="helper-text firstName-helper-text"></span>
                        </div>

                        <div className="col s6 input-field lastName-field">
                            <i className="material-icons prefix"></i>
                            <label htmlFor="lastName">Last Name</label>
                            <input onChange={(e)=>{setLastName(e.target.value)}}  onBlur={()=>{setLastNameBlur(true); lastNameValidation();}} id="lastName" type="text" value={lastName}/>
                            <span className="helper-text lastName-helper-text"></span>
                        </div>

                        <div className="col s12 input-field email-field">
                            <i className="material-icons prefix">email</i>
                            <label htmlFor="email">Email</label>
                            <input onChange={(e)=>{setEmail(e.target.value)}}  onBlur={()=>{setEmailBlur(true); emailValidation();}} id="email" type="email" value={email}/>
                            <span className="helper-text email-helper-text"></span>
                        </div>

                        <div className="col s12 input-field password-field">
                            <i className="material-icons prefix">fingerprint</i>
                            <label htmlFor="password">Password</label>
                            <input onChange={(e)=>{setPassword(e.target.value)}} onBlur={()=>{setPasswordBlur(true); passwordValidation();}} id="password" type="password" value={password}/>
                            <span className="helper-text password-helper-text"></span>
                        </div>
                        <div className="col s12 input-field confirmPassword-field">
                            <i className="material-icons prefix">check_circle</i>
                            <label htmlFor="confirmPassword">confirmPassword</label>
                            <input onChange={(e)=>{setConfirmPassword(e.target.value)}} onBlur={()=>{setConfirmPasswordBlur(true); confirmPasswordValidation();}} id="confirmPassword" type="password" value={confirmPassword}/>
                            <span className="helper-text confirmPassword-helper-text"></span>
                        </div>

                        <div className="center">
                            <button className="btn signup_btn">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ):(null)

    const SignUpExistsFormJSX = (signUpAuthkey && signUpKey == signUpAuthkey)?(
        <div className="form-container center" >
            <div className="card">
                <div className="card-title">
                    <span className="light_text">Sign</span>
                    <span className="heavy_text">Up: </span>
                    <span>UserExists</span>
                </div>
                <div className="card-content">
                <div className="log center">
                    {renderLog}
                </div>
                    <form className="row signupFormExists" onSubmit={handleExistsSubmit}>
                        
                        <div className="col s12 input-field emailExists-field">
                            <i className="material-icons prefix">email</i>
                            <label htmlFor="emailExists">Email</label>
                            <input onChange={(e)=>{setEmailExists(e.target.value)}}  onBlur={()=>{setEmailExistsBlur(true); emailExistsValidation();}} id="emailExists" type="email" value={emailExists}/>
                            <span className="helper-text emailExists-helper-text"></span>
                        </div>

                        <div className="col s12 input-field passwordExists-field">
                            <i className="material-icons prefix">fingerprint</i>
                            <label htmlFor="passwordExists">Password</label>
                            <input onChange={(e)=>{setPasswordExists(e.target.value)}} onBlur={()=>{setPasswordExistsBlur(true); passwordExistsValidation();}} id="passwordExists" type="password" value={passwordExists}/>
                            <span className="helper-text passwordExists-helper-text"></span>
                        </div>

                        <div className="center">
                            <button className="btn signup_btn">Admin Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ):(null)

    const SignUpPageJSX = ( signUpAuthkey && signUpKey == signUpAuthkey)?(
            <div className="Signup">
                <div className="container">
                <Fragment>
                    <Collapsible
                      accordion
                      popout
                      style={{
                          'flex-grow': '1'
                      }}
                    >
                      <CollapsibleItem
                        expanded={false}
                        header={ <h6 className="center"><Icon>whatshot</Icon> New Admin User </h6> }
                        className="center"
                        node="div"
                      >
                        {SignUpFormJSX}
                      </CollapsibleItem>
                      <CollapsibleItem
                        expanded={false}
                        header={ <h6 className="center"><Icon>place</Icon> Already here on Digizup Store? </h6> }
                        className="center"
                        node="div"
                      >
                        {SignUpExistsFormJSX}
                      </CollapsibleItem>
                    </Collapsible>
                </Fragment>
                </div>
            </div>
        ):(
            <div className="Page">
                <div className="row">
                    <div className="col s12 m8 l6 offset-m2 offset-l3">
                    <div className="card round-card">
                    <div className="card-content">
                    <h4 className="center primary-green-dark-text"> <span>Sign</span><span className="heavy_text">Up</span></h4>
                    <p className="flow-text center">
                        Sorry!! Please verify your <span className="heavy_text">SignUpKey</span> to proceed
                    </p>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        )

    return (
        <Fragment>
            <Delayed waitBeforeShow={1000}>
                {SignUpPageJSX}
            </Delayed>
        </Fragment>
    )
}

const mapStateToProps =(state)=>{
    console.log(state);
    return{
        authError: state.auth.authError,
        authMessage: state.auth.authMessage
    }

}

const mapDispatchToProps = (dispatch)=>{
    return {
        signup: (newUser)=>{ dispatch( signupAction(newUser) ) },
        signUpExists: (user)=>{ dispatch( signUpExistsAction(user) ) },
        authMessageReset: ()=>{ dispatch( authMessageResetAction() ) }

    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Signup)
