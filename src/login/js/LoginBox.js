import React, {Component} from 'react'
import classNames from '../styles/login.css'

//mobx
var server = 'http://127.0.0.1:3003/'

// @observer
class LoginBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: 'signIn',
      loginStatus: ''
    }

    this.toggleView = this.toggleView.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.handleInput = this.handleInput.bind(this);
    // this.showLock = this.showLock.bind(this);
  }

  // showLock(e) {
  //   e.preventDefault();
  //   store.lock.show()
  // }

  toggleView(e, view) {
    e.preventDefault();

    this.setState({
      currentView: view,
      error: null,
      username: null,
      password: null,
      email: null
    })
  }

  handleInput(e) {
    var name = e.target.name;
    var value = e.target.value;

    this.setState({
      [name]: value
    })
  }

  register(e) {
    e.preventDefault();
    console.log('register')
    // store.register()
  }

  login(e) {
    e.preventDefault();

    this.props.lock.show();

    // store.login(this.state);
    // console.log('status', this.state, store.loginStatus)
    // store.isAuthenticated = true;
  }


  render() {
    return (
      <div className={classNames.loginContainer}>
        { this.state.currentView === 'register' &&
          <form className={classNames.loginForm}>
            <input onChange={this.handleInput} name='username' type="text" placeholder="name"/>
            <input onChange={this.handleInput} name='password' type="password" placeholder="password"/>
            <input onChange={this.handleInput} name='email' type="text" placeholder="email address"/>
            <button onClick={this.register}>register</button>
            <p className={classNames.message}>Already registered? 
              <a onClick={(e) => this.toggleView(e, 'signIn')} href="#">Sign In</a>
            </p>
          </form>
        }
        { this.state.currentView === 'signIn' &&
          <form className={classNames.loginForm}>
            <input onChange={this.handleInput} name='email' type="text" placeholder="email"/>
            <input onChange={this.handleInput} name='password' type="password" placeholder="password"/>
            <button onClick={this.login}>login</button>
            <p className={classNames.message}>Not registered? 
              <a onClick={(e) => this.toggleView(e, 'register')} href="#">Create an account</a>
            </p>
          </form>
        }
        <span className={classNames.message}>{this.state.loginStatus}</span>
      </div>
    )
  }
}

export default LoginBox


