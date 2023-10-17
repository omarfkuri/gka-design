import { config } from "@dunes/site";
import { resolve } from "path";
import less from "less"

import { c, serve } from "@dunes/sys";
import { localResolve, } from "@dunes/bundle";
import { Fire, FireData } from "@dunes/fire";
import { word } from "@dunes/random";

export default async function () {

	/**
   * @param {number} time
   */
	function ms(time) {
	  return `${c.yellow(String(time))}ms`
	}

	const latest = { ui: 0, css: 0 };

	/**
   * @type {import("socket.io").Server}
   */
	let io;

	return config({
		options: {
		  out: "public",
		  hash: word(14),
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
		  bundle: {
		    jsx: {
		      pragma: "Elem.create"
		    },
		    onParse: localResolve,
		    onConclude(code) {
		      return code
		      .replace(/let \w+\$\d+ = /g, "")
		      .replace(/(Router|Comp|Fire|Elem|FireAuth|FireStore)\$\d+/g,
		        (_str, name) => name)
		    },
		  }
		},

		build: {
			clean: true,
			async onStart() {
			  c.gray.log("Building...");
			},
			async onSuccess({builder, took}) {
			  c.gray.log("Built in " + ms(took));

			  // Serve
			  ({ io } = await serve({
			    port: 3001,
			    assign(app) {
			      app.get("/*", (req, res) => {
			        if (req.url.match(/\.\w+$/)) {
			          res.sendFile(resolve(builder.out(req.url)));
			        }
			        else {
			          res.sendFile(resolve(builder.out("index.html")));
			        }
			      })
			    }
			  }))
			  c.gray.log(`Listening at ${c.blueLi(String(3001))}`);
			  io.on("connection", socket => socket.emit("start", latest))
			}
		},

		produce: {
			// inactive: true,
	    origin: "http://localhost:3001",
	    do: {
	      async '/project/index'(path) {
	        const p = path.slice(0, path.lastIndexOf("/"));
	        const projects = await Fire.data.getCol(
	          Fire.data.col("projects")
	        );
	        return {
	          path: p,
	          ids: projects.map(({id}) => ({id}))
	        }
	      }
			},

	    onStart() {
			  // Produce
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
			},

			onSuccess({took}) {
				console.log()
			  c.green.log("Produced in " + ms(took));

	    },

    	onPageStart(e) {
	      c.gray.log(`Producing static for ${e.path}`);
	    },

	    onPageFailure({error, path}) {
	      c.red.log("THERE WAS AN ERROR producing " + path);
	      c.gray.warn(String(error));
	      c.red.log("===");
	    },

	    onPageSuccess(e) {
	      c.green.log(`Produced static ${e.path} in ${ms(e.took)}`);
	    },
		},

		watch: {
			inactive: true,
	    
	    onStart() {
			  c.gray.log("watching...");
	    },

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

	    onDepFinish(e) {
	      c.green.log(`Rebuilt ${e.changes.size} files in ${ms(e.took)}`);
	      if (e.style) latest.css = Date.now();
	      else latest.ui = Date.now();
	      io.emit("change", latest);
	    },

	    onDepFailure({error, name}) {
	      c.red.log("THERE WAS AN ERROR in " + name);
	      c.gray.warn(String(error));
	      c.red.log("===");
	      
	    },
		}
	})
}