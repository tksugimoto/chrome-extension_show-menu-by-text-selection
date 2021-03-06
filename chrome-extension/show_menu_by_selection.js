
const patterns = [{
	name: "ALC",
	generateUrl: word => {
		const base = "https://eow.alc.co.jp/search";
		const queryString = generateUrlQuery({
			q: word
		});
		const url = `${base}?${queryString}`;
		return url;
	}
}, {
	name: "Wikipedia",
	generateUrl: word => {
		const base = "https://ja.wikipedia.org/w/index.php";
		const queryString = generateUrlQuery({
			search: word,
			title: "特別:検索",
			go: "表示" // 厳密に一致する名前のページが存在すれば、そのページへ移動する
		});
		const url = `${base}?${queryString}`;
		return url;
	}
}, {
	name: "Google翻訳",
	generateUrl: word => {
		const base = "https://translate.google.co.jp/";
		const queryString = generateUrlQuery({
			hl: "ja",
			langpair: "auto|ja",
			q: word
		});
		const url = `${base}?${queryString}`;
		return url;
	}
}];

const generateUrlQuery = queryObject => {
	const querys = Object.entries(queryObject).map(([key, value]) => {
		return `${key}=${encodeURIComponent(value)}`;
	});
	const queryString = querys.join("&");
	return queryString;
};

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
document.body.append(popup);

{
	const contents = patterns.map(pattern => {
		const link = document.createElement("a");
		link.innerText = pattern.name;
		link.target = "_blank";
		link.style.display = "block";
		return {pattern, link};
	});

	const documentFragment = document.createDocumentFragment();
	contents.forEach(({link}) => {
		documentFragment.append(link);
	});
	popup.append(documentFragment);

	window.refreshPopupContent = word => {
		contents.forEach(({pattern, link}) => {
			link.href = pattern.generateUrl(word);
		});
	};
}

const updateMenu = () => {
	const selectedText = window.getSelection().toString().trim();
	const position = getFixedPosition();
	if (selectedText && position && position.width) {
		refreshPopupContent(selectedText);
		popup.style.display = "";
		const top = position.bottom + 10;
		const left = position.left + (position.width - popup.offsetWidth) / 2;
		popup.style.top = `${top}px`;
		popup.style.left = `${left}px`;
	} else {
		popup.style.display = "none";
	}
};

const debounce = (func, delay_ms) => {
	let timeoutID = null;
	return () => {
		if (isFinite(timeoutID)) {
			clearTimeout(timeoutID);
		}
		timeoutID = setTimeout(func, delay_ms);
	};
};

{
	const delay_ms = 500;
	const debouncedUpdateMenu = debounce(updateMenu, delay_ms);
	document.addEventListener("selectionchange", () => {
		popup.style.display = "none";
		debouncedUpdateMenu();
	});
}
