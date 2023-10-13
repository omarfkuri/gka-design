
import type { HTMLFunctionEvent } from "@dunes/site";
export { Elem } from "@dunes/tag"

export function html(e: HTMLFunctionEvent): string {

	const p = e.path
	.replace(/^views/, "")
	.replace(/(\.\w+)+$/, "")
	.replace(/\/index$/, "")
	const localCssPath = `${p}/styles.css`

	return String(
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<meta name="color-scheme" content="light dark"/>
				<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
				{e.styles.map(style => <link rel="stylesheet" href={style}/>)}
				{e.scripts.map(script => <script src={script} defer/>)}
				<link rel="stylesheet" id="styles" href={localCssPath}/>
				<link rel="icon" type="image/png" href="/favicon.png"/>
				<title>GKA Design</title>
			</head>
			<body>
				<div id="app"></div>
			</body>
		</html>
	)
}