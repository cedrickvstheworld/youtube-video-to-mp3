let socket = io('/')

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
        showError()
        return reject(resp)
      }
      else {
        return resolve(resp.blob());
      }
    })
    .catch((error) => {
      showError()
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
      let d = document.getElementById('conv-d');
      let p = document.getElementById('percent');
      d.style.opacity = 1;
      p.style.opacity = 1;
      downloadFile(videoUrl)
      .then((blob) => {
        download(blob, title);
      })
      .catch((error) => {
        let d = document.getElementById('conv-d');
        let p = document.getElementById('percent');
        d.style.opacity = 0;
        p.style.opacity = 0;
        showError();
        console.log(error)
      })
    }
    else {
      showError()
      console.log('error')
      return false
    }
})


function showError() {
  let error = document.getElementById('error-prompt')
  error.style.opacity = 1;
  setTimeout(() => {
    error.style.opacity = 0;
  }, 2000)
}
