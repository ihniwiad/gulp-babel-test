import Selectors from './../utilities/selectors'


const FUNCTION_ATTR = Selectors.functionAttr


const getConfigFromAttr = ( elem, key ) => {
  if ( ! elem ) {
    return
  }

  let conf
  if ( key ) {
    conf = elem.getAttribute( `data-${key}-conf` )
  }
  else {
    conf = elem.getAttribute( `data-conf` )
  }

  if ( typeof conf !== 'undefined' && conf != null  ) {
    return ( new Function( 'return ' + conf ) )()
  }
  else {
    return {}
  }
}

const getTargetByAriaControls = ( trigger, closest ) => {
  const wrapper = typeof closest !== 'undefined' ? closest : document
  const targetId = trigger.getAttribute( 'aria-controls' )
  return wrapper.querySelector( `#${targetId}` )
}

const getTransitionDuration = ( elem ) => {
  let { transitionDuration } = window.getComputedStyle( elem )
  const floatTransitionDuration = Number.parseFloat( transitionDuration )
  if ( ! floatTransitionDuration ) {
    floatTransitionDuration = 0
  }
  return floatTransitionDuration * 1000
}

const getTriggerFromEvent = ( event ) => {
  return event.target.getAttribute( FUNCTION_ATTR ) != null ? event.target : event.target.closest( '[' + FUNCTION_ATTR + ']' )
}

const addClassNames = ( elem, classNames ) => {
  if ( classNames.indexOf( ' ' ) ) {
    const classNameList = classNames.split( ' ' )
    classNameList.forEach( ( className ) => {
      elem.classList.add( className )
    } )
  }
  else {
    elem.classList.add( classNames )
  }
}

const removeClassNames = ( elem, classNames ) => {
  if ( classNames.indexOf( ' ' ) ) {
    const classNameList = classNames.split( ' ' )
    classNameList.forEach( ( className ) => {
      elem.classList.remove( className )
    } )
  }
  else {
    elem.classList.remove( classNames )
  }
}

const triggerEvent = ( elem, eventName ) => {
    const event = document.createEvent( 'Event' )
    event.initEvent( eventName, true, true)
    elem.dispatchEvent( event )
}


// check if innerElem is positiones inside outerElem
const isPositionedInside = ( outerElem, innerElem ) => {
  return ( 
    innerElem.offsetLeft >= outerElem.offsetLeft
    && ( innerElem.offsetLeft + innerElem.offsetWidth ) <= ( outerElem.offsetLeft + outerElem.offsetWidth )
    && innerElem.offsetTop >= outerElem.offsetTop
    && ( innerElem.offsetTop + innerElem.offsetHeight ) <= ( outerElem.offsetTop + outerElem.offsetHeight )
  )
}

const DomFn = {
  getConfigFromAttr,
  getTargetByAriaControls,
  getTransitionDuration,
  getTriggerFromEvent,
  addClassNames,
  removeClassNames,
  triggerEvent,
  isPositionedInside,
}

export default DomFn