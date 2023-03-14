var React = require('react');
var Postboard = require("../common/Postboard.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

module.exports = Timeline = React.createClass({
    
  mixins:[
    StreamMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin,
    EventListenerMixin('scrolledtobottom'),
    EventListenerMixin('newpostbyuser')
  ],
  getInitialState: function() {
    return {
      username: (this.props.params.username ? this.props.params.username : this.props.activeAccount),
      data: [], 
      postIdentifiers: {},
      postCount: 30,
      loading: true
    };
  },
  updatePosts: function(outdatedLimit) {

      //console.log("updating " + this.state.username)
      
    if (!outdatedLimit) {outdatedLimit=this.state.appSettings.pollInterval/2;}

    var thisComponent = this;
    var thisUsername = this.state.username;

    var count = 0;
    
    Freech.getUser(this.state.username).doLatestPostsUntil(function(post){

      //console.log("updating "+count);
      
      thisComponent.setStateSafe({loading: false});
      
      if (post!==null) {
        if(count++>=thisComponent.state.postCount) {
          return false;
        } else {
          thisComponent.addPost(post);
        }
      } else {
        return false;
      }

    },{outdatedLimit: outdatedLimit});

  },
  componentDidMount: function() {

      this.updatePosts(2*this.state.appSettings.pollInterval);
      this.setInterval(this.updatePosts, this.state.appSettings.pollInterval*1000);
      
  },
  onscrolledtobottom: function () {

    this.setStateSafe(function(previousState, currentProps){
      previousState.postrange += 10;
      return previousState;
    },function(){
      this.updatePosts(2*this.state.appSettings.pollInterval);
    });

  },
  onnewpostbyuser: function (event) {
    
    //alert("got event")
    
    if(this.state.username==event.detail.getUsername()) {
       this.updatePosts();
    }
    
  },
  render: function() {
      return (
          <Postboard data={this.state.data} loading={this.state.loading} activeAccount={this.props.activeAccount}/>
        );
  }
});