// Alert polyfill for web using window.alert and window.confirm
const RCTAlertManager = {
  alertWithArgs: (args, callback) => {
    const { title, message, buttons } = args;
    
    if (buttons && buttons.length > 1) {
      // Multiple buttons - use confirm
      const result = window.confirm(`${title}\n${message}`);
      if (callback) {
        callback(result ? 0 : 1);
      }
    } else {
      // Single button - use alert
      window.alert(`${title}\n${message}`);
      if (callback) {
        callback(0);
      }
    }
  }
};

export default RCTAlertManager;