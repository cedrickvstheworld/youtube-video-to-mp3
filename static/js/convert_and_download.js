let socket = io('/')

let onQueue = false;

socket.on('progress', (data) => {
  // loader
  let d = document.getElementById('conv-d');
  let p = document.getElementById('percent');
  let percent = parseInt(data.progress.percentage);
  p.innerHTML = `${percent}%`
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
        showError('Invalid URL')
        return reject(resp)
      }
      else {
        return resolve(resp.blob());
      }
    })
    .catch((error) => {
      showError('Invalid URL')
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

document.getElementById('convert-and-download').addEventListener('click', async () => {
    if (onQueue) {
      return showError('You cannot convert multiple media at the same time. Jed does not have a powerful server . . .')
    }
    onQueue = true
    const videoUrl = document.getElementById('input-field-url').value;
    if (verifyUrl(videoUrl)) {
      loaderVisibile(true)
      downloadFile(videoUrl)
      .then((blob) => {
        onQueue = false
        loaderVisibile(false)
        download(blob, title);
      })
      .catch((error) => {
        onQueue = false
        loaderVisibile(false)
        showError('Invalid URL');
        console.log(error)
      })
    }
    else {
      onQueue = false
      showError('Invalid URL')
      loaderVisibile(false)
      console.log('error')
      return false
    }
})


function showError(msg) {
  let error = document.getElementById('error-prompt')
  error.innerHTML = msg
  error.style.opacity = 1;
  setTimeout(() => {
    error.style.opacity = 0;
    error.innerHTML = '...';
  }, 2000)
}

function loaderVisibile(fuck) {
  let d = document.getElementById('conv-d');
  let p = document.getElementById('percent');
  p.innerHTML = "0%"
  let state = fuck ? 1 : 0
  d.style.opacity = state;
  p.style.opacity = state;
}