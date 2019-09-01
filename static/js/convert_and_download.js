document.getElementById('convert-and-download')
.addEventListener('click', async () => {
 const videoUrl = document.getElementById('input-field-url').value;
 window.location = `/ytdlmp3?videoUrl=${videoUrl}`;
});