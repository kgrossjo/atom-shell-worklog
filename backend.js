// Parses and writes files with worklog data.
var fs = require('fs');
var os = require('os');
var tide = require('tide');

exports.Worklog = function(file) {
    this.file = file;
    this.data = undefined;
    this.error = undefined;
    this.initialized = false;
    this.readData(this.file); // async
};

exports.Worklog.prototype.readData = function(file) {
    var self = this;
    var data = fs.readFileSync(file, { encoding: 'utf8' });
    var lines = data.split(/\r?\n/);
    lines = lines.filter(function (element) { return element; });
    var initial_current = 0;
    this.data = lines.map(createWorklogItem);
    this.current = undefined;
    if (this.data && this.data.length >= 1) {
        this.current = 0;
    }
    function createWorklogItem(line, index, initial_current) {
        return exports.WorkItemFromLine(line, index, self);
    }
};

exports.Worklog.prototype.saveAllItems = function() {
    var items = this.getItems();
    var lines = items.map(function (x) {
        return x.toLine()
    });
    var data = lines.join('');
    fs.writeFileSync(this.file, data);
}

exports.Worklog.prototype.getItems = function() {
    return this.data;
};

exports.Worklog.prototype.getLength = function() {
    return this.data.length;
};

exports.Worklog.prototype.addItem = function(item) {
    this.data.push(item);
    var line = item.toLine();
    fs.appendFileSync(this.file, line, { encoding: 'utf8' });
};

exports.Worklog.prototype.getCurrent = function() {
    return this.current;
};

exports.Worklog.prototype.getCurrentItem = function() {
    return this.data[this.getCurrent()];
}

exports.Worklog.prototype.nextItem = function() {
    this.current++;
    if (this.current >= this.getLength()) {
        this.current = -1 + this.getLength();
    }
};

exports.Worklog.prototype.prevItem = function() {
    this.current--;
    if (this.current < 0) {
        this.current = 0;
    }
};

// obj = { date: ..., start: ..., end: ..., project: ..., comment: ...}
exports.WorkItem = function(obj) {
    obj = obj || {};
    this.date       = obj.date      || undefined;
    this.start      = obj.start     || undefined;
    this.end        = obj.end       || undefined;
    this.project    = obj.project   || undefined;
    this.comment    = obj.comment   || undefined;
};

exports.WorkItemFromLine = function(line, index, worklog) {
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
    result.worklog = worklog;
    result.index = index;
    result.date = new Date(rawDate);
    result.start = new Date(result.date.getTime());
    result.start.setHours(rawStartHours);
    result.start.setMinutes(rawStartMinutes);
    result.end = new Date(result.date.getTime());
    result.end.setHours(rawEndHours);
    result.end.setMinutes(rawEndMinutes);
    result.project = rawProject;
    result.comment = rawComment;
    return result;
};

exports.WorkItem.prototype.toLine = function() {
    var fDate = tide('YYYY-MM-DD', this.date);
    var fStart = tide('hh:mm', this.start);
    var fEnd = tide('hh:mm', this.end);
    var fProject = this.project;
    var fComment = this.comment;
    return [
        fDate, fStart, fEnd, fProject, fComment
    ].join("\t") + os.EOL;
};

exports.WorkItem.prototype.durationMinutes = function() {
    var millis = this.end.getTime() - this.start.getTime();
    return ( millis / 1000 / 60 );
};

exports.WorkItem.prototype.durationHours = function() {
    var millis = this.end.getTime() - this.start.getTime();
    return ( millis / 1000 / 60 / 60 );
};

exports.WorkItem.prototype.isCurrent = function() {
    var current = this.worklog.getCurrent();
    return (this.index == current);
};
