const sharp = require('sharp')
const fs = require("fs");
const path = require('path');
const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
require('dotenv').config();
const W3F_API_KEY = process.env.W3F_API_KEY;
const NOT_FOUND_PATH = "_site/404.html";
const { exec } = require('child_process');

module.exports = function(eleventyConfig){

  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  // Add this line to recognize the data directory
  eleventyConfig.addPassthroughCopy('_data');
  // Official plugins
	eleventyConfig.addPlugin(pluginRss);
  // .env
  eleventyConfig.addGlobalData('env', process.env);
// PageFind

  eleventyConfig.on('eleventy.after', async () => {
    // Add a delay (e.g., 2 seconds) before running Pagefind
    await delay(2000);

    try {
      await execCommand('npx pagefind --site _site --output-subdir pagefind --glob "**/*.html"');
    } catch (error) {
      console.error('Error running pagefind:', error.message);
    }
  });

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

eleventyConfig.setBrowserSyncConfig({
    // Watch CSS files for changes
		files: './_site/css/**/*.css',
    // 404 routing by passing a callback
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }
          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
	});
  
  // Enable collection in descending order
  eleventyConfig.addCollection('posts', collection => {
  return collection.getFilteredByGlob('.src/posts/**/*.md').reverse();
  });
  // Obtain the `year` from the template
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  // Obtain the 'htmlDateString' from the template
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });
  // Obtain the `readableDate` from the template
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
    
  });
  
  // This next part is connected to the functions for generating favicon
  // At the top of the file there are also 3 constants related to it - sharp, fs and path

  // Function to get the absolute path of a file
  function getAbsolutePath(relativePath) {
    return path.resolve(process.cwd(), relativePath);
  }
  
  // Ensure _site directory exists
  fs.mkdirSync('_site', { recursive: true });
  
  // Generate favicon from svg input
  // Only run on production build
  eleventyConfig.on('eleventy.before', async () => {
    console.log('[11ty] Generating Favicon');
  
    try {
      // Possible locations for the favicon file
      const possiblePaths = [
        'src/assets/images/flavicon.svg',
        'src/assets/images/favicon.svg',
        'assets/images/flavicon.svg',
        'assets/images/favicon.svg'
      ];
  
      let inputPath;
      
      // Check each possible location
      for (const pathOption of possiblePaths) {
        const absolutePath = getAbsolutePath(pathOption);
        if (fs.existsSync(absolutePath)) {
          inputPath = absolutePath;
          break;
        }
      }
  
      if (!inputPath) {
        console.error('[11ty] ERROR: Input file not found in any expected location.');
        console.error(`Expected paths: ${possiblePaths.join(', ')}`);
        return;
      }
  
      console.log(`[11ty] Found input file: ${inputPath}`);
  
      const outputPath = getAbsolutePath('_site/favicon.png');
      const rootPath = getAbsolutePath('favicon.png');
  
      await sharp(inputPath)
        .png()
        .resize(192, 192) // Adjust size as needed
        .toFile(outputPath)
        .catch(function (err) {
          console.error('[11ty] ERROR Generating favicon:', err.message);
          throw err;
        });
  
      fs.copyFileSync(outputPath, rootPath);
      
      console.log('[11ty] Favicon generated and copied to root directory');
    } catch (error) {
      console.error('[11ty] Error during favicon generation:', error.message);
    }
  });
  
  // Ignore the generated favicon file in the watch config
  eleventyConfig.watchIgnores.add('_site/favicon.png');
  eleventyConfig.watchIgnores.add('favicon.png');
  eleventyConfig.watchIgnores.add('_site/assets/images/icon-96x96.png')

  return {
    dir: {
      input: "src",
      output: "_site",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: [
      'html',
      'md',
      'njk'
    ],
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk"
  }
};

  