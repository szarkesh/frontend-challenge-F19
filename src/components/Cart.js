import React from 'react'
import courses from '../data/courses'
import jsPDF from 'jspdf'
import { DropTarget } from 'react-dnd'
import DraggableCartComponent from './DraggableCartComponent'


//collect function for dragging
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem()
  }
}

//The Cart class represents the 'cart' section of the UI, and contains
//functions to export to PDF.
//Cart takes in as a prop the current course list, as determined by courses.js
class Cart extends React.Component {

    //takes in course list when instantiated
    constructor(props) {
      super(props);
      this.state = {
        courseList: props.courses,
      };
    }


    //for repositioning -- movecard reorders the array containing the
    //course numbers given the index of the course being dragged and the
    //index of the course it is being dragged over.
    moveCard(dragIndex, hoverIndex) {
      const dragCard = this.state.courseList[dragIndex]
      const currentOrder = this.state.courseList;
      var cardToPutBack = currentOrder.splice(dragIndex, 1);
      currentOrder.splice(hoverIndex, 0, cardToPutBack[0]);
      this.setState(state => ({
        courseList: currentOrder
      }));

    }

    // generates and saves a PDF file based on the current course cart
    export () {
      const {
        courseList
      } = this.state;

      if (courseList.length == 0) {
        return;
      }
      var doc = new jsPDF();
      doc.setFontType("bold");
      doc.text('Course List', 20, 20);
      doc.setFontType("normal");
      var y = 35;

      courseList.forEach(function(course) {

        //grab the course from course data corresponding to the number in the course list
        var courseInfo = courses.find(obj => {
          return obj.number.toString() == course
        })
        var splitTitle = doc.splitTextToSize(courseInfo.description, 180);

        //loop thru each line and output while increasing the vertical space
        doc.setFontSize(15);
        doc.text(20, y, "CIS " + course + ": " + courseInfo.title);
        y = y + 5;
        doc.setFontSize(10);
        for (var c = 0, stlength = splitTitle.length; c < stlength; c++) {
          doc.text(20, y, splitTitle[c]);
          y = y + 4;

        }
        doc.setDrawColor(200, 200, 200);
        doc.line(20, y, 160, y); // draws line separator between courses
        y = y + 8;

        if (y > 240) { // if spills over to next page, go to next page
          y = 35;
          doc.addPage();
        }

      })
      doc.save('courses.pdf');
    }

  render(){ // renders the course cart
      const {connectDropTarget, hovered, item} = this.props
      const backgroundColor = hovered ? 'lightgreen' : 'white' ;
      this.moveCard = this.moveCard.bind(this);
      var coursesToShow = [];
      for (var i=0; i<this.state.courseList.length; i++){
        const getCourse = courses.filter(course => course.number.toString() == this.state.courseList[i])[0];
        coursesToShow.push(getCourse)
      }
      var header;
      if(this.state.courseList.length==0){
        header = <div>
                    <h4>Course Cart</h4>
                    <p>Your cart is currently empty! Drag courses here to add them, or click to see descriptions.</p>
                  </div>
      }
      else{
        header = <div class="leftRight">
                    <b>Course Cart</b>
                    <div style={{marginLeft: "50px", color: "gray"}}> (drag courses around to reorder your preferences) </div>
                  </div>
      }
      return connectDropTarget(
        <div style={{
          marginTop: '1.5rem',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          background: backgroundColor,
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
            <div>
                {header}
                {coursesToShow.map(({ dept, number, title, description },i) => (
                    <div key={number.toString()}>
                        <div class= "cart">
                            <div style={{color: 'gray', fontSize:'0.8em'}}>{i+1}</div>
                            <DraggableCartComponent
                                  key = {number.toString()}
                                  index = {i}
                                  id = {number.toString()}
                                  text = {dept + " " + number + ": " + title}
                                  moveCard = {this.moveCard}
                            />
                            <button class = "removeButton" onClick= {() => this.props.onChange(number.toString())}> &times; </button>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <button class = "exportButton" onClick={() => this.export()}> Export Course List &rarr;</button>
            </div>
        </div>
      )
    }
  }

export default DropTarget('course', {}, collect)(Cart) // the cart component as a whole is a drop target for courses
