module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      "@babel/env"
      , {
        targets: "> 0.25%, not dead"
      }
    ],
    "@babel/typescript"
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