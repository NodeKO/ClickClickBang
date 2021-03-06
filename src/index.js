import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import LandingPage from './LandingPage'
import Game from './components/game'
import './index.css'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={LandingPage} />
    <Route path='/game' component={Game} />

    {/* <Route path="*" component={NoMatch}/> */}

  </Router>,
  document.getElementById('root')
)
