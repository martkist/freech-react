
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Glyphicon = ReactBootstrap.Glyphicon
  , OverlayTrigger = ReactBootstrap.OverlayTrigger
  , Tooltip = ReactBootstrap.Tooltip

var React = require('react');

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var PostContent = require('../common/PostContent.js');
var ReplyModalButton = require('../common/ReplyModalButton.js');
var RefreechModalButton = require('../common/RefreechModalButton.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');

module.exports = Post = React.createClass({
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    EventListenerMixin('profileupdatebyuser'),
    EventListenerMixin('avatarupdatebyuser')
  ],
  onprofileupdatebyuser: function(event){
    //console.log("catched event",this.state.username,event.detail)
    var profile =event.detail;
    if(profile.getUsername()==this.props.post.username){
      this.setState(function(state){
        state.fullname = profile.getField("fullname");
        return state;
      })
    }
    if(profile.getUsername()==this.state.refreechingUsername){
      this.setState(function(state){
        state.refreechingUserFullname = profile.getField("fullname");
        return state;
      })
    }
  },
  onavatarupdatebyuser: function(event){
    //console.log("catched event",this.state.username,event.detail)
    var avatar =event.detail;
    if(avatar.getUsername()==this.state.username){
      this.setState(function(state){
        state.avatar = avatar.getUrl();
        return state;
      })
    }
  },
  getInitialState: function() {
    
    return {
      username: this.props.post.username,
      avatar: "img/genericPerson.png", 
      fullname: "",
      timeAgo: "",
      refreechingUsername: this.props.post.username,
      refreechingUserFullname: this.props.post.username,
      refreechingUserAvatar: "img/genericPerson.png",
    };
  },
  updateTimeAgo: function() {
    var secondsAgo = Date.now()/1000-this.props.post.timestamp;

    var newTimeAgo = "";

    if (secondsAgo<45) {newTimeAgo="1m"}
    else if (secondsAgo<45*60) {newTimeAgo=Math.round(secondsAgo/60)+"m"}
    else if (secondsAgo<18*60*60) {newTimeAgo=Math.round(secondsAgo/60/60)+"h"}
    else if (secondsAgo<26*24*60*60) {newTimeAgo=Math.round(secondsAgo/24/60/60)+"d"}
    else if (secondsAgo<9*30.5*24*60*60) {newTimeAgo=Math.round(secondsAgo/30.5/24/60/60)+"mo"}
    else  {newTimeAgo=Math.round(secondsAgo/365/24/60/60)+"y"}

    this.setStateSafe({timeAgo: newTimeAgo});

  },
  componentDidMount: function () {
    
    var thisComponent = this;

    var post = Freech.getUser(this.props.post.username).getPost(this.props.post.id);
    
    if (post.isRefreech()) {
      
      post.getUser().doProfile(function(profile){
        thisComponent.setStateSafe({
          refreechingUsername: profile.getUsername(),
          refreechingUserFullname: profile.getField("fullname")
        });  
      });
      
      post.getUser().doAvatar(function(avatar){
        thisComponent.setStateSafe({
          refreechingUserAvatar: avatar.getUrl()
        });  
      });
      
      post=post.getRefreechedPost();
      
    }
      
    //console.log(this.props.post.username+":post"+this.props.post.id);
    post.getUser().doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      } 
    });
    
    post.getUser().doProfile(function(profile){
      thisComponent.setStateSafe({fullname: profile.getField("fullname")});  
    });

    this.updateTimeAgo();

    this.setInterval(this.updateTimeAgo,60000);
    
  },
  render: function() {
    
    var post = Freech.getUser(this.props.post.username).getPost(this.props.post.id);
    if(!post){
      return (
        <span/>
      )
    }
    var refreech = false;
    var refreechWithComment = false;
    var comment = "";
    
    if (post.isRefreech()) {
      refreech = true;
      if(post.isRefreechWithComment()){
        refreechWithComment=true;
        comment =  post.getContent();
      }
      post=post.getRefreechedPost();
    }
    
    if (post.isReply()) {
      var conversationLink = (
        <OverlayTrigger placement='left' overlay={
          <Tooltip id="view-conversation">View Conversation</Tooltip>
        }>
      <small><a href={"#/conversation/"+post.getUsername()+"/"+post.getId()} className="link-button-gray"><Glyphicon glyph="comment"/></a></small>
    </OverlayTrigger>
      );
    } else {
      var conversationLink = (<span/>);
    }
                                          
                                          
    if (!post.isRefreech()) {
      var replyLink = <OverlayTrigger placement='left' overlay={
          <Tooltip id="reply">Reply</Tooltip>
        }>
          <small>
            <ReplyModalButton replyUsername={post.getUsername()} replyPostId={post.getId()} activeAccount={this.props.activeAccount} originalMsg={post.getContent()} replyUserFullname={this.state.fullname}/>
          </small>
        </OverlayTrigger>
    } else {
      var replyLink = (<span/>);
    }
                                           
    
    var refreechLink = <OverlayTrigger placement='left' overlay={
        <Tooltip id="refreech">Refreech</Tooltip>
      }>
        <small>
          <RefreechModalButton refreechUsername={post.getUsername()} refreechPostId={post.getId()} activeAccount={this.props.activeAccount} originalMsg={post.getContent()} refreechUserFullname={this.state.fullname}/>
        </small>
      </OverlayTrigger>
    
    
    return (
      <ListGroupItem>
          <Row className="nomargin post-main">
            <Col xs={1} md={1} className="fullytight">
              <a href={"#/profile/"+post.getUsername()}>
                <img className="img-responsive" src={this.state.avatar}/>
              </a>
            </Col>
            <Col xs={11} md={11}>
              <Row>
                <Col xs={11} md={11}>
                  <strong>{this.state.fullname}</strong>
                </Col>
                <Col xs={1} md={1} className="fullytight">
                  <small>{this.state.timeAgo}</small>
                </Col>
              </Row>
              <PostContent content={post.getContent()}/>
            </Col>
          </Row>
          <Row className="nomargin">
            <Col xs={8} md={8} className="fullytight">
              {refreech && <small><em>
                refreeched by <img className="micro-avatar" src={this.state.refreechingUserAvatar} />{this.state.refreechingUserFullname}{refreechWithComment && ":"}
              </em></small>
              }
            </Col>
            <Col xs={2} md={2} className="fullytight text-align-right">
              {conversationLink}
            </Col>
            <Col xs={1} md={1} className="fullytight text-align-right">
              {replyLink}
            </Col>
            <Col xs={1} md={1} className="fullytight text-align-right">
              {refreechLink}
            </Col>
          </Row>
          {refreechWithComment && <Row>
            <Col xs={12} md={12}>
              <small><PostContent content={comment}/></small>
            </Col>
          </Row>
          }
      </ListGroupItem>
    );
  }
});

/*
<div className="post-avatar">
                    <img src={this.state.avatar}/>
                </div>
                <div className="post-bulk">
                    <div className="post-username">
                        <span className="post-fullname">{this.state.fullname} </span>
                        @{post.username} - {post.id}
                        
                    </div>
                    <div className="post-timestamp">{post.timestamp}</div>
                    <div className="post-content">{post.content}</div>
                </div>
                <hr/>
                
                */