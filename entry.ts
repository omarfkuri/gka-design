import { SiteBuilder } from "@dunes/site";
import { jsxPreset, tsPreset } from '@dunes/bab';

import localResolve from '@dunes/wrap-plug';
import nodeResolve from '@rollup/plugin-node-resolve';
import { c } from "@dunes/sys";
import less from "less"
import express from "express"
import http from 'http';
import { Server } from "socket.io";

import { join, resolve } from "path";

const builder = new SiteBuilder({
  out: "public",

  assets: {
    source: "assets",
  },

  css: {
  	match: /\.less$/,
  	ext: "less",
  	file: "global.css",
		async transform(source) {
			const {css} = await less.render(
				'@import "node_modules/@dunes/styles/color.less";\n' +
        '@import "node_modules/@dunes/styles/layout.less";\n' +
        '@import "src/style/pre.less";\n' + source
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
	c.gray.log("Building")
  const result = await builder.build({
    clean: true
  });
  c.cyan.log(
  	"Built in " + c.blue(String(result.took)) + "ms"
  );
}
catch(error) {
  console.warn(error)
  process.exit(0);
}


const latest = {
  ui: 0,
  css: 0
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
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", socket => socket.emit("start", latest))

await new Promise<void>(res => server.listen(3420, res))
c.gray.log("Listening at " + 3420);


c.gray.log("watching...")
await builder.watch({

  onActionStart(e) {
    c.gray.log("Building " + e.name + (
      e.files
      ? ` for ${e.files.size} file${e.files.size===1?"":"s"}`
      : ""
    ));
  },
  onActionFinish(e) {
    c.green.log("Built " + e.name + " in " + e.took + "ms");
    if (e.style) {
      latest.css = Date.now()
    }
    else {
      latest.ui = Date.now()
    }
    io.emit("change", latest)
  },

  onActionFailure({error}) {
    c.red.log("THERE WAS AN ERROR");
    c.gray.warn(String(error));
    c.red.log("===");
  },

});
process.exit(0);