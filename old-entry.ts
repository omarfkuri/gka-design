import { Builder } from "@dunes/builder";
import { type Replacer } from "@dunes/wrap";
import { localResolve } from "@dunes/wrap-plug";
import { jsxPreset, tsPreset } from "@dunes/bab";
import { clear, line, prompt } from "@dunes/sys";
import { Elem } from "@dunes/tag";
import less from "less"
import resolve from "@rollup/plugin-node-resolve";

const [,,command] = process.argv;
const port = 3047;

const remExports: Replacer = [/export *{ .+ };? *\n*/, ""];
const remDollar: Replacer[] = [
	[/let \w+\$\d+ = /g, ""],
	[
		/(Router|Comp|Fire|Elem|FireAuth|FireStore)\$\d+/g, 
		(_str, name) => name
	]
];


const builder = new Builder(
	{

		src: "src",
		public: "public",
		globalCSSFile: "styles.css",
		wrap: id => ({
			plugs: [
				resolve(),
				localResolve({
					id,
					keeps: new Set,
					parseOptions: {
						sourceType: "module",
						plugins: [
							"jsx", 
							"typescript", 
							"destructuringPrivate"
						]
					},
					transformOptions(filename: string) {
						return {
							filename,
							presets: [
								jsxPreset({
									pragma: "Elem.create",
									useSpread: true,
								}),
								tsPreset({}),
							]
						}
					}
        })
			]
		}),

		css: {
			match: /\.less$/,
			ext: "less",
			async transform(source) {
				const {css} = await less.render(
					'@import "src/style/pre.less";' + "\n" + source
				);
			  return css;
			},
		},

		handlers: [
			{
				entry: "script.tsx",
				outFile: "script.js",
				opt: {replaceAfter: remDollar},
				process(script, {modules, hash}) {

					const views = modules
					.filter(m => m.startsWith("views/"))
					.map(m => m
						.replace(/^views/, "")
						.replace(/\.tsx$/, "")
					)

					return [
						`const hash = ${hash};`,
						`const pages = ${JSON.stringify(views, null, 2)};`,
						script
					].join("\n");
				}
			},
			{
				entry: "lib.ts",
				outFile: "lib.js",
				opt: {
					replaceAfter: [
						remExports,
						...remDollar,
					],
					treeshake: true
				},
			},
			{
				entry: "html.tsx",
				outFile: "index.html",
				opt: {replaceAfter: [remExports, ...remDollar]},
				process(script, {modules}) {

					const scripts = modules
					.filter(m => !m.startsWith("views/") && m !== "html.tsx")
					.map(m => m.replace(/\.tsx?$/, ""))
					.sort();

					const html = eval(`${script}; html(${JSON.stringify(scripts)})`)
					
					if (Elem.isElement(html)) {
						return "<!DOCTYPE html>\n" + String(html);
					}
					throw "Not HTML..."
				}
			},
			{
				match: /\.tsx/,
				subDir: "views",
				outDir: "views/js",
				outStylesDir: "views/css",
				opt: {replaceAfter: remDollar},
			}
		]
	}
);

// const html = new HTMLBuilder(builder);

await builder.build({
	clean: true,

	onBuildStart() {
		line.gray(`Building`)

	},

	async onBuildFinish(took) {
		line.green(`Built in ${took}ms`)
		// await html.build("public/lib.js");
	}
});

if (!(command?.includes("watch"))) {
	process.exit(0)
}

const latest = {
	css: 0,
	ui: 0
}

await builder.serve({
	port,
	api: {
		get(req, res) {
		  if (req.url.endsWith("/reload")) {
		  	res.send(latest);
		  	return {stop: true};
		  }
		  return {stop: false};
		},
		post: {
			async act(req, res) {
			  if (!req.url.endsWith("/print-ui")) {
					res.sendStatus(404);
			  	return {stop: false}
			  }
				try {
					// for (const viewPath in req.body as {[key: string]: string}) {
					// 	const path = builder.out(viewPath) + ".html";
					// 	console.log("Writing", path)
					// 	await writeStr(path, req.body[viewPath]);
					// }
					console.log(req.body)
					res.sendStatus(200)
				}
				catch(err) {
					res.status(500).send(err);
				}
				return {stop: false};
			},
			json: true
		}
	}
});

console.log()
line.cyan(`Live at ${port}`);

const watcher = builder.watch({
	async onActionStart(e) {
		process.stdout.write("\n");
		await clear();
		if (e.type === "dependency") {
			const {length} = e.parents;
			line.gray(`Updating ${length} file${length===1?"":"s"} for ${e.filename}`);
		}
		else {
			line.gray(`Updating '${e.filename}'`);
		}
	},

	onActionSuccess(e) {
		line.cyan(`Updated in ${e.took}ms`);
		if (e.style) {
			latest.css = Date.now();
		}
		else {
			latest.ui = Date.now();
		}
		process.stdout.write(line.gray.text("* "));
	},

	onActionError(e) {
		line.red("Update failed");
		line.gray(e.error as string);
		process.stdout.write(line.gray.text("* "));
	}
});

while (true) {
	const input = await prompt(line.gray.text("* "));

	if (input?.trim() === "exit") {
		break;
	}
}

line.gray("Closing...");
watcher.close();
line.cyan("Bye!");
process.exit(0);