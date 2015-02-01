// Parses and writes files with worklog data.
var fs = require('fs');
var os = require('os');
var tide = require('tide');

function Worklog(file) {
    this.file = file;
    this.data = undefined;
    this.error = undefined;
    this.initialized = false;
    this.readData(this.file); // async
}
exports.Worklog = Worklog;

function readData(file) {
    var data = fs.readFileSync(file, { encoding: 'utf8' });
    var lines = data.split(/\r?\n/);
    lines = lines.filter(function (element) { return element; });
    this.data = lines.map(createWorklogItem);
    function createWorklogItem(line, index) {
        return exports.WorkItemFromLine(line, index);
    }
}
Worklog.prototype.readData = readData;

function getItems() {
    return this.data;
}
Worklog.prototype.getItems = getItems;

function addItem(item) {
    this.data.push(item);
    var line = item.toLine();
    fs.appendFileSync(this.file, line, { encoding: 'utf8' });
}
Worklog.prototype.addItem = addItem;

// obj = { date: ..., start: ..., end: ..., project: ..., comment: ...}
function WorkItem(obj) {
    obj = obj || {};
    this.date       = obj.date      || undefined;
    this.start      = obj.start     || undefined;
    this.end        = obj.end       || undefined;
    this.project    = obj.project   || undefined;
    this.comment    = obj.comment   || undefined;
}
exports.WorkItem = WorkItem;

function WorkItemFromLine(line, index) {
    var fields = line.split("\t");
    if (fields.length < 4) {
        throw {
            name: "WorkItemLineFormatException",
            message: "Not enough fields in line " + index +
                ", expected at least four fields: " + line,
        };
    }
    if (fields.length > 5) {
        throw {
            name: "WorkItemLineFormatException",
            message: "Too many fields in line " + index +
                ", expected at most five fields: " + line,
        };
    }
    var rawDate = fields[0];
    var rawStart = fields[1];
    var rawEnd = fields[2];
    var rawProject = fields[3];
    var rawComment = fields[4];
    
    var rawStartFields = rawStart.split(":");
    var rawStartHours = 0 + rawStartFields[0];
    var rawStartMinutes = 0 + rawStartFields[1];
    
    var rawEndFields = rawEnd.split(":");
    var rawEndHours = 0 + parseInt(rawEndFields[0]);
    var rawEndMinutes = 0 + parseInt(rawEndFields[1]);
    
    var result = new WorkItem();
    result.date = new Date(rawDate);
    result['start'] = new Date(result.date.getTime());
    result['start'].setHours(rawStartHours);
    result['start'].setMinutes(rawStartMinutes);
    result['end'] = new Date(result.date.getTime());
    result['end'].setHours(rawEndHours);
    result['end'].setMinutes(rawEndMinutes);
    result.project = rawProject;
    result.comment = rawComment;
    return result;
}
exports.WorkItemFromLine = WorkItemFromLine;

function toLine() {
    var fDate = tide('YYYY-MM-DD', this.date);
    var fStart = tide('hh:mm', this.start);
    var fEnd = tide('hh:mm', this.end);
    var fProject = this.project;
    var fComment = this.comment;
    return [
        fDate, fStart, fEnd, fProject, fComment
    ].join("\t") + os.EOL;
}
WorkItem.prototype.toLine = toLine;

function durationMinutes() {
    var millis = this.end.getTime() - this.start.getTime();
    return ( millis / 1000 / 60 );
}
WorkItem.prototype.durationMinutes = durationMinutes;

function durationHours() {
    var millis = this.end.getTime() - this.start.getTime();
    return ( millis / 1000 / 60 / 60 );
}
WorkItem.prototype.durationHours = durationHours;
