document.addEventListener('DOMContentLoaded', () => {
  let stickers = Array.from(document.getElementsByClassName('sticker'))
  stickers.forEach(sticker => {
    setupSticker(sticker)
  })
})

function setupSticker(sticker) {
  // duplicate the sticker twice
  let stickerFlip = sticker.cloneNode(true)
  let stickerShadow = sticker.cloneNode(true)
  let stickerImg = sticker.cloneNode(true)

  // alter original sticker to just be a container
  sticker.style.position = 'relative'
  sticker.style.overflow = 'hidden'
  sticker.style.backgroundImage = 'none'
  sticker.style.backgroundColor = 'initial'

  // set the copies to be positioned absolutely
  stickerImg.style.position = 'absolute'
  stickerFlip.style.position = 'absolute'

  // add the copies to the container
  // sticker.appendChild(stickerFlip)
  sticker.appendChild(stickerShadow)
  // sticker.appendChild(stickerImg)


  sticker.addEventListener('mouseenter', (enterE) => {
    let startX = enterE.layerX
    let startY = enterE.layerY

    let mouseMove = (moveE) => {
      let currX = moveE.layerX
      let currY = moveE.layerY

      // find degrees
      let degrees = Math.atan2((currY - startY), (currX - startX))
      // console.log(degrees)

      // find distance to edge
      let yDist = sticker.offsetHeight
      let xDist = sticker.offsetWidth
      let dist

      if(degrees >= 0 && degrees < Math.PI / 2) {
        let rightDist = Math.abs(xDist / Math.cos(degrees))
        let downDist = Math.abs(yDist / Math.cos(Math.PI/2 - degrees))
        dist = Math.min(rightDist, downDist)
      }
      if(degrees < 0 && degrees > Math.PI / -2) {
        let rightDist = Math.abs(xDist / Math.cos(-degrees))
        let upDist = Math.abs(yDist / Math.cos(Math.PI/2 + degrees))
        dist = Math.min(rightDist, upDist)
      }
      if(degrees >= Math.PI / 2 && degrees <= Math.PI) {
        let leftDist = Math.abs(xDist / Math.cos(-degrees + Math.PI))
        let downDist = Math.abs(yDist / Math.cos(degrees - Math.PI/2))
        dist = Math.min(leftDist, downDist)
      }
      if(degrees >= -Math.PI && degrees <= -Math.PI/2) {
        let leftDist = Math.abs(xDist / Math.cos(degrees + Math.PI))
        let upDist = Math.abs(yDist / Math.cos(-degrees - Math.PI/2))
        dist = Math.min(leftDist, upDist)
      }

      let percent = Math.pow(Math.pow(currY - startY, 2) + Math.pow(currX - startX, 2), 0.5) / dist * 100
      stickerShadow.style.background = `linear-gradient(${radToDeg(degrees) - 90}deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) ${100-percent}%,rgba(0,0,0,0.5) 100%)`
    }

    sticker.addEventListener('mousemove', mouseMove)
  
    sticker.addEventListener('mouseleave', () => {
      sticker.removeEventListener('mousemove', mouseMove)

      // cleanup animation
      stickerShadow.style.background = 'none'
    }, {once : true})
  })
}

function radToDeg(rad) {
  return rad * 180/Math.PI
}