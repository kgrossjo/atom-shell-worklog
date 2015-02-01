// Makes available a list of templates.
var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

function Templates(dir) {
    this.dir = dir;
    this.templates = {};
    this.initializeTemplates();
}
exports.Templates = Templates;

function initializeTemplates() {
    var self = this;
    var files = fs.readdirSync(this.dir);
    files.forEach(parseTemplate);
    function parseTemplate(file) {
        var fullpath = path.join(self.dir, file);
        var base = path.basename(file, '.html');
        var data = fs.readFileSync(fullpath, { encoding: 'utf8' });
        self.templates[base] = data;
    }
}
Templates.prototype.initializeTemplates = initializeTemplates;

function render(templateName, view) {
    var template = this.templates[templateName];
    var result = mustache.render(template, view);
    return result;
}
Templates.prototype.render = render;
