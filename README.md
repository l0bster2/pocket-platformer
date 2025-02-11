# Pocket Platformer
A tool for creating platformer games. 

https://the-l0bster.itch.io/pocket-platformer

## Running locally

After cloning the code you can run this tool simply by serving the pages.
Below is an example using [`http-server`](https://github.com/http-party/http-server#readme) but you could use any other server.

```sh
# open the folder in the console
cd /path-to/pocket-platformer

# run http-server and enjoy
http-server
```

You can now visit [localhost:8080](http://localhost:8080)

## Removing unwanted code from exported files
If you find parts of code which you would not like to be included in the exported `html` file you can
mark them with the `//startRemoval` and `//endRemoval` markers.

For example, To remove the popup shown when closing the window you can wrap its script (found in the `<head>` of the `index.html` file) with these tags:
```html
<script>
    //startRemoval 
    window.onbeforeunload = function (e) {
        e = e || window.event;
        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = 'Are you sure you want to close? Your progress will be lost.';
        }
        return 'Are you sure you want to close? Your progress will be lost.';
    };
    //endRemoval
</script>
```