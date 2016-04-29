import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import State from '../utils/FabnaviStateMachine';
import { Link, Route, RouteHandler} from 'react-router';
import createProject from '../templates/CreateProject.jade';

/**
 *  CreateProjectがクリックされたときに呼び出されるView
 *  フォームに入力された値を基にActionを投げる
 */
class CreateProject extends React.Component {

  constructor(props){
    super(props)
  }

  _onChange(){

  }

  getInitialState(){
    return {
      name : "",
      description : "",
    };
  }

  getDefaultProps(){
    return {
    };
  }

  handleChange(e){

  }

  handleNameChange(e){
        this.setState({ name : e.target.value });
  }

  handleDescriptionChange(e){
    this.setState({ description : e.target.value });
  }

  handleSubmit(e){
    ProjectActionCreator.createProject({
      name : this.state.name,
      description : this.state.description,
      contentAttributesType : "Content::PhotoList"
    });
  }

  render(){
    return createProject()
  }

  componentWillMount(){

  }

  componentDidMount(){
    State.reload();
  }

  componentWillUpdate(){
    return {
    };
  }

  componentDidUpdate(){
    return {
    };
  }

  componentWillUnmount(){
  }

}

export default CreateProject;
