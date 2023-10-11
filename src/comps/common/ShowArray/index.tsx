
export function ShowArray<T>({arr, map, load, empty, ...props}: Elements.Div & {
	arr: T[] | undefined
	map: (t: T[]) => Many<JSX.Element>
	empty: JSX.Element
	load: JSX.Element
}) {
	return (
		arr
		? arr.length
			? <div {...props}>{map(arr)}</div>
			: empty
		: load
	)
}