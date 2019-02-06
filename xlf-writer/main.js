const xlfw = {
	title: undefined,
	lastPopover: undefined,
	xml: undefined
}

go();

function go() {

	const uploader = document.querySelector('#uploader');
	const uploadBtn = document.querySelector('#uploadBtn');
	const exportLabelsBtn = document.querySelector('#exportLabelsBtn');
	const exportScriptBtn = document.querySelector('#exportScriptBtn');

	uploader.addEventListener('change', function(e) {
		const file = this.files[0];
		const reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener('load', function(e) {
			xlfw.xml = new DOMParser().parseFromString(e.target.result, "application/xml");
			buildHTML();
		});
	});

	uploadBtn.addEventListener('click', function() { uploader.click(); });
	exportLabelsBtn.addEventListener('click', function() { exportXLF(); });
	exportScriptBtn.addEventListener('click', function() { exportScript(); });

}

function exportScript() {

	if (xlfw.lastPopover) xlfw.lastPopover.summernote('destroy');

	const data = [];
	Array.from(document.querySelectorAll('.entry')).forEach(entry => {
		if (!entry.classList.contains('d-none')) {
			const pageCode = entry.querySelectorAll('.col')[0].textContent;
			const identifier = entry.querySelectorAll('.col')[1].textContent;
			const text = entry.querySelector('.wysiwyg').innerHTML;
			if (pageCode !== 'theme_translations') {
				data.push({
					pageCode: pageCode,
					identifier: identifier,
					text: text
				});
			}
		}
	});

	const script = buildScript(data);
	const blob = htmlDocx.asBlob(script);
	saveAs(blob, xlfw.title + ' Transcript.docx');

}

function buildScript(data) {

	const pageCodes = [];

	const isValidIdentifier = id => {
		const regexList = [
			/-text.*$/,
			/-title$/,
			/-caption__text$/,
			/-modal__title$/,
			/-question__header__text$/,
			/-answer__text-.*$/,
			/deb-text-.*$/
		];
		return regexList.some(i => i.test(id));
	}

	const style = `
		<style>
			html, body { font-family: Arial; color: #333; }
			td { vertical-align: top; }
		</style>
	`;

	let script = '';
	let tableOfContents = '<hr><h3 style="text-align: center;">Table of Contents</h3><ul style="list-style-type: none;">';
	let a = 0, b = 0;
	data.forEach(i => {
		if (!pageCodes.includes(i.pageCode)) {
			b = 0;
			a++;
			pageCodes.push(i.pageCode);
			script += `<hr><h2>${a}.0 ${i.pageCode.substring(14)}</h2><hr>`;
			tableOfContents += `<li>${a}.0 ${i.pageCode.substring(14)}</li>`;
		}
		if (isValidIdentifier(i.identifier)) {
			b++;
			script += `<table><td style="width: 50px; border-right: 5px solid #EEE; padding-right: 10px;">${a}.${b}</td><td>${sanitizeLite(i.text)}</td></table>`;
		}
	});

	tableOfContents += `</ul><p style="page-break-after: always;">`;

	return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">${style}</head><body><h1>${xlfw.title} Script</h1>${tableOfContents}${script}</body></html>`;

}

function exportXLF() {

	if (xlfw.lastPopover) xlfw.lastPopover.summernote('destroy');

	const afterContent = Array.from(document.querySelectorAll('.wysiwyg')).map(i => i.innerHTML);

	let i = 0;
	Array.from(xlfw.xml.querySelectorAll('trans-unit')).forEach(unit => {
		if (unit.children.length === 1) {
			unit.insertAdjacentHTML('beforeend', `\t<target xml:lang="en-GB"><![CDATA[${afterContent[i]}]]></target>\n\t\t\t\t`);
		}
		else {
			unit.children[1].innerHTML = `<![CDATA[${afterContent[i]}]]>`;
		}
		i++;
	});

	const xlfStr = new XMLSerializer().serializeToString(xlfw.xml);
	const blob = new Blob([xlfStr], {type: "application/xlf"});
	saveAs(blob, xlfw.title + ' Corrections.xlf');

}

function buildHTML() {

	const entries = document.querySelector('.entries');
	const p2 = document.querySelector('.p2');

	entries.textContent = "";

	let count = 1, titleFound = false;
	Array.from(xlfw.xml.querySelector('body').children).forEach(a => {
		Array.from(a.children).forEach(b => {
			Array.from(b.children).forEach(c => {
				entries.insertAdjacentHTML('beforeend', `
					<div class="row entry${c.textContent.includes('(For reference only)') ? ' d-none' : ''}">
						<div class="col-3">
							<div class="row">
								<div class="col-2 index">${count}</div>
								<div class="col page-code">${a.id}</div>
								<div class="col identifier">${b.id}</div>
							</div>
						</div>
						<div class="col">
							<div class="row">
								<div class="col-4 content-before">${c.textContent}</div>
								<div class="col wysiwyg content-after">${c.textContent}</div>
							</div>
						</div>
					</div>
				`);
				if (b.id.match(/project.*title|title.*project/i) && !titleFound) {
					xlfw.title = sanitize(c.textContent);
					document.title = "XLF Writer - " + xlfw.title;
					document.querySelector('h1').innerHTML = "XLF Writer - " + xlfw.title;
					titleFound = true;
				}
				if (!c.textContent.includes('(For reference only)')) count++;
			});
		});
	});

	document.querySelector('.instruction').textContent = 'To make corrections, click the text in the 5th column.';
	fadeIn(p2);
	document.querySelector('#exportLabelsBtn').disabled = false;
	document.querySelector('#exportScriptBtn').disabled = false;
	enableEditors();
	notify();

}

function fadeIn(el) {
	if (!el.classList.contains('fadeIn')) {
		el.classList.remove('fadeIn');
		el.classList.add('fadeIn');
	}
}


function notify() {
	document.body.insertAdjacentHTML('afterbegin', `<div class="alert alert-success notify" role="alert">Upload successful!</div>`);
	const alert = document.querySelector('.alert');
	setTimeout(_ => alert.parentNode.removeChild(alert), 4000);
}

function enableEditors() {
	document.querySelectorAll('.wysiwyg').forEach(v => {
		v.addEventListener('click', function() {
			if (xlfw.lastPopover) xlfw.lastPopover.summernote('destroy');
			xlfw.lastPopover = $(this).summernote({
				toolbar: [
					['undo'],
					['redo'],
					['style', ['bold', 'italic', 'underline']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['para', ['ul', 'ol', 'paragraph']],
					['color', ['color']],
					['codeview']
				]
			});
			this.nextSibling.classList.add('col');
			document.querySelector('.note-editable').style.height = document.querySelector('.note-editor').offsetHeight - 49 + "px";
		});
	});
}

function sanitize(string) {
	return string.replace(/<(?!\/?br)[^>]+>/g, "");
}

function sanitizeLite(string) {
	string = string.replace(/<p>/g, '');
	string = string.replace(/<\/p>/g, '<br>');
	string = string.replace(/<(h1|h2|h3|h4|h5|h6)>/g, "<b>");
	string = string.replace(/<(\/h1|\/h2|\/h3|\/h4|\/h5|\/h6)>/g, "</b><br>");
	return string.replace(/<(?!\/?b|\/?strong|\/?p>|\/?sup|\/?sub|\/?em|\/?u|\/?ol|\/?li|\/?br)[^>]+>/g, "");
}