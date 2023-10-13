import { join, resolve } from "path";

import less from "less"
import nodeResolve from '@rollup/plugin-node-resolve';

import { c, serve } from "@dunes/sys";
import { SiteBuilder } from "@dunes/site";
import { Fire, FireData } from "@dunes/fire";
import { jsxPreset, tsPreset } from '@dunes/bab';
import { localResolve, ResolveOptions, transformInclude} from '@dunes/wrap-plug';

const resolveOpts: ResolveOptions = {
  keeps: new Set,
  id: "script.ts",
  parseOptions: {
    sourceType: "module",
    plugins: [ "typescript", "jsx", "destructuringPrivate" ]
  },
  transformOptions(filename) {
    return {
      filename,
      presets: [
        jsxPreset({ pragma: "Elem.create" }),
        tsPreset({}),
      ]
    }
  }
}

const builder = new SiteBuilder({
  out: "public",
  assets: { source: "assets" },
  css: {
  	match: /\.less$/,
  	ext: "less",
  	file: "global.css",
		async transform(source) {
			const {css} = await less.render(
				'@import "node_modules/@dunes/styles/color.less";\n' 
        + '@import "node_modules/@dunes/styles/layout.less";\n'
        + '@import "src/style/pre.less";\n' 
        + source
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

    transform: [
      transformInclude(resolveOpts)
    ],

    plugs: [
      nodeResolve(),
      localResolve(resolveOpts),
    ]
  }
})

function ms(time: number): string {
  return `${c.yellow(String(time))}ms`
}

// Build
try {
	c.gray.log("Building")
  const result = await builder.build({clean: true});
  c.cyan.log(`Built in ${ms(result.took)}`);
}
catch(error) {
  c.red.log("Build Error");
  c.gray.warn(String(error));
  process.exit(0);
}

try {
  const latest = { ui: 0, css: 0 };
  // Serve
  const { io } = await serve({
    port: 3001,
    assign(app) {
      app.get("/*", (req, res) => {
        if (req.url.match(/\.\w+$/)) {
          res.sendFile(resolve(join("public", req.url)))
        }
        else {
          res.sendFile(resolve(join("public", "index.html"))) 
        }
      })
    }
  })
  c.gray.log("Listening at " + c.blueLi(String(3001)));
  io.on("connection", socket => socket.emit("start", latest))
  
  // Produce
  const start = Date.now();
  c.gray.log("Producing...");
  Fire.init({
    apiKey: "AIzaSyCgTe4lBpCwESvNAosnegbn0SD9W9EzQFo",
    authDomain: "gka-design.firebaseapp.com",
    projectId: "gka-design",
    storageBucket: "gka-design.appspot.com",
    messagingSenderId: "311586932524",
    appId: "1:311586932524:web:365b70cdf330794ea58e89"
  });

  Fire.useDatabase(FireData);
  await builder.produce({
    origin: "http://localhost:3001",
    do: {
      async '/project/index'(path) {
        const p = path.slice(0, path.lastIndexOf("/"));
        const projects = await Fire.data.getCol<any>(
          Fire.data.col("projects")
        );
        return {
          path: p,
          ids: projects.map(({id}) => ({id}))
        }
      }
    }
  });
  c.green.log(`Produced in ${ms(Date.now() - start)}`);

  // Watch
  c.gray.log("Watching...")
  await builder.watch({
    onFileBuilding(e) {
      c.gray.log(`Rebuilding ${e.name}`);
    },

    onFileBuilt(e) {
      c.green.log(`Rebuilt ${e.name} in ${ms(e.took)}`);
      if (e.style) latest.css = Date.now();
      else latest.ui = Date.now();
      io.emit("change", latest);
    },

    onFileFailure({error}) {
      c.red.log("THERE WAS AN ERROR");
      c.gray.warn(String(error));
      c.red.log("===");
    },

    onDepStart(e) {
      c.gray.log("Rebuilding " + [...e.changes.keys()]);
    },

    onDepFailure({error, name}) {
      c.red.log("THERE WAS AN ERROR in " + name);
      c.gray.warn(String(error));
      c.red.log("===");
      
    },

    onDepFinish(e) {
      c.green.log(`Rebuilt ${e.changes.size} files in ${ms(e.took)}`);
      if (e.style) latest.css = Date.now();
      else latest.ui = Date.now();
      io.emit("change", latest);
    },
  });

  process.exit(0)
}
catch(error) {
  c.red.log("!! Error");
  c.gray.warn(String(error));
  process.exit(0)
}