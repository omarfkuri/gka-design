export async function reloader(delay: number, warn = true) {

	const latest = {
		css: 0,
		ui: 0
	};

	while (true) {
		try {
			const res = await fetch("/reload");
			const body: {css: number, ui: number} = await res.json();
			if (latest.ui < body.ui) {
				if (latest.ui > 0) {
					reloadUi();
				}
				latest.ui = body.ui;
			}

			else if (latest.css < body.css) {
				if (latest.css > 0) {
					reloadCss();
				}
				latest.css = body.css;
			}
			await new Promise(res => setTimeout(res, delay));
		}
		catch(err) {
			if (!warn || !confirm("Could not connect to server. Try again?")) {
				break
			}
		}
	}

	function reloadUi() {
		location.reload();
	}

	function reloadCss() {
		for (const link of document.querySelectorAll("link")) {
			if (link.rel == "stylesheet") {
				const copy = link.cloneNode(true);
				link.replaceWith(copy);
			}
		}
	}
}