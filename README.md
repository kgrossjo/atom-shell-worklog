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

## How to use

I got a bit confused by the instructions on Atom Shell, so maybe I've not
done it right.  In any case, I downloaded a release of Atom Shell and
unpacked it.  Because I'm on OSX (and of course because of the specific
folder I unpacked it into, but I guess you guessed that part), this means I
then had a directory called

```bash
~/git/worklog/Atom.app/Contents/Resources
```

I then made it so that my local git repo is called `app`.  Because the
file you're looking at now is called `README.md`, this means that this file
has the name

```bash
~/git/worklog/Atom.app/Contents/Resources/app/README.md
```

I think if you try it, you can do

```bash
cd ~/git/worklog/Atom.app/Contents/Resources
git clone https://github.com/kgrossjo/atom-shell-worklog.git app
```

Now I can run `~/git/worklog/Atom.app/Contents/MacOS/Atom` from the command
line, and something happens!


## 2015-02-01

The first iteration of this used DOM methods to construct the table of
worklog items, and that got sufficiently painful really quickly, so that I
replaced it with [mustache.js](http://github.com/janl/mustache.js).

The next steps will be to add some keyboard shortcuts, for example I want
`l` to go to the list of items, and `a` to go to the tab that allows me to
add an item.  I'm not sure if I want to somehow pimp the form for entering
a new item.

I'm not sure if I want to add some reports at that point in time.  Maybe
later.

After implementing the functionality, perhaps I want to investigate the
next library or framework.  Perhaps Riot?

## 2015-02-06

I've added keyboard shortcuts `w`, `a`, `r` for the tabs "Worklog", "Add",
"Reports".  Hitting `a` also automatically focuses the date input field.

My first attempt at this was using the npm module `ks`, but that resulted in
weird things happening to the tabs.  So now I've tried (the npm module)
`keyboard.js` which mostly does what I want.  BUt `ks` automatically exempts
input fields from the shortcuts, and with `keyboard.js` I have to do that
myself.  Though a nice snippet is provided in the documentation, and that works
as advertised.

As of now, the app is still small enough so it's easy to understand.  But I can
tell that there is no real structure to it.  Now I wonder whether I should go
with [Polymer](https://www.polymer-project.org) or whether I should look at
[React.js](http://facebook.github.io/react/).  The former seems to be object
oriented, the latter seems to be functional.  Hm.


## License

Copyright Kai Grossjohann by [MIT License](LICENSE).
