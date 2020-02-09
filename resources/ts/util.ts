/**
 * Play a one-time animation on an HTML element
 */
export function anim(selector: string, animation: string): Promise<JQuery<any>>;
export function anim(element: JQuery<any>, animation: string): Promise<JQuery<any>>;
export function anim(selector: string|JQuery<any>, animation: string): Promise<JQuery<any>> {
	return new Promise<JQuery<any>>((resolve) => {
		let onEnd = () => {
			resolve($(selector).removeClass(`animated ${animation}`).off("animationend", onEnd));
		}
		$(selector).addClass(`animated ${animation}`).on("animationend", onEnd);
	});
}

/**
 * Hide an element by playing an exit animation
 */
export function animHide(selector: string, animation: string, invisible?: boolean):
	Promise<JQuery<any>>;
export function animHide(element: JQuery<any>, animation: string, invisible?: boolean):
	Promise<JQuery<any>>;
export function animHide(selector: string|JQuery<any>, animation: string, invisible?: boolean) {
	return anim($(selector), animation).then((elem) => {
		return elem.addClass(invisible ? "invisible" : "hidden");
	});
}

/**
 * Show an element by playing an entrance animation
 */
export function animShow(selector: string, animation: string): Promise<JQuery<any>>;
export function animShow(element: JQuery<any>, animation: string): Promise<JQuery<any>>;
export function animShow(selector: string|JQuery<any>, animation: string): Promise<JQuery<any>> {
	let promise = anim($(selector), animation);
	$(selector).removeClass("hidden invisible");
	return promise;
}
