# Worklog - Playground for learning web programming

This is Worklog, a playground for learning web programming.  Oh, and it's
also a time keeping app.  The idea is to record "worklog items", which
comprise a date, a start time, an end time, a project, and a comment.

There would be a list of worklog items, there would be a way to add a new
worklog item, there would be a way to edit an existing worklog item, and
finally there would be a way to run some reports.

For the time being, this is a hard-coded spaghetti-code kind of like thing.
I have no idea how to do web development, but I thought I'd start with the
bare metal so to say, and then experience pieces of pain, and then work my
way up the abstractions.  Learning by pain, if you will.

## License

Copyright Kai Grossjohann by [MIT License](license).

## 2015-02-01

The first iteration of this used DOM methods to construct the table of
worklog items, and that got sufficiently painful really quickly, so that I
replaced it with [mustache.js](http://github.com/janl/mustache.js).