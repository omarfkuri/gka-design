import { Elem } from "@dunes/tag";

export function html(scripts: string[]) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

				<link rel="stylesheet" id="styles"/>
				<link rel="stylesheet" href="/styles.css"/>
				{scripts.map(script => 
					<script src={`/${script}.js`} defer/>
				)}
				<title>Test</title>
			</head>
			<body>
				<div id="app"></div>
			</body>
		</html>
	)
}