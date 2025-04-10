'use strict'
;(()=>{
	var download = (data, filename, type)=>{
		var file = new Blob([data], {type: type});
		if (window.navigator.msSaveOrOpenBlob) // IE10+
			window.navigator.msSaveOrOpenBlob(file, filename);
		else { // Others
			var a = document.createElement("a"),
					url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);  
			}, 0); 
		}
	}
	var lihat = a=>{
		console.log(a)
		return a
	}
	var cla = a=>document.getElementsByClassName(a)
	var buatele = (nama,attr,isi)=>{
		attr = attr??{}
		isi = isi??[]
		var eleini = document.createElement(nama)
		var qwa
		
		for(qwa in attr){
			eleini.setAttribute(qwa,attr[qwa])
		}
		for(qwa in isi){
			if(!(isi[qwa] instanceof Node)){
				isi[qwa] = document.createTextNode(String(isi[qwa]))
			}
			eleini.appendChild(isi[qwa])
		}
		return eleini
	}
	var edi = document.createElement('div')//editor
	document.body.insertBefore(edi,document.body.firstChild)
	
	var mulai = ()=>addEventListener('load',fload)
	var masukweb = 0// 0->lain | 1->valins | 2->dava
	var fload = e=>{
		lihat('ookkkkk loaded')
		
		//cek judul
		if(location.hostname === '10.62.165.36'){
			if(
				document.
				getElementsByClassName('col-md-12')[0]?.
				firstElementChild?.
				firstElementChild?.
				textContent === 'Tracking Valins ID'
			)
				masukweb = 1
			else
				lihat('bukan hlm Tracking Valins ID')
			
		}else if(location.hostname === 'emas.telkom.co.id'){
			document.documentElement.style.minWidth = '1333px'
			if(document.getElementsByClassName('smart-form').length){
				lihat('lihat details')
				Array.from(
					document.
					getElementsByClassName('table')
				).forEach(aa=>{
					aa.classList.remove('table')
				})
				
				document.
				getElementsByClassName('dataTables_scrollHeadInner')[0].
				firstElementChild.
				classList.
				add('txt-color-white')
				
				setTimeout(()=>{
					var statusini = Array.from(
						document.
						getElementById('datatable_tabletools').
						getElementsByTagName('tbody')[0].
						children
					).every(aa=>aa.children[2].textContent === 'IDLE')?
					'eviden lengkap':
					'valin ulang'
					var kirimini = e=>{
						chrome.runtime.sendMessage({
							perintah:'beri infodava',
							foto:lihat(e.toDataURL()),
							status:statusini,
						},e=>{
							lihat(e)
							location.href = 'https://emas.telkom.co.id/DAVA/dataValidation/validOrderCapture/servicePoint'
						})
					}
					//sementara, kirim semua foto
					html2canvas(document.documentElement).
					then(kirimini)
					/*
					//asli
					if(statusini === 'valin ulang'){
						kirimini({
							toDataURL:()=>''
						})
					}else{
						html2canvas(document.documentElement).
						then(kirimini)
					}
					*/
				},2222)
			}else if(document.getElementsByClassName('expand sorting_1').length){
				lihat('lihat list')
				setTimeout(()=>
					document.getElementsByClassName('column_number')[2]?.firstElementChild.click()
				,1111)
			}else if(document.getElementsByClassName('input-group-addon')[5]?.firstElementChild){//radio
				lihat('input ODP')
				masukweb = 2
			}
		}
		switch(masukweb){
			case 1:
				chrome.runtime.sendMessage({perintah:'minta valins',},fmintavalins)
			break
			case 2:
				chrome.runtime.sendMessage({perintah:'minta dava',},fmintadava)
			break
		}
	}
	
	//dava
	var isitabel
	var fmintadava = e=>{
		lihat(e)
		edi.outerHTML = e.davaxml//editor dah jadi
		edi = cla('edi')[0]
		var elemain = document.getElementById('main')
		elemain.insertBefore(edi,elemain.firstElementChild.nextElementSibling)
		isitabel = e.isitabel
		isitabel.forEach(aa=>ftambahtabel(
			aa.id,
			aa.odp,
			aa.fotovalins,
			aa.fotodava,
			aa.status,
		))
		isitabel.find(aa=>(
			(aa.fotodava === '') &&
			(aa.status === 'belum cek dava')
		))?
			ffind()
		:
			0//edi.getElementsByClassName('findall')[0].addEventListener('click',ffind)
		
		cla('download')[0].addEventListener('click',e=>{
			chrome.runtime.sendMessage({
				perintah:'downloadhasil',
				downloadhasil:cla('edi-output')[0].getElementsByTagName('table')[0].innerHTML,
			},e=>
				download(
					lihat(e).downloadhasil,
					'Eviden.html',
					''
				)
			)
		})
		cla('mulai')[0].addEventListener('click',e=>{
			location.reload()
		})
	}
	var ffind = e=>{
		var radio = document.getElementsByClassName('input-group-addon')[5]?.firstElementChild
		var odptex = document.getElementsByClassName('input-group-addon')[5]?.nextElementSibling
		odptex.value = (isitabel.find(aa=>(
			(aa.fotodava === '') &&
			(aa.status === 'belum cek dava')
		))?.odp)??''
		
		radio?.click()
		if(odptex?.value?.length){
			chrome.runtime.sendMessage({
				perintah:'beri odpdava',
				odp:odptex.value,//sampe sini
			},e=>{
				document.getElementsByClassName('btn btn-warning btn-sm')[0].click()
			})
		}
	}
	
	//valins
	var tex
	var track = false
	var fmintavalins = e=>{
		lihat(e)
		edi.outerHTML = e.valinsxml//editor dah jadi
		edi = cla('edi')[0]
		tex = cla('tex')[0]
		tex.value = e.isitex
		e.isitabel.forEach(aa=>ftambahtabel(aa.id,aa.odp,aa.fotovalins,aa.fotodava,aa.status))
		track = e.track
		var tomboltrack = cla('track')[0]
		if(track){
			tomboltrack.textContent = 'Stop Track'
			tomboltrack.addEventListener('click',e=>{
				lihat('berhenti')
				track = false
			})
		}
		document.getElementsByClassName('reset')[0].addEventListener('click',e=>{
			chrome.runtime.sendMessage({
				perintah:'reset tabel',
			},e=>
				location = location.href
			)
		})
		
		//html2canvas
		if(document.getElementsByClassName('panel panel-primary')[0]?.getElementsByTagName('b')){
			edi.hidden = true
			html2canvas(document.documentElement).then(fSS)
		}else{
			fSS()
		}
	}
	var fSS = e=>{//screenshot halaman
		edi.hidden = false
		var b = document.getElementsByClassName('panel panel-primary')[0]?.getElementsByTagName('b')
		if(b?.[0]?.textContent === 'Valins ID: '){
			var dini = [
				b?.[0]?.nextSibling.textContent,
				b?.[2]?.nextSibling.textContent,
				e.toDataURL(),
				'',
				'belum cek dava',
			]
			ftambahtabel(...dini)
			chrome.runtime.sendMessage({
				perintah:'beri tambahtabel',
				tambahtabel:{
					id:dini[0],
					odp:dini[1],
					fotovalins:dini[2],
					fotodava:dini[3],
					status:dini[4],
				}
			},lihat)
		}
		var tomboltrack = cla('track')[0]
		if(track){
			fstarttrack({currentTarget:cla('track')[0]})
		}else{
			tomboltrack.addEventListener('click',fstarttrack)
			tomboltrack.textContent = 'Start Track'
		}
	}
	var fstarttrack = e=>{
		var form = document.getElementsByTagName('form')[0]
		var inp = form.getElementsByTagName('input')[0]
		var sub = form.getElementsByTagName('button')[0]
		var idmasuk = ''
		
		tex.value = tex.value.split('\n').filter(aa=>{
			var cek = (aa != '') && !isNaN(+aa)
			
			if(
				cek &&
				(idmasuk === '')
			){
				idmasuk = aa
				cek = false
			}
			
			return cek
		}).join('\n')
		
		inp.value = idmasuk
		if(idmasuk != ''){
			e.currentTarget.removeEventListener('click',fstarttrack)
			chrome.runtime.sendMessage({
				perintah:'beri input',
				isitex:tex.value,
				track:true,
			},e=>{
				lihat(e)
				sub.click()
			})
		}else{
			track = false
			e.currentTarget.addEventListener('click',fstarttrack)
			e.currentTarget.textContent = 'Start Track'
		}
	}
	var ftambahtabel = (id,odp,fotovalins,fotodava,status)=>{
		var img0 = document.createElement('img')
		var img1 = document.createElement('img')
		var tbodyini = cla('edi-output')[0].getElementsByTagName('tbody')[0]
		var td0
		var td1
		
		tbodyini.appendChild(
			buatele('tr',{},[
				buatele('td',{},[id]),
				buatele('td',{},[odp]),
				td0 = buatele('td',{},[img0]),
				td1 = buatele('td',{},[img1]),
				buatele('td',{},[status]),
			])
		)
		
		img0.src = fotovalins
		img1.src = fotodava
		td0.addEventListener('click',ftambahtabel.fsize)
		td1.addEventListener('click',ftambahtabel.fsize)
		td0.click()
	}
	ftambahtabel.fsize = e=>{
		var list = e.currentTarget.parentElement.classList//td
		list.contains('imgkecil')?list.remove('imgkecil'):list.add('imgkecil')
	}
	
	lihat(chrome.idle)
	mulai()
})()


/*
11286682
 []-====
#@
fwfrrrewf
11289431
g
   g   h   eetr
11364898
11343077
11316354

11289000

11284523
*/

