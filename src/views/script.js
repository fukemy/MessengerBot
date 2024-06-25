

const start = () => {
    const textInput = document.getElementById("textValue")
    const textData = textInput.value
    if (textData && textData.trim().length > 0) {
        const loader = document.getElementById("loader")
        const mp3Div = document.getElementById("mp3Div")
        loader.style.display = 'block'
        mp3Div.style.display = 'none'
        fetch('https://messengerbot.loca.lt/convert', {
            method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                text: textData.trim()
            })
        }).then((result) => {
            loader.style.display = 'none'
            const audio = document.getElementById("audio")
            audio.src = `https://messengerbot.loca.lt/result.mp3?t=${new Date().getTime()}`
            audio.playbackRate = 1.8
            audio.load()
            audio.play()
            mp3Div.style.display = 'block'
        }).catch(error => {
            loader.style.display = 'none'
            console.log('convert error', error)
        })
    }
}