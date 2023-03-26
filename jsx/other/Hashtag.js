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

module.exports = Hashtag = React.createClass({
    
  mixins:[
    AppSettingsMixin,
    StreamMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    EventListenerMixin('newpostbyuser')
  ],
  getInitialState: function() {
    return {
      hashtag: this.props.params.hashtag,
      data: [], 
      postIdentifiers: {},
      loading: true
    };
  },
  updatePosts: function(outdatedLimit) {
      
    //console.log(this.state.username+":post"+this.state.postid)
    
    if (!outdatedLimit) {outdatedLimit=this.state.appSettings.pollInterval/2;}

    var thisComponent = this;
    
    Freech.doHashtagPosts(this.state.hashtag,function(posts){
    
      thisComponent.setStateSafe({loading: false});
      
      for (var i in posts) {
        thisComponent.addPost(posts[i]);
        //console.log(posts[i].getContent())
      }
    
    },{outdatedLimit: outdatedLimit, logfunc: function(log){console.log(log)}});

  },
  componentDidMount: function() {

    this.updatePosts(2*this.state.appSettings.pollInterval);
    this.setInterval(this.updatePosts, this.state.appSettings.pollInterval*1000);

  },
  onnewpostbyuser: function (event) {
    
    //alert("got event")
    
    this.updatePosts();
    
  },
  render: function() {
      return (
          <Postboard header={
          <ListGroupItem>
            Hashtag
          </ListGroupItem>
        } data={this.state.data} loading={this.state.loading} activeAccount={this.props.activeAccount}/>
        );
  }
});