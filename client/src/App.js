
import React, { Component } from 'react'
import './static/css/main.css'
import './static/css/index.css'

// components 
import Index from './components/index'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Index />
      </div>
    )
  }
}
