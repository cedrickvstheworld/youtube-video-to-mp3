let socket = io('/')

let socketObj = {}

socket.on('connect', function () {
  socketObj.id = socket.id
});

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

let dontMultipleError = 'You cannot convert multiple media at the same time. Jed does not have a powerful server . . .'

function downloadFile(videoUrl) {
  return new Promise((resolve, reject) => {
    let url = `/ytdlmp3?videoUrl=${videoUrl}&socketId=${socketObj.id}`;
    return fetch(url, {
      method: 'GET'
    })
      .then((resp) => {
        if (resp.status === 400) {
          return reject({ resp, error: 'Invalid URL' })
        }
        if (resp.status === 401) {
          return reject({ resp, error: dontMultipleError })
        }
        else {
          let p = document.getElementById('percent');
          p.innerHTML = 'resolving file...'
          return resolve(resp.blob());
        }
      })
      .catch((error) => {
        showError('Invalid URL')
      })
  })
}

function verifyUrl(url) {
  let valid = /^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/
  if (valid.test(url)) {
    return true
  }
  return false
}

document.getElementById('convert-and-download').addEventListener('click', async () => {
  if (onQueue) {
    return showError(dontMultipleError)
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
        showError(error.error);
      })
  }
  else {
    onQueue = false
    showError('Invalid URL')
    loaderVisibile(false)
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