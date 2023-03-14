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

module.exports = Conversation = React.createClass({
    
  mixins:[
    AppSettingsMixin,
    StreamMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    EventListenerMixin('newpostbyuser')
  ],
  getInitialState: function() {
    return {
      username: this.props.params.username,
      postid: parseInt(this.props.params.postid),
      data: [], 
      postIdentifiers: {},
      loading: true
    };
  },
  updatePosts: function(outdatedLimit) {
      
    //console.log(this.state.username+":post"+this.state.postid)
    
    if (!outdatedLimit) {outdatedLimit=this.state.appSettings.pollInterval/2;}

    var thisComponent = this;
    var thisUsername = this.state.username;

    var goUpConversation = function (post) {
      
      if(!post) return;
      
      if (post.isReply()) {

        post.doPostRepliedTo(function(otherpost){
          if(otherpost){
            goUpConversation(otherpost);
          }else{
            thisComponent.addPost(post);
        
            thisComponent.setStateSafe({loading: false});

            post.doReplies(doRepliesRecursive);
          }
        });

      } else {
        
        thisComponent.addPost(post);
        
        thisComponent.setStateSafe({loading: false});

        post.doReplies(doRepliesRecursive);

      }
    }

    var doRepliesRecursive = function (replies) {

      for (var i in replies) {
        replies[i].doReplies(doRepliesRecursive);
        thisComponent.addPost(replies[i]);
        //console.log(replies[i].getContent())
      }

    };

    Freech.getUser(this.state.username).doPost(this.state.postid,goUpConversation,{outdatedLimit: outdatedLimit, logfunc: function(log){console.log(log)}});

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
            Conversation
          </ListGroupItem>
        } data={this.state.data} loading={this.state.loading} activeAccount={this.props.activeAccount}/>
        );
  }
});