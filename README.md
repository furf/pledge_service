# Lessig2016

## License

You have the right to run, study, share, copy, and modify the software here, so long as you distribute your product under the same terms.  You are responsible for complying with any applicable campaign finance laws.

This project is licensed under the Apache License, version 2.

## Project Architecture

We're trying a different architecture on GAE.

The majority of the site is just basic static content, as it should
be. That markup lives in "markup/" in the form of jade files. If you
don't know what those are, they're very simple, and remove literally
50% of HTML's boilerplate so they're worth it. Read the 3 minute
tutorial.

Stylesheets are in "stylesheets/" as sass files. See previous paragraph
for why that's good.

Ideally there will be little enough JS that no framework will be necessary (fingers crossed).

The backend will be very simple with two endpoints

1. Pledge. This has to be done in coordination with stripe so that stripe stores the credit card info, and we only store an opaque token and the pledge amount. This will write to what'll be probably the only table in the datastore.
2. GetTotal: Simple sum over pledges. Store it in memcache, expire every few minutes. Boom.

## Getting Started

This project has several dependencies, some of which may already be installed on your computer.

* [Python](https://www.python.org/)
* [Ruby](https://www.ruby-lang.org/)
* [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads)
* [Node/NPM](https://nodejs.org/)
* [Sass](http://sass-lang.com/) Syntactically Awesome Style Sheets

### Python

To determine if you already have the correct version of Python installed:

1. Open your terminal application.
2. Type `python -V`.
3. If the output includes `Python 2.7.<number>`, Python is correctly installed. If not, navigate to [Python Downloads](https://www.python.org/downloads/) and follow the installation instructions.

### Ruby

1. Open your terminal application.
2. Type `ruby -c`.
3. If the output includes `ruby <number>.<number>.<number>`, Ruby is correctly installed. If not, navigate to [Ruby Downloads](https://www.ruby-lang.org/en/downloads/) and follow the installation instructions.

### Google App Engine SDK for Python

*Requires Python 2.7 or greater*

1. Navigate to [Download the Google App Engine SDK](https://cloud.google.com/appengine/downloads).
2. Click the **"Google App Engine SDK for Python"** button.
3. Download the version of the SDK appropriate for your platform (Windows, Mac OS X, Linux/Other Platforms).
4. Follow the installation instructions for your platform.

### Node.js and NPM

1. Navigate to the [Node.js website](https://nodejs.org/).
2. Click the "INSTALL" button.
3. Double-click the downloaded installer and follow the installation instructions. 

### Sass

*Requires Ruby*

1. Open your terminal application.
2. Type `gem install sass`.

## Hacking

After checking out the code, run `npm install`. To start the server, run `npm start` and go to
[http://localhost:8080](http://localhost:8080). That's it!

### Running Tests

After running `npm install` and `grunt local`, copy `build/config.json` over to `backend/` and run
`python testrunner.py` in the project's root directory.

(Test have not been run on this codebase for a while. . . )

## Deploying

We have 4 deployment environments available, all of which can be set up with grunt (installed by npm).
* **local**: For normal development, with code updates on every reload. Run `npm start` or equivalently `node_modules/.bin/grunt local`.
  * Note that in local mode, you can't actually send a transaction to stripe due to an SSL bug in dev_appserver. But
    you can get right up to that point before it fails, which is generally good enough.
* **dev**: This is an independant instance of the app running at https://pledge-test.lessigforpresident.com/pledge.. We can do
  whatever we want here because the data's all fake. It also uses Stripe's test keys, so feel free to submit test
  transactions with credit card 4242 4242 4242 4242. To deploy, run `./node_modules/.bin/grunt dev`, and then
  `appcfg.py --oauth2 update build/`.
  When testing, it works best to hit this URL: https://pledge-test.lessigforpresident.com/pledge.

* **lessig**: The real McCoy. Don't break it. To deploy, run `./node_modules/.bin/grunt lessig`, and then
  `appcfg.py --oauth2 update build/`.

## Troubleshooting

If `npm start` generates an out of files error and prints a lot of messages like this:

    Warning: EMFILE: Too many opened files.

You probably have an orphan app engine process running. Try looking for and
killing any child processes. Worst case, you may need to increase your inotify
maximums; you can do that on a Linux system with this command:

    echo 1024 > /proc/sys/fs/inotify/max_user_instances

