import React, { Component } from 'react'
import axios from 'axios'
const FileDownload = require('js-file-download')

export default class InputField extends Component {
  constructor() {
    super()
    this.state = {
      videoUrl: ''
    }
    this.getVideoUrl = this.getVideoUrl.bind(this)
    this.convertAndDownload = this.convertAndDownload.bind(this)
  }

  getVideoUrl(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  convertAndDownload() {
    if (!this.state.videoUrl) {
      console.log('empty value')
      return
    }
    // get request from server
    axios.get(`/api/?videoUrl=${this.state.videoUrl}`)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    return
  }
  // /https://medium.com/yellowcode/download-api-files-with-react-fetch-393e4dae0d9e

  render() {
    return (
      <div className="InputField">
        <input id="input-field-url" type="text" name="videoUrl" value={this.state.videoUrl} onChange={this.getVideoUrl} placeholder="Youtube video URL here motherfucker" />
        <br />
        <div id="button-container">
          <a target="_blank" href={`http://localhost:8000/api?videoUrl=${this.state.videoUrl}`} id="convert-and-download">Convert to MP3 and Download</a>
        </div>
      </div>
    )
  }
}
