# gulp-filter-each

Filter files from a Gulp stream based on their content or filepath.

## Install

```
npm install --save-dev gulp-filter-each
```

## Usage

Pass a function to the plugin, which takes three possible arguments:
- **content** - contents of the file as readable string (UTF8)
- **filepath** - path/filename of the file
- **done** - callback to be used for async operation

Return a truthy/falsy value to filter files in the stream:
- `true` (or truthy) to **include** the file
- `false` (or falsy) to **exclude** the file

Use for both **sync** or **async** operations:
- **sync** - simply return a value *(see examples below)*
- **async** - accept a third argument which is a callback to call when done *(see examples below)*

## Examples

```javascript
const gulp = require('gulp')
const filter = require('gulp-filter-each')

gulp.task('filter-empty-files', () => {
  return gulp
    .src('src/**/*')
    .pipe(filter(content => content))
    .pipe(gulp.dest('dist'))
})

gulp.task('filter-by-content', () => {
  return gulp
    .src('src/**/*')
    .pipe(filter(content => content.match(/something/gi)))
    .pipe(gulp.dest('dist'))
})

gulp.task('filter-by-filepath', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(filter((content, filepath) => filepath.match(/something/gi)))
    .pipe(gulp.dest('dist'))
})

gulp.task('filter-async', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(filter((content, filepath, done) => {
      // Simulating async operation
      setTimeout(() => {
        done(true) // Callback
      }, 500)
    }))
    .pipe(gulp.dest('dist'))
})
```