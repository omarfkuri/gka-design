import { SiteBuilder } from "@dunes/site";
import { jsxPreset, tsPreset } from '@dunes/bab';

import localResolve from '@dunes/wrap-plug';
import nodeResolve from '@rollup/plugin-node-resolve';
import { line } from "@dunes/sys";
import less from "less"
import express from "express"
import { join, resolve } from "path";

const builder = new SiteBuilder({
  out: "public",
  css: {
  	match: /\.less$/,
  	ext: "less",
  	file: "global.css",
		async transform(source) {
			const {css} = await less.render(
				'@import "src/style/pre.less";' + "\n" + source
			);
		  return css;
		},
  },
  wrap: {
    replaceAfter: [
      [/let \w+\$\d+ = /g, ""],
      [
        /(Router|Comp|Fire|Elem|FireAuth|FireStore)\$\d+/g, 
        (_str, name) => name
      ]
    ],
    plugs: [
      nodeResolve(),
      localResolve({
        keeps: new Set,
        id: "script.ts",
        parseOptions: {
          sourceType: "module",
          plugins: [
            "typescript", "jsx",
            "destructuringPrivate"
          ]
        },
        transformOptions(id) {
          return {
            filename: id,
            presets: [
              jsxPreset({
                pragma: "Elem.create"
              }),
              tsPreset({}),
            ]
          }
        },
      }),
    ]
  }
})

try {
	line.gray("Building")
  const result = await builder.build({
    clean: true
  });
  line.cyan(
  	"Built in " + line.blue.text(String(result.took)) + "ms"
  );
}
catch(error) {
  console.warn(error)
  process.exit(0);
}

const app = express();

app.get("/*", (req, res) => {
	if (req.url.match(/\.\w+$/)) {
		res.sendFile(resolve(join("public", req.url)))
	}
	else {
		res.sendFile(resolve(join("public", "index.html")))	
	}
})

await new Promise(res => {
	const server = app.listen(3420, () => res(server))
})
line.gray("Listening at " + 3420);


line.gray("watching...")
await builder.watch({

  onActionStart(e) {
    line.gray("Building " + e.name);
  },
  onActionFinish(e) {
    line.green("Built " + e.name + " in " + e.took + "ms");
  },

  onActionFailure({error}) {
    line.red("THERE WAS AN ERROR");
    line.gray(String(error));
    line.red("THERE WAS AN ERROR");
  },

});
process.exit(0);