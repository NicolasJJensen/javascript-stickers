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
  stickerShadow.style.position = 'absolute'
  stickerFlip.style.position = 'absolute'

  // add the copies to the container
  // sticker.appendChild(stickerFlip)
  sticker.appendChild(stickerImg)
  sticker.appendChild(stickerShadow)


  sticker.addEventListener('mouseenter', (enterE) => {
    let startX = enterE.layerX
    let startY = enterE.layerY

    let mouseMove = (moveE) => {
      let currX = moveE.layerX
      let currY = moveE.layerY

      let clip

      // find degrees
      let degrees = Math.atan2((currY - startY), (currX - startX))

      // find distance to edge
      let yDist = sticker.offsetHeight
      let xDist = sticker.offsetWidth
      let dist
      let xScale = 1
      let yScale = 1

      if(degrees >= 0 && degrees < Math.PI / 2) {
        let rightDist = Math.abs(xDist / Math.cos(degrees))
        let downDist = Math.abs(yDist / Math.cos(Math.PI/2 - degrees))
        dist = Math.min(rightDist, downDist)

        let dxLeft = Math.abs((sticker.offsetWidth - ((startX + currX) * 0.5)) / Math.cos(-degrees + Math.PI/2))
        let dyBottom = Math.abs((sticker.offsetHeight - ((startY + currY) * 0.5)) / Math.cos(degrees))

        let dxRight = Math.abs((startX + currX) * 0.5 / Math.cos(-degrees + Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(degrees))
        
        if(dxLeft < dyBottom) {
          let leftHeight = (startY + currY) * 0.5 + (startX + currX) * 0.5 * Math.tan(-degrees + Math.PI/2)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(-degrees + Math.PI/2)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              100% 100%,
              0% 100%)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              ${topWidth/sticker.offsetWidth * 100}% 0%,
              100% 0%,
              100% 100%,
              0% 100%)`
          }
        } else {
          let bottomWidth = (startX + currX) * 0.5 - (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(degrees)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(-degrees + Math.PI/2)
            clip = `polygon(
              ${bottomWidth/sticker.offsetWidth * 100}% 100%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              100% 100%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees)
            clip = `polygon(
              ${bottomWidth/sticker.offsetWidth * 100}% 100%, 
              ${topWidth/sticker.offsetWidth * 100}% 0%, 
              100% 0%, 
              100% 100%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%)`
          }
        }
      }else if(degrees < 0 && degrees >= Math.PI / -2) {
        let rightDist = Math.abs(xDist / Math.cos(-degrees))
        let upDist = Math.abs(yDist / Math.cos(Math.PI/2 + degrees))
        dist = Math.min(rightDist, upDist)
        yScale = -1

        let dxLeft = Math.abs(((startX + currX) * 0.5) / Math.cos(Math.PI/2 + degrees))
        let dyBottom = Math.abs((sticker.offsetHeight - ((startY + currY) * 0.5)) / Math.cos(-degrees))

        let dxRight = Math.abs((sticker.offsetWidth - ((startX + currX) * 0.5)) / Math.cos(Math.PI/2 + degrees))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(-degrees))
        
        if(dxLeft < dyTop) {
          let leftHeight = (startY + currY) * 0.5 - (startX + currX) * 0.5 * Math.tan(Math.PI/2 + degrees)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(Math.PI/2 + degrees)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              0% 0%,
              100% 0%,
              100% ${rightHeight/sticker.offsetHeight * 100}%)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(-degrees)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              0% 0%,
              100% 0%,
              100% 100%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%)`
          }
        } else {
          let topWidth = (startX + currX) * 0.5 - (startY + currY) * 0.5 * Math.tan(-degrees)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(Math.PI/2 + degrees)
            clip = `polygon(
              ${topWidth/sticker.offsetWidth * 100}% 0%,
              100% 0%,
              100% ${rightHeight/sticker.offsetHeight * 100}%)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(-degrees)
            clip = `polygon(
              ${topWidth/sticker.offsetWidth * 100}% 0%,
              100% 0%,
              100% 100%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%)`
          }
        }
      } else if(degrees >= Math.PI / 2 && degrees <= Math.PI) {
        let leftDist = Math.abs(xDist / Math.cos(-degrees + Math.PI))
        let downDist = Math.abs(yDist / Math.cos(degrees - Math.PI/2))
        dist = Math.min(leftDist, downDist)
        xScale = -1

        let dxLeft = Math.abs(((startX + currX) * 0.5) / Math.cos(degrees - Math.PI/2))
        let dyBottom = Math.abs((sticker.offsetHeight - ((startY + currY) * 0.5)) / Math.cos(-degrees + Math.PI))

        let dxRight = Math.abs((sticker.offsetWidth - ((startX + currX) * 0.5)) / Math.cos(degrees - Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(-degrees + Math.PI))
        
        if(dxLeft < dyTop) {
          let leftHeight = (startY + currY) * 0.5 - (startX + currX) * 0.5 * Math.tan(degrees - Math.PI/2)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(degrees - Math.PI/2)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              100% 100%,
              0% 100%)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(-degrees + Math.PI)
            clip = `polygon(
              0% ${leftHeight/sticker.offsetHeight * 100}%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%,
              0% 100%)`
            }
          } else {
            let topWidth = (startX + currX) * 0.5 - (startY + currY) * 0.5 * Math.tan(-degrees + Math.PI)
            if(dxRight < dyBottom) {
              let rightHeight = (startY + currY) * 0.5 + (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(degrees - Math.PI/2)
              clip = `polygon(
                0% 0%,
                ${topWidth/sticker.offsetWidth * 100}% 0%,
                100% ${rightHeight/sticker.offsetHeight * 100}%,
                100% 100%,
                0% 100%)`
            } else {
            let bottomWidth = (startX + currX) * 0.5 + (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(-degrees + Math.PI)
            clip = `polygon(
              0% 0%,
              ${topWidth/sticker.offsetWidth * 100}% 0%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%,
              0% 100%)`
            }
          }

      } else if(degrees > -Math.PI && degrees <= -Math.PI/2) {
        let leftDist = Math.abs(xDist / Math.cos(degrees + Math.PI))
        let upDist = Math.abs(yDist / Math.cos(-degrees - Math.PI/2))
        dist = Math.min(leftDist, upDist)
        xScale = -1
        yScale = -1

        let dxLeft = Math.abs((startX + currX) * 0.5 / Math.cos(-degrees - Math.PI/2))
        let dyBottom = Math.abs((sticker.offsetHeight - ((startY + currY) * 0.5)) / Math.cos(degrees + Math.PI))

        let dxRight = Math.abs((sticker.offsetWidth - ((startX + currX) * 0.5)) / Math.cos(-degrees - Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(degrees + Math.PI))
        
        if(dxLeft < dyBottom) {
          let leftHeight = (startY + currY) * 0.5 + (startX + currX) * 0.5 * Math.tan(-degrees - Math.PI/2)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(-degrees - Math.PI/2)
            clip = `polygon(
              0% 0%,
              100% 0%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              0% ${leftHeight/sticker.offsetHeight * 100}%)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees + Math.PI)
            clip = `polygon(
              0% 0%,
              ${topWidth/sticker.offsetWidth * 100}% 0%,
              0% ${leftHeight/sticker.offsetHeight * 100}%)`
          }
        } else {
          let bottomWidth = (startX + currX) * 0.5 - (sticker.offsetHeight - ((startY + currY) * 0.5)) * Math.tan(degrees + Math.PI)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (sticker.offsetWidth - ((startX + currX) * 0.5)) * Math.tan(-degrees - Math.PI/2)
            clip = `polygon(
              0% 0%,
              100% 0%,
              100% ${rightHeight/sticker.offsetHeight * 100}%,
              ${bottomWidth/sticker.offsetWidth * 100}% 100%,
              0% 100%)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees + Math.PI)
            clip = `polygon(
              0% 0%,
              ${topWidth/sticker.offsetWidth * 100}% 0%, 
              ${bottomWidth/sticker.offsetWidth * 100}% 100%, 
              0% 100%)`
          }
        }
      }

      let percent = Math.pow(Math.pow(currY - startY, 2) + Math.pow(currX - startX, 2), 0.5) / dist * 100

      stickerFlip.style.transform = `scale(${xScale}, ${yScale})`
      // console.log(clip)
      sticker.style.clipPath = Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > 25 ? clip : 'none'
      stickerShadow.style.background = `linear-gradient(${radToDeg(degrees) - 90}deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) ${100-percent}%,rgba(0,0,0,0.5) 100%)`
    }

    sticker.addEventListener('mousemove', mouseMove)
  
    sticker.addEventListener('mouseleave', () => {
      sticker.removeEventListener('mousemove', mouseMove)
      sticker.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 100% 0%)'
      // cleanup animation
      stickerShadow.style.background = 'none'
    }, {once : true})
  })
}

function radToDeg(rad) {
  return rad * 180/Math.PI
}