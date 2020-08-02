module.exports = (api) => {
  api.cache(false);

  const presets = [
    [
      "@babel/env"
      , {
        targets: {
          'esmodules': true
        },
        modules: false
      }
    ]
  ];

  const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ];

  const ignore = [
    "**/*.d.ts"
  ];

  return {
    presets,
    plugins,
    ignore
  };
};