import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'
import {Modal} from 'react-materialize'
import flow from 'lodash/flow'

//The DraggableCartComponent class generates a draggable course button in
//the cart, given the text of the button as a prop (from cart.js)
//this class is called by Cart.js

//source for dragging
const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    }
  }
}

// determines the current target of the drag operation
const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = (findDOMNode(component, )).getBoundingClientRect()

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    props.moveCard(dragIndex, hoverIndex)

    monitor.getItem().index = hoverIndex
  }
}

class DraggableCartComponent extends React.Component{
  render(){
    const{ text, isDragging, connectDragSource, connectDropTarget } = this.props
    const opaque = isDragging ? 0 : 1;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(<button class = "cartElementButton" style={{opacity: opaque}}>{this.props.text}</button>)
      )
    )
  }
}

//uses flow class to allow for same object to be drag source and drag target
//since we need to drag these buttons over each other to change the order.
export default flow(
  DragSource(
    'cart',
    cardSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  ),

  DropTarget('cart', cardTarget, (connect) =>({
    connectDropTarget: connect.dropTarget(),
  }))
)(DraggableCartComponent)
