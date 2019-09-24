import React from 'react'
import Cart from './Cart.js'
import Courses from './Courses'
import {Modal, Button} from 'react-materialize'

//Main class to represent courses and handle showing descriptions, dragging
//courses to the cart
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popup: false,
            courseClicked: 0,
            coursesInCart: [],
            removeButtons: [],
            credits: [],
            search: "",
        };

    }

    //adds a course, given by its number, to the cart
    addCourseToCart(number){
      if(this.state.coursesInCart.indexOf(number)>=0){ // if already in cart return
        return;
      }
      var current = this.state.coursesInCart;
      current.push(number)
      this.setState(state => ({
            coursesInCart: current
        }));
    }

    //removes a course, given by its number, from the cart
    removeCourseFromCart(number){
        this.setState(state => ({
              coursesInCart: this.state.coursesInCart.filter(i => i != number)
          }));
    }

    //updates the search query state and closes any open descriptions when search
    //query changed
    handleSearchChange(event){
      this.setState({popup:false, courseClicked:0, search: event.target.value});
      this.forceUpdate()
    }

    //renders the course cart, search bar, and course list
    render(){
        return(
          <div>
            <Cart courses={this.state.coursesInCart} key={this.state.coursesInCart} onChange={this.removeCourseFromCart.bind(this)}/>
            <div class="search">
                <div style={{fontWeight: 'bold'}}> Available courses: </div>
                <input style={{width:"200px", height:'1em', fontSize: '1em', padding: '5px 10px', marginBottom: '5px'}} type="text" placeholder="Filter courses..." onChange={this.handleSearchChange.bind(this)}/>
            </div>
            <Courses search={this.state.search} coursesInCart={this.state.coursesInCart} addCourseToCart = {this.addCourseToCart.bind(this)} removeCourseFromCart = {this.removeCourseFromCart.bind(this)}/>
          </div>

        )

    }
}
export default Main;
