'use strict'

var lihat = a=>{
	console.log(a)
	return a
}
var isitex = 'teesss'
var valinsxml = ''
var davaxml = ''
var isitabel = []
var cekbaris = null//baris di isitabel
var track = false
var downloadhasil

fetch(lihat(chrome.runtime.getURL('valinseditor.xml'))).
then(e=>e.text()).
then(e=>valinsxml = e)

fetch(lihat(chrome.runtime.getURL('davaeditor.xml'))).
then(e=>e.text()).
then(e=>davaxml = e)

fetch(lihat(chrome.runtime.getURL('downloadhasil.html'))).
then(e=>e.text()).
then(e=>{
	downloadhasil = document.createElement('html')
	downloadhasil.innerHTML = e
})

chrome.
runtime.
onMessage.
addListener((req,sen,res)=>{
	console.warn(req.perintah)
	lihat([req,sen,res])
	
	switch(req.perintah){
		case 'beri input':
			res({
				jenis:'info',
				isi:'dari extension: ok aja',
			})
			isitex = req.isitex
			track = req.track
		break
		case 'beri tambahtabel':
			isitabel.push(req.tambahtabel)
		break
		case 'beri odpdava':
			res({
				jenis:'odp dicek',
			})
			isitabel.forEach(aa=>{
				if(
					// !cekbaris &&
					(aa.status != 'device tidak ditemukan di DAVA') &&
					(aa.odp === req.odp)
				){
					cekbaris = aa
					aa.status = 'device tidak ditemukan di DAVA'
				}
			})
		break
		case 'beri infodava':
			res({
				jenis:'infodava terkirim',
			})
			cekbaris.status = req.status
			//sampe sini, hapus foto valins? nda dihapus
			//if(req.status === 'eviden lengkap')
				cekbaris.fotodava = req.foto
			//else
				//cekbaris.fotovalins = ''
			
			cekbaris = null
		break
		case 'minta valins':
			res({
				jenis:'web valins',
				isitex:isitex,
				valinsxml:valinsxml,
				isitabel:isitabel,
				track:track,
			})
		break
		case 'minta dava':
			res({
				jenis:'web dava',
				davaxml:davaxml,
				isitabel:isitabel,
			})
		break
		case 'downloadhasil':
			downloadhasil.getElementsByTagName('table')[0].innerHTML = req.downloadhasil
			downloadhasil.getElementsByTagName('h3')[0].textContent = (new Date).toString()
			res({
				downloadhasil:downloadhasil.outerHTML,
			})
		break
		case 'reset tabel':
			isitabel.splice(0, isitabel.length)
			res({
				info:'tabel reset',
			})
		break
	}
})