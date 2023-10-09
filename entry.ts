import { Builder } from "@dunes/builder";
import { bab, type Replacer } from "@dunes/wrap";
import { clear, line, prompt, readString } from "@dunes/sys";
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
				bab({
					id,
					jsx: {
						pragma: "Elem.create",
						useSpread: true,
					},
					keeps: new Set,
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
				defer: 1,
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
				entry: "html.tsx",
				outFile: "index.html",
				opt: {replaceAfter: [remExports, ...remDollar]},
				defer: 2,
				process(script, {modules}) {

					const scripts = modules
					.filter(m => !m.startsWith("views/") && m !== "html.tsx")
					.map(m => m.replace(/\.tsx?$/, ""))

					const html = eval(`${script}; html(${JSON.stringify(scripts)})`)
					
					if (Elem.isElement(html)) {
						return "<!DOCTYPE html>\n" + String(html);
					}
					throw "Not HTML..."
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
				match: /\.tsx/,
				subDir: "views",
				outDir: "views/js",
				outStylesDir: "views/css",
				opt: {replaceAfter: remDollar},
			}
		]
	}
);

await builder.build({
	clean: true,

	onBuildStart() {
		line.gray(`Building`)

	},

	onBuildFinish(took) {
		line.green(`Built in ${took}ms`)
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
	api(req, res) {
	  if (req.url.endsWith("/reload")) {
	  	res.send(latest)
	  	return {stop: true}
	  }
	  return {stop: false}
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