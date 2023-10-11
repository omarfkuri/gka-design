

declare module "*.less" {
	const styles: {[key: string]: string}
	export default styles;
}

declare module "https://cdn.socket.io/4.4.1/socket.io.esm.min.js" {
	const io: typeof import("socket.io-client").io
	export { io }
}

