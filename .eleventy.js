module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('js');
  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy('css');
  // Watch the `css` directory for changes
  eleventyConfig.addWatchTarget('css');

  // Obtain the `year` from the template
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  

    return {
      dir: {
        input: "src",
        data: "_data",
        includes: "_includes",
        layouts: "_layouts"
      }
    };
  }
  