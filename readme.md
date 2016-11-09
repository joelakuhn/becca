# Becca

Becca is a build tool and task runner for the web built on the following principles:

- The build configuration should map to what you're tying to do.
- Asset transformations should be flexible and composable.
- No assumptions should be made about the user's project layout.

Becca uses a simple, composable set of transformations that can be chained together and applied to a set of files. It works essentially like gulp's piping system with a cleaner api. Becca is very alpha, but can already do some handy work.

## Example

Let's look at an example pipeline.

```javascript
// beccaconfig.js

becca(['styles/homepage.styl', 'styles/interior.styl'])
.stylus()
.save_to('public/css')
.clean_css()
.combine('styles.min.css')
.save();
```

The `becca` function defines a pipeline for two stylus files. They are first compiled into css through the `stylus` filter. The results are saved in `public/css`. Becca filters keep track of the files types and paths, so the `.styl` extension is automatically replaced with the `.css` extension. The files are then minified using the `clean_css` filter, combined into one file with the `combine` filter and saved in the `public/css` directory since it was the last used.

Pipelines can also feed into other pipelines such as the following:

```javascript
var stylus_files = becca('styles/*.styl')
.stylus();

var stylesheets = becca(stylus_files, 'styles/*.css')
.clean_css()
.save_to('public/css');
```

In this case, the stylus files are compiled, then fed into the `stylesheets` pipeline which minifies the stylesheets and saves them to the to the `public` directory.

All pipelines are automatically included in the `build` and `watch` tasks.

## Tasks

Becca has three tasks by default: `build`, `watch`, and `serve`. Tasks can also be user defined using the `becca.task` function. Becca tasks are what get run when you pass a command to becca. For example, running `becca serve` will start the `serve` task. If no task if given, the `build` task is run by default. Multiple tasks can be run by separating them with commas such as `becca build, watch, serve`.

Tasks can also be run manually by calling the `run` method which accepts either an arguments array which would be passed in through `process.argv` or an arguments object.

### Default Tasks

`build`

The `build` task quite simply starts all the pipelines running.

`watch`

The `watch` task monitors files for changes and makes updates accordingly. This is incremental, so when a file changes the entire pipeline isn't rerun, the file is just run through the pipeline again.

`serve`

The `serve` task starts a static http server. It can take two optional arguments. The first positional argument sets the root directory. The `--port` argument sets the port for the server.

### Basic Custom Task Example

This is a hello world task that will accept an optional command line argument of --name.

```javascript
becca.task('hello', function(args) {
  console.log('Hello', args['name'] || 'world');
});
```

To call this task, run `becca hello --name Douglas` or `becca hello`.

### Running pipelines from a task.

Another handy use of tasks is to run specific pipelines like below:

```javascript
var styles = becca('styles/*.css')
.combine('app.css')
.save_to('public/css');

var js = becca('js/*.js')
.combine('app.js')
.save_to('public/js');

becca.task('js', function() {
  js.build();
  js.watch();
});

becca.task('css', function() {
  css.build();
  css.watch();
});
```

### Manually calling a task

In this example, we will call `hello_task` from the task `hello-chicago`.

```javascript
var hello_task = becca.task('hello', function(args) {
  console.log('Hello', args['name'] || 'world');
});

becca.task('hello-chicago', function() {
  hello_task.run({ name: 'Chicago' });
})
```

## Actions

**`append('file_path')`, `prepend('file_path')`**

Append or prepend a file to the contents in the pipeline.

**`assert(function(state) { ... })`**

Runs a test function which accepts the current state as an argument. If the function does not return true, The pipeline halts for that file.

**`filter(condition)`, `endfilter()`**

Filters can be used to limit which files are acted upon for a segment of the pipeline. For example:

```javascript
becca('lib/jquery.min.js', 'js/*.js')
.filter('js/*')
  .uglify_js()
.endfilter()
.save_to('public/js')
```

In this case, the `uglify_js` action will only run on the files that match the `js/*` glob.

You can also pass regular expressions and functions. Regular expressions match against the file path, while functions are passed a state variable and must return true for any file that should pass the filter.

**`combine(file_name)`**

Combines all files into a single file specified by the `file_name` parameter.

**`do(function(state, callback) { ... })`**

Do anything you want. For example:

```javascript
becca('js/*.js')
.do(function(state, callback) {
	console.log(state.file.path);
	callback(state);
});
```

**`do_sync(function(state) { ... })`**

```javascript
becca('js/main.js')
.do_syncc(function(state) {
	console.log(state.file.path);
});
```

**`execute(executable, args)`**

Runs a system executable and pipes the current content to stdin. The results of stdout become the new content. The arguments for this command are exactly the arguments for `child_process.spawn`. The following example uses the `pngquant` executable to minify all png images before saving them to the `public` folder.

```javascript
becca('app/img/*.png')
.execute('pngquant', [ '--quality=0-90', '-' ])
.save_to('public/img')
```

```javascript

## TODO

- ~~Composable pipelines (taking the results of a pipeline and pluging it into another)~~
- ~~Transparent plugin detection~~
- Pipeline branching
- ~~Extensible watch mode~~
- ~~Handle binary files properly~~
- ~~Watch globs, so adding a file that matches a pipeline glob will automatically be added to the pipeline when it is created, and files in a pipeline that are removed from the filesystem will automatically be removed from the pipeline.~~
- ~~Remove files from a pipeline when they are removed from the file system or renamed.~~
- Support source maps. These might be more generalized as "rider" files that ride along with your main files in the pipeline.

## Plugins to add

- Image Magic
- Babel
- TypeScript
- More markdown flavors
- Traceur
- Elm
- Less
- Autoprefixer
- CSScomb
- Handlebars
- Mustache
- Dust
- Emblem
- Marko
- jpegtran
- closure-compiler
- html-minifier
- Bless

