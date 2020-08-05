# wiki link

People who writing technical or maybe non technical article with markdown, sometimes want to refer to wiki for some terminology, this tool can help to do that with easy command.

## Features

Usage is simple:
1. Select the word you want to replace with Wiki Link
2. `Ctrl+Shift+P` get command prompt
3. Select the most relevant link

![replace with wiki link](images/wiki-link-extension.gif)


## Configuration

Can add following to the setting file:

```json
{
  "wikilink.linknum": 5 // How many links maxium you want to list when search
}
```

Or go to settings page and find `extentions > WikiLink`.

## Release Notes

### 1.0.0

Initial release of Wiki link search

### 1.1.0

Add config option for how many links you want to list when search
