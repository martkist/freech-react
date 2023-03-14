module.exports = AppSettingsMixin = {
  getInitialState: function() {
    
    var state = {};
    
    if (!localStorage.getItem("freech-react-settings")) {
    
      state.appSettings = {
        
        pollInterval:60,
        pollIntervalProfile: 3600,
        ignoredUsers: "nobody",
        host: "http://user:pwd@localhost:28332"
      
      };
    
    } else {
      
      state.appSettings = JSON.parse(localStorage.getItem("freech-react-settings"));
    
    }
    
    //console.log(state);
    
    return state;
    
  },
  componentDidMount: function() {
    window.addEventListener("appsettingschanged", this.onappsettingschanged);
  },
  componentWillUnmount: function() {
    window.removeEventListener("appsettingschanged", this.onappsettingschanged);
  },
  onappsettingschanged: function(event) {
    
    this.setState({appSettings: event.detail});
  
  }
  
};