
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , ListGroup = ReactBootstrap.ListGroup
  , Nav = ReactBootstrap.Nav
  , NavItem = ReactBootstrap.NavItem
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon

var React = require('react');
var Router = require('react-router');
var Route = Router.Route; var DefaultRoute = Router.DefaultRoute; var RouteHandler = Router.RouteHandler; var Link = Router.Link;

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var ProfileMixin = require('../common/ProfileMixin.js');

var FollowButton = require('../common/FollowButton.js');
var EditProfileModalButton = require('../profile/EditProfileModalButton.js');
var EditAvatarModalButton = require('../profile/EditAvatarModalButton.js');

module.exports = Profile = React.createClass({
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    ProfileMixin
  ],
  copyMartkistAddress: function(e) {
    navigator.clipboard.writeText(this.state.martkist)
    .then(() => {
      const copyButton = document.querySelector('.martkist-address');
      copyButton.classList.add('clicked');
      setTimeout(() => {
        copyButton.classList.remove('clicked');
      }, 1000);
      console.log('Text copied to clipboard');
    })
    .catch((error) => {
      console.error('Error copying text: ', error);
    });
  },
  render: function() {
    
    var routeprefix = "#/profile/"+(this.props.params.username ? this.props.params.username+"/" : "")
    
    var route = this.props.location.pathname.split("/").filter(function(s){
      return s!="";
    });
        
    var isOnTimeline = !route[2] || route[2]=="timeline";
    var isOnMentions = route[2]=="mentions";
    var isOnFollowings = route[2]=="followings";
        
    return (
      <ListGroup fill>
        <ListGroupItem>
            <Row className="nomargin">
              <Col xs={3} md={3} className="fullytight">
                <img className="img-responsive" src={this.state.avatar}/>
                <br/>
                <EditAvatarModalButton 
                  activeAccount={this.props.activeAccount} 
                  username={this.state.username}
                  avatar={this.state.avatar}
                />
                <FollowButton activeAccount={this.props.activeAccount} username={this.state.username}/>
              </Col>
              <Col xs={8} md={8}>
                <h4 className="nomargin-top">{this.state.fullname}<small> {'@'+this.state.username}</small></h4>
                <div className="martkist-address-container">
                  <img className="martkist-address" src="img/martkist_logo_horizontal.png" onClick={this.copyMartkistAddress} />
                  <span className="tooltip-text">{this.state.martkist}</span>
                </div>
                <p className="text-center">{this.state.location}</p>
                <p className="text-center">{this.state.bio}</p>
                <p className="text-center"><a href={this.state.url}>{this.state.url}</a></p>
                <EditProfileModalButton 
                  activeAccount={this.props.activeAccount} 
                  username={this.state.username}
                  fullname={this.state.fullname}
                  martkist={this.state.martkist}
                  location={this.state.location}
                  bio={this.state.bio}
                  url={this.state.url}
                />
              </Col>
              <Col xs={1} md={1} className="fullytight text-align-right"></Col>
            </Row>
        </ListGroupItem>
        <ListGroupItem className="fullytight_all">
          <ButtonGroup justified>
            <Button href={routeprefix+"timeline"} bsStyle={isOnTimeline ? 'primary' : 'default'}><Glyphicon glyph="list"/></Button>
            <Button href={routeprefix+"followings"} bsStyle={isOnFollowings ? 'primary' : 'default'}><Glyphicon glyph="eye-open"/></Button>
            <Button href={routeprefix+"mentions"} bsStyle={isOnMentions ? 'primary' : 'default'}><Glyphicon glyph="comment"/></Button>
          </ButtonGroup>
        </ListGroupItem>
          {this.props.children && React.cloneElement(this.props.children, {
            activeAccount:this.props.activeAccount
          })}
      </ListGroup>
    );
  }
});