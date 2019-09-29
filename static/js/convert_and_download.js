let socket = io('/')

socket.on('progress', (data) => {
  console.log(data)
})

var title;
socket.on('emitTitle', (data) => {
  title = data.title;
})

function downloadFile(videoUrl) {
  return new Promise((resolve, reject) => {
    let url = `/ytdlmp3?videoUrl=${videoUrl}`;
    return fetch(url, {
      method: 'GET'
    })
    .then((resp) => {
      if (resp.status === 400) {
        return reject(resp)
      }
      else {
        return resolve(resp.blob());
      }
    })
    .catch((error) => {
      console.log(error)
    })
  })
}

function verifyUrl(url) {
  let validLong = /^https\:\/\/www\.youtube\.com\/watch\?v\=+[a-zA-Z0-9-._]+$/
  let validShort = /^https:\/\/youtu.be\/+[a-zA-Z0-9-._]+$/
  if (validShort.test(url) || validLong.test(url)) {
    return true
  }
  return false
}

document.getElementById('convert-and-download').addEventListener('click', () => {
    const videoUrl = document.getElementById('input-field-url').value;
    if (verifyUrl(videoUrl)) {
      downloadFile(videoUrl)
      .then((blob) => {
        download(blob, title);
      })
      .catch((error) => {
        console.log(error)
      })
    }
    else {
      console.log('error')
      return false
    }
})
