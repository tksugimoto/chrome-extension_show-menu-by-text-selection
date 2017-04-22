

const getFixedPosition = () => {
	const selection = window.getSelection();
	if (selection.rangeCount === 0) return null;
	const clientRect = selection.getRangeAt(0).getBoundingClientRect();
	let {
		top, bottom, left, right, width, height
	} = clientRect;
	const scrollTop = document.body.scrollTop;
	top += scrollTop;
	bottom += scrollTop;
	const scrollLeft = document.body.scrollLeft;
	left += scrollLeft;
	right += scrollLeft;
	return {top, bottom, left, right, width, height};
};

const popup = document.createElement("div");
popup.style.position = "absolute";
popup.style.border = "2px black solid";
popup.style.background = "white";
popup.style.padding = "10px";
popup.style.display = "none";
popup.innerText = "選択された";
document.body.append(popup);

document.addEventListener("selectionchange", () => {
	const selectedText = window.getSelection().toString().trim();
	const position = getFixedPosition();
	if (selectedText && position && position.width) {
		popup.style.display = "";
		const top = position.bottom + 10;
		const left = position.left + (position.width - popup.offsetWidth) / 2;
		popup.style.top = `${top}px`;
		popup.style.left = `${left}px`;
	} else {
		popup.style.display = "none";
	}
});
