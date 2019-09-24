import courses from '../data/courses';
import React from 'react';
import { DragDropContext } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { Modal, Button } from 'react-materialize';
import DragButton from './DraggableCourseButton';
import ModalCourseDescription from './ModalCoursePopup';

//The Cart class represents the 'cart' section of the UI, and contains
//functions to export to PDF.
//Cart takes in as a prop the current course list, as determined by courses.js
class Courses extends React.Component{

  constructor(props) {
      super(props);
      console.log("hi");
      this.state = {
        popupOpen: false
      }
  }

  // updates the state to have description open for course passed in
  // actual rendering done in render()
  openCourseDescription(info){
    this.setState(state => ({
          courseInfo: info,
          popupOpen: true
      }));
  }

  closeCourseDescription(){
    this.setState(state => ({
          popupOpen: false
      }));
  }

  render(){
    var query = this.props.search.toLowerCase();
    return (
      <div>
          {this.state.popupOpen && <ModalCourseDescription addCourseToCart = {this.props.addCourseToCart}
                                  removeCourseFromCart = {this.props.removeCourseFromCart}
                                  coursesInCart={this.props.coursesInCart}
                                  courseInfo={this.state.courseInfo}
                                  onCloseEnd = {this.closeCourseDescription.bind(this)}/>
          }
          <div class="flexbox">
              {courses.map(({ dept, number, title, description, prereqs }) => (
                  <div key={number.toString()}>
                      { ((dept.toLowerCase()+" "+number.toString()).includes(query)||
                        title.toLowerCase().includes(query)||
                        description.toLowerCase().includes(query)) &&
                        <div>
                            <DragButton key={1}
                                        inCart={this.props.coursesInCart.includes(number.toString())}
                                        name={dept + " " + number.toString()} id={number.toString()}
                                        course=<button>hi</button>
                                        handleDrop={(e)=> this.props.addCourseToCart(e)}
                                        onClick={()=>this.openCourseDescription([dept,number,title,description,prereqs])}/>
                        </div>
                      }
                  </div>
              ))}
          </div>
      </div>
    );
  }

}
export default Courses; // the cart component as a whole is a drop target for courses
