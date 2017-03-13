// @flow
import React, { Component } from 'react'
import LoginBox from './LoginBox'
import classNames from '../styles/login.css'

// auth
import secrets from '../secrets.json'
import Auth0Lock from 'auth0-lock'

export default class LoginPage extends Component {

	constructor(props) {
		super(props)
	}

	componentWillMount() {
		var context = this;
	  this.lock = new Auth0Lock(secrets.CLIENT_ID, secrets.DOMAIN, {
	  	auth: {
	  		redirectUrl: secrets.CALLBACK_URL
	  	}
	  });
    this.lock.on("authenticated", function(authResult) {
    	console.log('is authenticated')
      context.lock.getUserInfo(authResult.accessToken, function(error, profile) {
        if (error) {
          // Handle error
          return;
        }

        // Save token and profile locally
        console.log(authResult)
        localStorage.setItem("accessToken", authResult.accessToken);
        localStorage.setItem("profile", JSON.stringify(profile));
        localStorage.setItem("idToken", authResult.idToken);
        
        // fetch('http://127.0.0.1:3003/', {
        // 	method: 'get'
        // })
        // .then( (res) => {
        // 	console.log('redirected')
        // })
        // .catch( (err) => {
        // 	console.log('not redirected')
        // })
        // Update DOM
        // context.user = {
        //   email: profile.email,
        //   username: profile.name,
        //   clientID: profile.clientID
        // }
        // context.accessToken = authResult.accessToken;
        // context.idToken = authResult.idToken;

        console.log('added user: ', profile.email, profile.name)
      });
    });
	}

	render() {
		return (
			<div className={classNames.view}>
				<LoginBox lock={this.lock}/>
			</div>
		)
	}
}
