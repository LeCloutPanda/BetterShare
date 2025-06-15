# Tired of messy URLs?
Every time you share a link, it’s loaded with tracking data—ads, analytics, and who knows what else. Want to clean that up?

# Introducing: Better Share™!
With Better Share™, you can strip away all that tracking junk from URLs and make them easier to share and embed. No more cluttered links or tracking your every move—just clean, simple URLs that work anywhere.

Get the clean, efficient links you deserve with Better Share.

### Found an error?
If you come across any bugs or even have suggestions please make an [issue](https://github.com/LeCloutPanda/BetterShare/issues) and I'll do my best to see what I can do

### TODO
- [x] **Make a better popup menu**: Finish the popup menu to add setting supports and make it look prettier
- [x] **Finish config page**: Finish and implement configuration options to allow custom replacement urls
- [x] **Option to add custom urls**: If possible allow the user to add their own url and redirect to the extension rather then needing to wait for official support
- [ ] Finish styling buttons and make it look prettier
- [ ] Add option to view raw config data and then save it
- [ ] Strip tracking url parameters and such
- [ ] Clean the code up to be more performant

### Example Config
This is how the configuration is stored and processed. Entries are automatically read and applied upon saving, making it easy to add new replacements if a site doesn't already exist.
```
twitter.com:fxtwitter.com:true
x.com:fxtwitter.com:true
instagram.com:ddinstagram.com:true
tumblr.com:tpmblr.com:true
reddit.com:rxddit.com:true
furaffinity.net:true
bsky.app:fxbsky.app:true
tiktok.com:vxtiktok.com:true
```

### Building
For Firefox
```
cd .\src\firefox\
web-ext build -o
```
