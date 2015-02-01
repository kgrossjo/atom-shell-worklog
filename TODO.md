# Worklog To Do List

* Use simple text file format, one file per year.
* Example format:
      2015-01-03    08:00   16:00   admin/overhead  My nice comment
      2015-01-04    08:00   12:00   worklog My even nicer comment
      2015-01-04    13:00   17:00   real work   Do we really need comments?
* File format is a list of tab-separated fields
  * Date using format YYYY-MM-DD (similar to ISO format)
  * Starting time using format HH:mm (24h clock)
  * End time using format HH:mm (24h clock)
  * Project name
  * Comment
* Where do we store the file?
  * %AppData%\.worklog\2015.wl on Windows
  * $HOME/.worklog/2015.wl on Unix
