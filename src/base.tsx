
import type { HTMLFunctionEvent } from "@dunes/site";
export { Elem } from "@dunes/tag"

export function html(e: HTMLFunctionEvent): string {
	return String(
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<meta name="color-scheme" content="light dark"/>

				{e.styles.map(style => 
					<link rel="stylesheet" href={style}/>
				)}
				{e.scripts.map(script => 
					<script src={script} defer/>
				)}
				<link rel="stylesheet" id="styles"/>
				<title>Test</title>
			</head>
			<body>
				<div id="app"></div>
			</body>
		</html>
	)
}