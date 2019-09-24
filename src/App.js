import React, { Component } from 'react'
import './App.css'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import DragButton from './components/DraggableCourseButton'
import DraggableCartComponent from './components/DraggableCartComponent'
import Nav from './components/Nav'
import Main from './components/Main'
import Cart from './components/Cart'

class App extends Component {
  dropItem(id){
      console.log("Item dropped");
  }
  render() {
    return (
      <div style={{width:'100%', overflow:'hidden'}}>
        <Nav />
        <div style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0 calc(1rem + 10%)',
          marginBottom: '10px',
        }}>
          <Main/>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App)
