import { LangDecl } from "@dunes/phrase/lib/types";

export type Languages = "en" | "es"

export const lang = {

	hello: {
		en: "Hello",
		es: "Hola"
	},

	admin: {
		en: "Admin",
		es: "Admin"
	},

	related: {
		en: "Related",
		es: "Relacionados"
	},

	no_related: {
		en: "Nothing to show",
		es: "Nada que mostrar"
	},

	about: {
		en: "About",
		es: "Acerca de"
	},

	projects: {
		en: "Projects",
		es: "Proyectos"
	},

	contact: {
		en: "Contact",
		es: "Contacto"
	},

	email: {
		en: "Email",
		es: "Email"
	},

	tel: {
		en: "Phone",
		es: "Teléfono"
	},

	message: {
		en: "Message",
		es: "Mensaje"
	},

	loading: {
		en: "Loading...",
		es: "Cargando"
	},

	no_projects: {
		en: "No projects Available",
		es: "No hay proyectos disponibles"
	},

	back_to_list: {
		en: "Return to list",
		es: "Volver a la lista"
	},

	no_sections: {
		en: "This project has no sections",
		es: "Este proyecto no tiene secciones"
	},

	no_images: {
		en: "This section has no images",
		es: "Esta sección no tiene imágenes"
	},

	ver: {
		en: "View",
		es: "Ver"
	},

	view_all: {
		en: "All Projects",
		es: "Ver proyectos"
	},

	send_message: {
		en: "Send us a message",
		es: "Envíanos un mensaje"
	},

	send_success: {
		en: "Message sent!",
		es: "¡Mensaje enviado!"
	},

	send_another: {
		en: "Send another message",
		es: "Envía un nuevo mensaje"
	},

	send_button: {
		en: "Send",
		es: "Enviar"
	},

	mission: {
		en: (
			"We are a company dedicated to designing and developing "
			+ "modern, functional and comfortable spaces. We specialize "
			+ "in projects of any kind of architecture: from residential to "
			+ "comercial. Our mission is achieving the maximum "
			+ "satisfaction for our clients."
		),
		es: (
			"Somos una empresa dedicada a diseñar y desarrollar espacios cómodos, "
			+ "funcionales y modernos. Nos especializamos en proyectos de cualquier "
			+ "índole desde arquitectura residencial hasta comercial. "
			+ "Nuestra misión es lograr la máxima satisfacción de nuestros clientes."
		)
	},


} satisfies LangDecl<Languages>