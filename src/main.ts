
import "src/globals.less"
import { Phrases } from "@dunes/phrase";
// import { reloader } from "@dunes/reloader";

import { lang } from "src/fn/lang";

export const ph = new Phrases(["en", "es"], "en", lang);

const userLang = ph.userLang();

if (ph.isLang(userLang)) {
	ph.lang = userLang;
}

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
		error: "404",
		folder: "/views",
	},
	root: "#app",
	rootStyles: "#styles",
	async direct(url) {
		if (url.pathname === "/admin/project") {
			url.pathname = "/";
		}

		else if (url.pathname !== "/project/list" && url.pathname.startsWith("/project/")) {
			url.pathname = "/project";
		}

		else if (url.pathname.startsWith("/admin/project/")) {
			url.pathname = "/admin/project";
		}
	}
});

Fire.auth.self.authStateReady()
// reloader()
// .then(() => Fire.auth.self.authStateReady())
.then(()=> router.start())
.then(() => console.log("Started app!"))
.catch(alert)