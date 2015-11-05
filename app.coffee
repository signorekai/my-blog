axis            = require 'axis'
rupture         = require 'rupture'
css_pipeline    = require 'css-pipeline'
browserify      = require 'roots-browserify'
sass            = require 'node-sass'
contentful      = require 'roots-contentful'
marked          = require 'kramed'
wordcount       = require 'wordcount'
moment          = require 'moment'
download        = require 'download'
downloadStatus  = require 'download-status'
dynamic_content = require 'dynamic-content'

compareFunction = (a,b) ->
  console.log a
  moment(b.date).unix() - moment(a.date).unix()

module.exports =

  locals:
    marked: marked
    moment: moment
    downloader: (file, name) ->
      new download(mode: '755').get('http:' + file + '?q=50').dest(__dirname + '/public/img/').rename(name).use(downloadStatus()).run()

    count_words: (body) ->
      Math.round(wordcount(body) / 100) + " mins read"


    title: "Home of Signore Kai"
    description: "Thoughts and ramblings of Signore Kai, a virtual entity manned by Alfred Lau"
    url: "localhost:1111"

    author:
      name: "Alfred Lau"
      bio: "Test"

  ignores: ['*.jpg','readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf']

  extensions: [
    dynamic_content()
    css_pipeline(files: 'assets/css/*.scss', out: 'css/built.css'),
    browserify(files: ['assets/js/detect.js','assets/js/meow.js','assets/js/main.js'], out :'js/built.js'),
    contentful
      access_token: ''
      space_id: ''
      content_types:
        posts:
          id: ''
          filters: { }
          template: 'views/_post.jade'
          path: (e) -> "#{moment(e.date).format('YYYY/MM/DD')}/#{e.slug}"
          sort: compareFunction
        pages:
          id: ''
          filters: { }
          template: 'views/_post.jade'
          path: (e) -> "#{e.slug}"
  ]

  'coffee-script':
    sourcemap: true

  jade:
    pretty: true

  server:
    clean_urls: true
