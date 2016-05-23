# Becca

Becca is an experimental build tool for the web, built on the following principles:

- The build configuration should map to what you're tying to do.
- Asset transformations should be flexible and composable.
- No assumptions should be made about the user's project layout.

Becca uses a simple composable set of transformations that can be chained together and applied to a set of files. becca is very alpha, but can already do some handy work.

## Example

```javascript
becca(['styles/homepage.styl', 'styles/interior.styl'])
.stylus()
.save_to('public/css')
.save()
.clean_css()
.save();
```

This first section of the script specifies a pipeline for two stylus files. They are first compiled into css through the `stylus` filter. An output directory is specified in the `save_to` filter. The compiled css files are then saved in public/css. becca filters keep track of the files' types, so the .styl extension is automatically replaced with the .css extension. The files are then minified using the `clean_css` filter and saved again with the `.min.css` extension.


## TODO

- Non one-to-one filters (such as concatenation and handling source-maps)
- Composable pipelines (taking the results of a pipeline and pluging it into another)
- Transparent plugin detection
- Pipeline branching
- Incremental builds (everything is designed with this in mind)
- Watch mode