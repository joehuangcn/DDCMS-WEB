import React,{Component} from 'react';
import img from '../../util/404.png';
class NotFound extends Component{
constructor(props){
  super(props);
  this.state={animated: '' }
}
enter = () => {
    this.setState({animated: 'hinge'})
  };

  render(){
    return(
      <div>
        <div className="center" style={{height: '100%', background: '#ececec', overflow: 'hidden'}}>
             <img src={img} alt="404" className={`animated swing ${this.state.animated}`} onMouseEnter={this.enter} />
         </div>
      </div>
    );
  }
}
export default NotFound;
