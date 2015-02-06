var path = require('path');
var tide = require('tide');
var jQuery = require('jquery');
var $ = jQuery;
var bootstrap = require('bootstrap');
var keypress = require('keypress.js');
var listener = new keypress.keypress.Listener();
var backend = require('./backend.js');
var Worklog = backend.Worklog;
var WorkItem = backend.WorkItem;

var templates = require('./templates.js');
var Templates = templates.Templates;
var _template_path_ = path.join(__dirname, 'templates');
var TMPL = new Templates(_template_path_);

var HOME = ( process.env.AppData || process.env.HOME || process.env.ATOM_HOME );
var WORKLOG_FILE = path.join(HOME, ".worklog");

var WORKLOG = new Worklog(WORKLOG_FILE);

initializeApp();

function initializeApp() {
    populateWorklogTable();
    initializeForm();
    populateEmptyForm();
    initializeKeybindings();
}

function populateWorklogTable() {
    var wlTable = document.getElementById('worktable');
    var tbodies = wlTable.getElementsByTagName('tbody');
    var tbody = tbodies.item(0);

    var renderedItems = WORKLOG.getItems().map(renderItem);
    function renderItem(w) {
        return TMPL.render('row', {
            date: formatDate(w.date),
            start: formatTime(w.start),
            end: formatTime(w.end),
            duration: w.durationHours(),
            project: w.project,
            comment: w.comment,
        });
    }
    var renderedList = TMPL.render('list', {
        items: renderedItems,
    });
    tbody.innerHTML = renderedList;
}

function formatDate(date) {
    return tide('DD.MM.', date);
}

function formatTime(date) {
    return tide('hh:mm', date);
}

function initializeForm() {
    var addForm = document.getElementById('addform');
    addForm.addEventListener('submit', addWorklogEntry);
}

function populateEmptyForm() {
    var addForm = document.getElementById('addform');
    addForm.reset();
    var now = new Date();
    addForm.elements.formDate.valueAsDate = now;
    var start = new Date(now);
    start.setHours(8);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    addForm.elements.formStart.valueAsDate = start;
    var end = new Date(now);
    end.setHours(16);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    addForm.elements.formEnd.valueAsDate = end;
}

function addWorklogEntry(ev) {
    var addForm = ev.target;
    var elements = addForm.elements;
    var rawDate = elements.formDate.valueAsDate;
    var rawStart = elements.formStart.valueAsDate;
    var rawEnd = elements.formEnd.valueAsDate;
    var rawProject = elements.formProject.value;
    var rawComment = elements.formComment.value;

    var date = rawDate;
    var start = new Date(date);
    start.setHours(rawStart.getHours());
    start.setMinutes(rawStart.getMinutes());
    var end = new Date(date);
    end.setHours(rawEnd.getHours());
    end.setMinutes(rawEnd.getMinutes());

    var item = new WorkItem({
        date: date,
        start: start,
        end: end,
        project: rawProject,
        comment: rawComment,
    });
    WORKLOG.addItem(item);

    populateWorklogTable();
    populateEmptyForm();

    $('#mainapp a[href="#worklog"]').tab('show');

    ev.preventDefault();
    return false;
}

function initializeKeybindings() {
    listener.simple_combo('w', keyWorklog);
    listener.simple_combo('a', keyAddWorklogEntry);
    listener.simple_combo('r', keyReports);
    $('input[type=text]')
        .bind("focus", function() { listener.stop_listening(); })
        .bind("blur", function() { listener.listen(); });
}

function keyWorklog(ev) {
    $('a.tab-worklog').tab('show');
}

function keyAddWorklogEntry(ev) {
    $('a.tab-add').tab('show');
    $('input.addform-date').focus();
}

function keyReports(ev) {
    $('a.tab-reports').tab('show');
}
