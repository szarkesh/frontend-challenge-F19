import React from 'react';
import {Modal, Button} from 'react-materialize';

const darkStyle = {
  background:"#eeeeee"
}

const lightStyle = {
  background:"#FAFAFA"
}

//generic http requester
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200){
                aCallback(anHttpRequest.responseText);
            }
        }
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    }
}

//Class representing the Modal popup that appears when the user clicks on a course
class ModalCourseDescription extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      subcourses: []
    }
  }

  //calls PennLabs API on component mount to get subcourse (class) information.
  componentDidMount(){
    var client=new HttpClient();
    var self = this;
    client.get('https://api.pennlabs.org/registrar/search?q=cis'+this.props.courseInfo[1], function(response) {
      var courses = JSON.parse(response)["courses"]
      console.log(courses);
      self.setState({
        subcourses:courses
      });
    });
  }

  //turns meetings field to human-readable string
  parseTime(meetings){
    if(!meetings){
      return "";
    }
    return meetings.meeting_days + " " + meetings["start_time"]+"-"+meetings["end_time"]
  }

  //turns instructors field to human-readable string
  parseInstructors(instructors){
    if(!instructors){
      return "";
    }
    var str = "";
    instructors.forEach(function(element) {
        str = str + element["name"] + ", ";
    });
    if(str.length==0){
      return str;
    }
    return str.substring(0,str.length-2);
  }

  render(){
    var dept, number, title, description, prereqs;
    ([dept, number, title, description,prereqs] = this.props.courseInfo);
    return (
        <Modal open={true} style={{maxHeight:"100%"}} options={{onCloseEnd:this.props.onCloseEnd}} id="modal1">
            <div class="courseDescription" style={{borderRadius: "5px"}}>
                <div class="leftRight">
                    <p> <b>{dept} {number}: {title}</b> </p>
                    {(prereqs!=undefined) && <p>{"Prerequisites: " + prereqs.toString()}</p>}
                </div>
                <p>{description} </p>
                <div style={{maxHeight:"250px",overflow:"scroll",margin:"20px"}}>
                    <table>
                        <tr>
                            <th>Type</th>
                            <th>Section</th>
                            <th>Instructor</th>
                            <th>Time</th>
                            <th>Credits</th>
                        </tr>
                        {this.state.subcourses.map(({activity_description, section_number, instructors, meetings, credits},index) => (
                            <tr style={index % 2 == 0 ? darkStyle : lightStyle} key={section_number}>
                                <td>{activity_description}</td>
                                <td> {section_number} </td>
                                <td>{this.parseInstructors(instructors)}</td>
                                <td>{this.parseTime(meetings[0])}</td>
                                <td> {credits} </td>
                            </tr>))}
                    </table>
                </div>
                {this.state.subcourses.length==0 &&
                  <div style={{marginBottom:"50px", textAlign:"center"}}> No sections to show :( </div>
                }
                <div style={{textAlign: "center"}}>
                    {this.props.coursesInCart.indexOf(number.toString())>=0
                        ? <button class="addRemoveButton" style={{backgroundColor: "#e74c3c"}} onClick={() => this.props.removeCourseFromCart(number.toString())}> Remove from cart</button>
                        : <button class="addRemoveButton" style={{backgroundColor: "#3498DB"}} onClick={() => this.props.addCourseToCart(number.toString())}> Add to cart</button>
                    }
                </div>
            </div>
        </Modal>
    );
  }
}

export default ModalCourseDescription;
