
import "src/globals.less"
import { reloader } from "./fn/reload";

reloader(1500);

Fire.init({
  apiKey: "AIzaSyCgTe4lBpCwESvNAosnegbn0SD9W9EzQFo",
  authDomain: "gka-design.firebaseapp.com",
  projectId: "gka-design",
  storageBucket: "gka-design.appspot.com",
  messagingSenderId: "311586932524",
  appId: "1:311586932524:web:365b70cdf330794ea58e89"
})

Fire.useAuth();
Fire.useStore();
Fire.useStorage();


const router = new Router({
	hash,
	pages,
	views: {
		home: "home",
		error: "not-found",
		folder: "/views"
	},
	root: "#app",
	rootStyles: "#styles",
	async direct(url) {
		if (url.pathname === "/home") {
			url.pathname = "/"
		}

		else if (url.pathname === "/admin/project") {
			url.pathname = "/"
		}

		else if (url.pathname.startsWith("/admin/project/")) {
			url.pathname = "/admin/project"
		}
	}
});

Fire.auth.self.authStateReady()
.then(start)
.then(() => {

	console.log("Started app!")

})
.catch(alert)

async function start() {


	try {
		const {href} = location;
		await router.start();
		const obj = JSON.stringify(await router.print())
		const res = await fetch("/print-ui", {
			body: JSON.stringify({
				pages: encodeURIComponent(JSON.stringify(obj))
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
		if (!res.ok) {
			throw res.body
		}
		console.log("Built pages.")
		await router.go(href);
	}
	catch(err) {
		alert(err);
	}


}
