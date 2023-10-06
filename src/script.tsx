
import "src/globals.less"
import { reloader } from "./fn/reload";

reloader(500);

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
.then(() => {

	// console.log(Fire.auth.self.currentUser)
	return router.start();

})
.catch(alert)
