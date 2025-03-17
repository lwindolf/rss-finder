// vim: set ts=4 sw=4:

// Handlebars convenience helpers

// FIXME: register only once
window.Handlebars.registerHelper("eachSorted", function(obj, options) {
    let data = window.Handlebars.createFrame(options, options.hash);
    let result = '';
  
    for (const key of Object.keys(obj).sort((a,b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    })) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        data.key = key;
        result += options.fn(obj[key], {data: data});
      }
    }
    return result;
});

window.Handlebars.registerHelper('ifTrue', function(v1, options) {
    if(v1 == true) {
      return options.fn(this);
    }
    return options.inverse(this);
});
window.Handlebars.registerHelper('ifFalse', function(v1, options) {
    if(v1 == true) {
      return options.fn(this);
    }
    return options.inverse(this);
});

window.Handlebars.registerHelper('compare', function (v1, operator, v2, options) {
    var operators = {
      '==': v1 == v2 ? true : false,
      '===': v1 === v2 ? true : false,
      '!=': v1 != v2 ? true : false,
      '!==': v1 !== v2 ? true : false,
      '>': v1 > v2 ? true : false,
      '>=': v1 >= v2 ? true : false,
      '<': v1 < v2 ? true : false,
      '<=': v1 <= v2 ? true : false,
      '||': v1 || v2 ? true : false,
      '&&': v1 && v2 ? true : false
    }
    if (Object.prototype.hasOwnProperty.call(operators, operator)) {
      if (operators[operator]) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
    return console.error('Error: Expression "' + operator + '" not found');
});

function template(str) {
    return window.Handlebars.compile(str);
}

function render(selector, template, params, append = false) {
    let e = document.querySelector(selector);
    let result;

    if(!e)
        return;

    try {
        result = template(params);
    } catch(e) {
        result = `Rendering exception: ${e}`;
    }

    if(append)
        e.innerHTML += result;
    else
        e.innerHTML = result;
}

export { template, render };