go();

function go() {
	const uploader = document.querySelector('#uploader');
	const uploadBtn = document.querySelector('#uploadBtn');
	const exportBtn = document.querySelector('#exportBtn');
	let xml;

	uploader.addEventListener('change', function(e) {
		const file = this.files[0];
		const reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener('load', function(e) {
			xml = new DOMParser().parseFromString(e.target.result, "application/xml");
			buildHTML(xml);
		});
	});

	uploadBtn.addEventListener('click', function() {
		uploader.click();
	});

	exportBtn.addEventListener('click', function() {
		exportXLF(xml);
	});

}

function exportXLF(xml) {

	if (lastPopover) lastPopover.summernote('destroy');

	const afterContent = Array.from(document.querySelectorAll('.wysiwyg')).map(i => i.innerHTML);

	let i = 0;
	Array.from(xml.querySelector('body').children).forEach(a => {
		Array.from(a.children).forEach(b => {
			Array.from(b.children).forEach(c => {				
				c.insertAdjacentHTML('afterend', `\n\t\t\t\t\t<target xml:lang="en-GB"><![CDATA[${afterContent[i]}]]></target>`);
				i++;
			});
		});
	});

	const xlfStr = new XMLSerializer().serializeToString(xml);
	const a = window.document.createElement('a');
	const blob = new Blob([xlfStr], {type: "application/xlf"});
	a.href = window.URL.createObjectURL(blob);
	a.download = 'corrections.xlf';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

}

function buildHTML(xml) {

	const entries = document.querySelector('.entries');
	const p2 = document.querySelector('.p2');

	entries.textContent = "";

	let count = 1;
	Array.from(xml.querySelector('body').children).forEach(a => {
		Array.from(a.children).forEach(b => {
			Array.from(b.children).forEach(c => {
				entries.insertAdjacentHTML('beforeend', `
					<div class="row entry${c.textContent.includes('(For reference only)') ? ' d-none' : ''}">
						<div class="col-3">
							<div class="row">
								<div class="col-2">${count}</div>
								<div class="col">${a.id}</div>
								<div class="col">${b.id}</div>
							</div>
						</div>
						<div class="col">
							<div class="row">
								<div class="col">${c.textContent}</div>
								<div class="col wysiwyg">${c.textContent}</div>
							</div>
						</div>
					</div>
				`);
				if (!c.textContent.includes('(For reference only)')) count++;
			});
		});
	});

	const instruction1 = document.querySelector('.instruction1');
	const instruction2 = document.querySelector('.instruction2');
	if (getComputedStyle(instruction1).getPropertyValue('opacity') !== "0") {
		fadeOut(instruction1);
		fadeIn(instruction2);
		fadeIn(p2);
	}
	document.querySelector('#exportBtn').disabled = false;
	enableEditor();
	addAlert();

}

function fadeIn(el) {
	if (el.classList.contains('fadeOut')) el.classList.remove('fadeOut');
	if (!el.classList.contains('fadeIn')) {
		el.classList.remove('fadeIn');
		el.classList.add('fadeIn');
	}
}

function fadeOut(el) {
	el.classList.remove('fadeIn');
	el.classList.toggle('fadeOut');
}

function addAlert() {
	document.body.insertAdjacentHTML('afterbegin', `<div class="alert alert-success" role="alert">Upload successful!</div>`);
	const alert = document.querySelector('.alert');
	setTimeout(_ => alert.parentNode.removeChild(alert), 4000);
}

// let lastPopover;
function enableEditor() {
	document.querySelectorAll('.wysiwyg').forEach(v => {
		v.addEventListener('mouseenter', function() {
			// if (lastPopover) lastPopover.summernote('destroy');
			$(this).summernote({
				airMode: true,
				fontSizes: ['6', '7', '8', '9', '10', '11', '12', '14', '18', '24', '36', '48' , '72', '96'],
				popover: {
					air: [
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']]
					]
				}
			});
			this.nextSibling.classList.add('col');
			// lastPopover = $(this);
		});
	});
}