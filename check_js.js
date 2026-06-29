// Mock DOM for JavaScriptCore testing
var window = this;
window.onerror = null;
window.addEventListener = function() {};
window.scrollTo = function() {};
window.location = { reload: function() {} };
window.setInterval = function() {};

var document = {
  addEventListener: function() {},
  documentElement: { 
    style: { 
      setProperty: function() {}, 
      getPropertyValue: function() { return ''; } 
    } 
  },
  getElementById: function(id) {
    return {
      addEventListener: function() {},
      classList: { 
        add: function() {}, 
        remove: function() {}, 
        contains: function() { return false; },
        toggle: function() {}
      },
      setAttribute: function() {},
      value: '',
      style: { 
        setProperty: function() {}, 
        removeProperty: function() {}, 
        cssText: '' 
      },
      reset: function() {},
      querySelectorAll: function() { return []; },
      querySelector: function() { return null; },
      appendChild: function() {}
    };
  },
  createElement: function() {
    return {
      style: {},
      classList: { 
        add: function() {}, 
        remove: function() {}, 
        toggle: function() {}, 
        contains: function() { return false; } 
      },
      setAttribute: function() {},
      appendChild: function() {},
      cloneNode: function() { return this; },
      addEventListener: function() {}
    };
  },
  head: {
    appendChild: function() {}
  },
  querySelectorAll: function() { return []; },
  querySelector: function() {
    return {
      addEventListener: function() {},
      classList: { add: function() {}, remove: function() {} },
      style: {},
      appendChild: function() {}
    };
  }
};

var localStorage = {
  getItem: function() { return null; },
  setItem: function() {},
  removeItem: function() {}
};

var fetch = function() {
  return {
    then: function() {
      return { then: function() { return { catch: function() {} } } }
    }
  }
};

var console = {
  log: function() {},
  warn: function() {},
  error: function() {}
};

// Load and evaluate app.js
var path = "/Users/razzledazzle/.gemini/antigravity/scratch/silver-paintbucket-studios/app.js";
var error = $();
var contentObj = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSUTF8StringEncoding, error);
if (contentObj.isNil()) {
  throw new Error("Failed to read file: " + error.description);
}
var content = ObjC.unwrap(contentObj);
eval(content);
delay(0.1); // Allow any scheduled microtasks to run
console.log("SUCCESS: app.js loaded and executed without errors!");
