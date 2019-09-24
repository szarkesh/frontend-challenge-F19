import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {DragSource } from 'react-dnd'

// The DragButton class generates a draggable course button, given
// the text on the button and the button's desired onClick function
// This class is called from Courses.js

const courseSource = {
  beginDrag(props) {
    return props.course
  },

  endDrag(props, monitor, component){
    if(!monitor.didDrop()){ // if the cart doesn't see a drop (eg: course is dropped elsewhere) do nothing.
      return;
    }
    return props.handleDrop(props.id)
  }
}

function collect(connect, monitor){
  return{
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class DragButton extends React.Component{
  render(){
    const {isDragging, connectDragSource, course} = this.props;
    return connectDragSource(
        <button className="courseElementButton" onClick={this.props.onClick}>{this.props.name}{this.props.inCart && <span> &#10004; </span>}</button>
    );
  }
}
export default DragSource('course', courseSource, collect)(DragButton);
