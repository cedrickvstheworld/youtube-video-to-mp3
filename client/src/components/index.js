import React, { Component } from 'react'

// components
import InputField from './parts/input-field'

export default class Index extends Component {
  render() {
    return (
      <div className="Index">
        <div id="index-wrapper">
          <div id="index-container">
            <InputField />
          </div>
        </div>
      </div>
    )
  }
}

