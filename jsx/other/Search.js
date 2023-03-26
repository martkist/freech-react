var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');

var ImportAccountModalButton = require('../other/ImportAccountModalButton.js');

var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Input = ReactBootstrap.Input

module.exports = Settings = React.createClass({
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin
  ],

  getInitialState: function() {
    return {
      found: null,
      username: null,
      searching: false
    };
  },

  handleSearch: function (e) {
    e.preventDefault();
    thisComponent=this;

    const username = $(this.getDOMNode()).find(".search-username").val();
    thisComponent.setStateSafe(function(state){
        state.searching = true;
        state.username = username;
        state.found = null;
        return state;        
    });
    
    console.log("Searching for '%s'...", username);

    Freech.getUser(username).doProfile(function(profile){
        var found = profile !== null && profile.getAllFields() !== null;
        if (!found) {
            console.log("Couldn't find: '%s'", username);
        } else {
            console.log("Found '%s': %o", username, profile.getAllFields());
        }
        thisComponent.setStateSafe(function(state){
            state.searching = false;
            state.found = found;
            return state;        
        });
    });
  },
  render: function() {

    if (this.state.searching) {
        var profile = (
            <ListGroupItem><p className="text-center"><img src="img/bouncing_ball.gif"/></p></ListGroupItem>
        );
    } else if (this.state.found === true) {
        var profile = (
            <MiniProfile username={this.state.username} key={this.state.username} />
        );
    } else if (this.state.found === false) {
        var profile = (
            <ListGroupItem>Could not find user '{this.state.username}'!</ListGroupItem>
        );
    } else {
        var profile = (<span/>);
    }

    return (
        <ListGroup>
          <ListGroupItem>Search</ListGroupItem>
          <ListGroupItem>
            <form onSubmit={this.handleSearch} className='form-horizontal'>
              <Input type='text' label='Username' className="search-username" 
                     defaultValue={this.state.username}
                     labelClassName='col-xs-4' wrapperClassName='col-xs-8' />
              <Input type='submit' value='Search' wrapperClassName='col-xs-offset-10 col-xs-2'/>
            </form>
          </ListGroupItem>
          {profile}
        </ListGroup>
      );
  }
});