window.addEventListener('load', () => {
  let stickers = Array.from(document.getElementsByClassName('sticker'))
  stickers.forEach(sticker => {
    setupSticker(sticker)
  })
})

function getStyle(elem, style) {
  return window.getComputedStyle(elem, null)[style]
}

let moveAmount = Math.pow(10, 2)

//                                                                 //
//                                                                 //
//                                                                 //
// px values for clipping at an angle MAY work for shadow gradient //
//                                                                 //
//                                                                 //
//                                                                 //

function setupSticker(sticker) {
  // duplicate the sticker twice
  let stickerFlip = sticker.cloneNode(true)
  let stickerShadow = sticker.cloneNode(true)
  let stickerImg = sticker.cloneNode(true)

  let img = getStyle(sticker, 'backgroundImage')
  let imgSize = getStyle(sticker, 'backgroundSize')
  let bgColor = getStyle(sticker, 'backgroundColor')

  // alter original sticker to just be a container
  sticker.style.position = 'relative'
  sticker.style.backgroundImage = 'none'
  sticker.style.backgroundColor = 'initial'
  sticker.style.border = 'none'

  // set the copies to be positioned absolutely
  stickerImg.style.position = 'absolute'
  stickerShadow.style.position = 'absolute'
  stickerFlip.style.position = 'absolute'

  stickerFlip.style.display = 'none'
  stickerFlip.style.setProperty('--image', img)
  stickerFlip.style.setProperty('--imgSize', imgSize)
  stickerFlip.style.setProperty('--bgColor', bgColor)
  sticker.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 100% 0%)'
  stickerFlip.classList.add('stickerFlip')

  // add the copies to the container
  sticker.appendChild(stickerImg)
  // sticker.appendChild(stickerShadow)
  sticker.appendChild(stickerFlip)


  sticker.addEventListener('mousedown', (enterE) => {
    let startX = enterE.layerX
    let startY = enterE.layerY

    let mouseMove = (moveE) => {
      let currX = moveE.x - sticker.getBoundingClientRect().left
      let currY = moveE.y - sticker.getBoundingClientRect().top

      let clip

      // find degrees
      let degrees = Math.atan2((currY - startY), (currX - startX))
      let angle

      // find distance to edge
      let yDist = Math.abs(sticker.offsetHeight)
      let xDist = Math.abs(sticker.offsetWidth)
      let cornerDist = Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), 0.5)
      let dist
      let xScale = -1
      let yScale = -1

      if(degrees >= 0 && degrees < Math.PI / 2 && Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount) {
        let rightDist = Math.abs(xDist / Math.cos(degrees))
        let downDist = Math.abs(yDist / Math.cos(Math.PI/2 - degrees))
        dist = Math.min(rightDist, downDist)

        let angle = radToDeg(degrees)-45
        let angle2 = -radToDeg(degrees)+45

        let dxLeft = Math.abs((startX + currX) * 0.5 / Math.cos(-degrees + Math.PI/2))
        let dyBottom = Math.abs((yDist - ((startY + currY) * 0.5)) / Math.cos(degrees))

        let dxRight = Math.abs((xDist - (startX + currX) * 0.5) / Math.cos(-degrees + Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(degrees))
        
        if(dxLeft < dyBottom) {
          let leftHeight = (startY + currY) * 0.5 + (startX + currX) * 0.5 * Math.tan(-degrees + Math.PI/2)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (xDist - ((startX + currX) * 0.5)) * Math.tan(-degrees + Math.PI/2)
            clip = `polygon(
              0% ${leftHeight/yDist * 100}%,
              100% ${rightHeight/yDist * 100}%,
              100% 0%,
              ${cornerDist * 2}px 0%,
              ${cornerDist * 2}px ${cornerDist * 2}px,
              0% ${cornerDist * 2}px)`

              stickerFlip.style.transformOrigin = `50% ${(rightHeight + leftHeight)/2}px`
              stickerFlip.style.transform = `scale(1, ${yScale}) rotate(${angle2 * 2 + 90}deg)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees)
            clip = `polygon(
              0% ${leftHeight/yDist * 100}%,
              ${topWidth/xDist * 100}% 0%,
              ${cornerDist * 2}px 0%,
              ${cornerDist * 2}px ${cornerDist * 2}px,
              0% ${cornerDist * 2}px)`

            stickerFlip.style.transformOrigin = `${topWidth/2}px ${leftHeight/2}px`
            stickerFlip.style.transform = `scale(1, ${yScale}) rotate(${angle2 * 2 + 90}deg)`
          }
        } else {
          let bottomWidth = (startX + currX) * 0.5 - (yDist - ((startY + currY) * 0.5)) * Math.tan(degrees)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (xDist - ((startX + currX) * 0.5)) * Math.tan(-degrees + Math.PI/2)
            clip = `polygon(
              ${bottomWidth/xDist * 100}% 100%,
              100% ${rightHeight/yDist * 100}%,
              100% 0%,
              ${cornerDist * 2}px 0%,
              ${cornerDist * 2}px ${cornerDist * 2}px,
              0% ${cornerDist * 2}px,
              0% 100%,
              ${bottomWidth/xDist * 100}% 100%)`

              stickerFlip.style.transformOrigin = `${xDist - (xDist - bottomWidth)/2}px ${yDist - (yDist - rightHeight)/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle2 * 2 + 90}deg)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees)
            clip = `polygon(
              ${bottomWidth/xDist * 100}% 100%, 
              ${topWidth/xDist * 100}% 0%, 
              ${cornerDist * 2}px 0%, 
              ${cornerDist * 2}px ${cornerDist * 2}px,
              0% ${cornerDist * 2}px,
              0% 100%,
              ${bottomWidth/xDist * 100}% 100%)`

              stickerFlip.style.transformOrigin = `${(topWidth + bottomWidth)/2}px 50%`
              stickerFlip.style.transform = `scale(${xScale}, 1) rotate(${angle2 * 2 - 90}deg)`
          }
        }
      }else if(degrees < 0 && degrees >= Math.PI / -2 && Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount) {
        let rightDist = Math.abs(xDist / Math.cos(-degrees))
        let upDist = Math.abs(yDist / Math.cos(Math.PI/2 + degrees))
        dist = Math.min(rightDist, upDist)
        xScale = 1
        yScale = -1

        angle = -radToDeg(degrees)-45
        angle2 = radToDeg(degrees)+45

        let dxLeft = Math.abs(((startX + currX) * 0.5) / Math.cos(Math.PI/2 + degrees))
        let dyBottom = Math.abs((yDist - ((startY + currY) * 0.5)) / Math.cos(-degrees))

        let dxRight = Math.abs((xDist - ((startX + currX) * 0.5)) / Math.cos(Math.PI/2 + degrees))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(-degrees))
        
        if(dxLeft < dyTop) {
          let leftHeight = (startY + currY) * 0.5 - (startX + currX) * 0.5 * Math.tan(Math.PI/2 + degrees)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (xDist - ((startX + currX) * 0.5)) * Math.tan(Math.PI/2 + degrees)
            clip = `polygon(
              0% ${leftHeight/yDist * 100}%,
              0% ${-cornerDist}px,
              ${xDist + cornerDist}px ${-cornerDist}px,
              ${xDist + cornerDist}px 100%,
              100% 100%,
              100% ${rightHeight/yDist * 100}%)`

              stickerFlip.style.transformOrigin = `50% ${(leftHeight + rightHeight)/2}px`
              stickerFlip.style.transform = `scale(1, ${yScale}) rotate(${angle * 2 - 90}deg)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (yDist - ((startY + currY) * 0.5)) * Math.tan(-degrees)
            clip = `polygon(
              0% ${leftHeight/yDist * 100}%,
              0% ${-cornerDist}px,
              ${cornerDist}px ${-cornerDist}px,
              ${cornerDist}px 100%,
              ${bottomWidth/xDist * 100}% 100%)`

              stickerFlip.style.transformOrigin = `${bottomWidth/2}px ${yDist - (yDist - leftHeight)/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 - 90}deg)`
          }
        } else {
          let topWidth = (startX + currX) * 0.5 - (startY + currY) * 0.5 * Math.tan(-degrees)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (xDist - ((startX + currX) * 0.5)) * Math.tan(Math.PI/2 + degrees)
            clip = `polygon(
              ${topWidth/xDist * 100}% 0%,
              0% 0%,
              0% ${-cornerDist}px,
              ${xDist + cornerDist}px ${-cornerDist}px,
              ${xDist + cornerDist}px 100%,
              100% 100%,
              100% ${rightHeight/yDist * 100}%)`
              
              stickerFlip.style.transformOrigin = `${topWidth + (xDist - topWidth)/2}px ${(yDist - (yDist - rightHeight))/2}px`
              stickerFlip.style.transform = `scale(-1, 1) rotate(${angle * 2 + 90}deg)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (yDist - ((startY + currY) * 0.5)) * Math.tan(-degrees)
            clip = `polygon(
              ${topWidth/xDist * 100}% 0%,
              ${topWidth/xDist * 100}% ${-cornerDist}px,
              ${xDist + cornerDist}px ${-cornerDist}px,
              ${xDist + cornerDist}px 100%,
              ${bottomWidth/xDist * 100}% 100%)`

              stickerFlip.style.transformOrigin = `${(bottomWidth + topWidth)/2}px 50%`
              stickerFlip.style.transform = `scale(-1, 1) rotate(${angle * 2 + 90}deg)`
          }
        }
      } else if(degrees >= Math.PI / 2 && degrees <= Math.PI && Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount) {
        let leftDist = Math.abs(xDist / Math.cos(-degrees + Math.PI))
        let downDist = Math.abs(yDist / Math.cos(degrees - Math.PI/2))
        dist = Math.min(leftDist, downDist)
        xScale = -1
        
        let angle = -radToDeg(degrees)+135

        let dxLeft = Math.abs(((startX + currX) * 0.5) / Math.cos(degrees - Math.PI/2))
        let dyBottom = Math.abs((yDist - ((startY + currY) * 0.5)) / Math.cos(-degrees + Math.PI))

        let dxRight = Math.abs((xDist - ((startX + currX) * 0.5)) / Math.cos(degrees - Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(-degrees + Math.PI))
        
        if(dxLeft < dyTop) {
          let leftHeight = (startY + currY) * 0.5 - (startX + currX) * 0.5 * Math.tan(degrees - Math.PI/2)
          if(dxRight < dyBottom) {
            let rightHeight = (startY + currY) * 0.5 + (xDist - ((startX + currX) * 0.5)) * Math.tan(degrees - Math.PI/2)
            clip = `polygon(
              0% ${leftHeight/yDist * 100}%,
              100% ${rightHeight/yDist * 100}%,
              100% ${yDist + cornerDist}px,
              ${-cornerDist}px ${yDist + cornerDist}px,
              ${-cornerDist}px 0%,
              0% 0%)`

              stickerFlip.style.transformOrigin = `50% ${(leftHeight + rightHeight)/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 - 90}deg)`
          } else {
            let bottomWidth = (startX + currX) * 0.5 + (yDist - ((startY + currY) * 0.5)) * Math.tan(-degrees + Math.PI)
            clip = `polygon(
              0% 0%,
              0% ${leftHeight/yDist * 100}%,
              ${bottomWidth/xDist * 100}% 100%,
              100% 100%,
              100% ${yDist + cornerDist}px,
              ${-cornerDist}px ${yDist + cornerDist}px,
              ${-cornerDist}px 0%,
              0% 0%)`

              stickerFlip.style.transformOrigin = `${bottomWidth/2}px ${yDist - (yDist - leftHeight)/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 - 90}deg)`
            }
          } else {
            let topWidth = (startX + currX) * 0.5 - (startY + currY) * 0.5 * Math.tan(-degrees + Math.PI)
            if(dxRight < dyBottom) {
              let rightHeight = (startY + currY) * 0.5 + (xDist - ((startX + currX) * 0.5)) * Math.tan(degrees - Math.PI/2)
              clip = `polygon(
                0% 0%,
                ${topWidth/xDist * 100}% 0%,
                100% ${rightHeight/yDist * 100}%,
                100% 100%,
                0% 100%)`

                stickerFlip.style.transformOrigin = `${xDist - (xDist - topWidth)/2}px ${rightHeight/2}px`
                stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 - 90}deg)`
            } else {
            let bottomWidth = (startX + currX) * 0.5 + (yDist - ((startY + currY) * 0.5)) * Math.tan(-degrees + Math.PI)
            clip = `polygon(
              ${-cornerDist}px 0%,
              ${topWidth/xDist * 100}% 0%,
              ${bottomWidth/xDist * 100}% 100%,
              ${bottomWidth/xDist * 100}% ${yDist + cornerDist}px,
              ${-cornerDist}px ${yDist + cornerDist}px)`

              stickerFlip.style.transformOrigin = `${(bottomWidth + topWidth)/2}px 50%`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 - 90}deg)`
            }
          }

      } else if(degrees > -Math.PI && degrees <= -Math.PI/2 && Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount) {
        let leftDist = Math.abs(xDist / Math.cos(degrees + Math.PI))
        let upDist = Math.abs(yDist / Math.cos(-degrees - Math.PI/2))
        dist = Math.min(leftDist, upDist)
        xScale = -1
        yScale = -1

        let angle = -radToDeg(degrees)-135

        let dxLeft = Math.abs((startX + currX) * 0.5 / Math.cos(-degrees - Math.PI/2))
        let dyBottom = Math.abs((yDist - ((startY + currY) * 0.5)) / Math.cos(degrees + Math.PI))

        let dxRight = Math.abs((xDist - ((startX + currX) * 0.5)) / Math.cos(-degrees - Math.PI/2))
        let dyTop = Math.abs((startY + currY) * 0.5 / Math.cos(degrees + Math.PI))
        
        if(dxLeft < dyBottom) {
          let leftHeight = (startY + currY) * 0.5 + (startX + currX) * 0.5 * Math.tan(-degrees - Math.PI/2)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (xDist - ((startX + currX) * 0.5)) * Math.tan(-degrees - Math.PI/2)
            clip = `polygon(
              ${-cornerDist}px ${-cornerDist}px,
              100% ${-cornerDist}px,
              100% ${rightHeight/yDist * 100}%,
              0% ${leftHeight/yDist * 100}%,
              ${-cornerDist}px ${leftHeight/yDist * 100}%)`

              stickerFlip.style.transformOrigin = `50% ${yDist - (yDist - (leftHeight + rightHeight)/2)}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 + 90}deg)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees + Math.PI)
            clip = `polygon(
              ${-cornerDist}px ${-cornerDist}px,
              100% ${-cornerDist}px,
              100% 0%,
              ${topWidth/xDist * 100}% 0%,
              0% ${leftHeight/yDist * 100}%,
              0% 100%,
              ${-cornerDist}px 100%)`

              stickerFlip.style.transformOrigin = `${topWidth/2}px ${leftHeight/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 + 90}deg)`
          }
        } else {
          let bottomWidth = (startX + currX) * 0.5 - (yDist - ((startY + currY) * 0.5)) * Math.tan(degrees + Math.PI)
          if(dxRight < dyTop) {
            let rightHeight = (startY + currY) * 0.5 - (xDist - ((startX + currX) * 0.5)) * Math.tan(-degrees - Math.PI/2)
            clip = `polygon(
              ${-cornerDist}px 0%,
              100% 0%,
              100% ${rightHeight/yDist * 100}%,
              ${bottomWidth/xDist * 100}% 100%,
              ${-cornerDist}px 100%)`

              stickerFlip.style.transformOrigin = `${xDist - (xDist - bottomWidth)/2}px ${yDist - (yDist - rightHeight)/2}px`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 + 90}deg)`
          } else {
            let topWidth = (startX + currX) * 0.5 + (startY + currY) * 0.5 * Math.tan(degrees + Math.PI)
            clip = `polygon(
              ${-cornerDist}px ${-cornerDist}px,
              ${topWidth/xDist * 100}% ${-cornerDist}px,
              ${topWidth/xDist * 100}% 0%, 
              ${bottomWidth/xDist * 100}% 100%, 
              ${-cornerDist}px 100%)`

              stickerFlip.style.transformOrigin = `${xDist - (xDist - (bottomWidth + topWidth)/2)}px 50%`
              stickerFlip.style.transform = `scale(1, -1) rotate(${angle * 2 + 90}deg)`
          }
        }
      }

      let percent = Math.pow(Math.pow(currY - startY, 2) + Math.pow(currX - startX, 2), 0.5) / dist * 100

      if(Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount) {
        stickerFlip.style.display = 'block'
      } else {
        stickerFlip.style.display = 'none'
      }
      sticker.style.clipPath = Math.pow(currX - startX, 2) + Math.pow(currY - startY, 2) > moveAmount ? clip : 'none'
    }

    document.addEventListener('mousemove', mouseMove)
  
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMove)
      sticker.style.clipPath = 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 100% 0%)'
      stickerFlip.style.display = 'none'
      stickerShadow.style.background = 'none'
    }, {once : true})
  })
}

function radToDeg(rad) {
  return rad * 180/Math.PI
}