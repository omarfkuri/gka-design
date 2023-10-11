
import "src/globals.less"
// import { reloader } from "src/fn/reload";

// reloader(1500);
Fire.init({
  apiKey: "AIzaSyCgTe4lBpCwESvNAosnegbn0SD9W9EzQFo",
  authDomain: "gka-design.firebaseapp.com",
  projectId: "gka-design",
  storageBucket: "gka-design.appspot.com",
  messagingSenderId: "311586932524",
  appId: "1:311586932524:web:365b70cdf330794ea58e89"
})

Fire.useAuth();
Fire.useDatabase();
Fire.useStorage();

const router = new Router({
	hash,
	pages: paths,
	views: {
		home: "",
		error: "not-found",
		folder: "/views"
	},
	root: "#app",
	rootStyles: "#styles",
	async direct(url) {
		if (url.pathname === "/admin/project") {
			url.pathname = "/"
		}

		else if (url.pathname !== "/project/list" && url.pathname.startsWith("/project/")) {
			url.pathname = "/project"
		}

		else if (url.pathname.startsWith("/admin/project/")) {
			url.pathname = "/admin/project"
		}
	}
});

Fire.auth.self.authStateReady()
.then(()=> router.start())
.then(() => {

	console.log("Started app!")

})
.catch(alert)