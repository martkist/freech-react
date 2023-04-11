var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');

var ImportAccountModalButton = require('../other/ImportAccountModalButton.js');
var GenerateAccountModalButton = require('../other/GenerateAccountModalButton.js');
var ExportAccountModalButton = require('../other/ExportAccountModalButton.js');
var LogoutModalButton = require('../other/LogoutModalButton.js');

var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Input = ReactBootstrap.Input

module.exports = Accounts = React.createClass({
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin 
  ],
  render: function() {
    
    var thisComponent = this; 

    return (
        <ListGroup>
          <ListGroupItem>Accounts</ListGroupItem>
          <ListGroupItem>
            <ImportAccountModalButton/>
            <GenerateAccountModalButton/>
            <hr/>
            {this.props.accounts.map(function(acc,index) {
              //console.log(acc,index)
              if (acc.status == "unconfirmed") {
                var spinner = (<img src="img/bouncing_ball.gif"/>);
              }
              
              return (
                <div key={"miniprofile:"+acc.name}>
                  <Button disabled>{acc.status}{spinner}</Button>
                  <MiniProfile username={acc.name} pollIntervalProfile={thisComponent.props.pollIntervalProfile}/>
                  <p>                    
                    <ExportAccountModalButton username={acc.name} accountStatus={acc.status}/>
                    <LogoutModalButton username={acc.name} accountStatus={acc.status}/>
                  </p>
                </div>
              );
            })}
          </ListGroupItem>
        </ListGroup>
      );
  }
});