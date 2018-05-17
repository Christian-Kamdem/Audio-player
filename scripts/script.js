//On vérifie que le DOM est bien chargé
document.addEventListener("DOMContentLoaded",()=>{init();}	
,false);

//Début de la fonction init
function init(){
    let sentinelle = false;
    let url;
    let compteur = 1;
    let positionEltEnCours = compteur-1;
    let marqueurTemps = 0;
    let random = false;
    let playlist = [];	
    const audio = document.createElement("audio");
    const audioAlt = document.createElement("audio");
	const lecteur = document.getElementById("container_header");
	const source = document.getElementById("source");
	const corps = document.getElementById("container_body");
	const timeStart = document.getElementById("header_part3_nav1");	
	const timeEnd = document.getElementById("header_part3_nav2");
	const volume = document.getElementById("volume");
	const progress = document.getElementById("audio_progress");
	const options = document.getElementsByClassName("first_control");
	const fileDialog = document.createElement("input");
	fileDialog.type = "file";
	fileDialog.multiple = true;
	//On teste le fichier au changement d'état de input:file
	fileDialog.addEventListener("change",()=>{
			if(validite_fichier(fileDialog.files[0].name)){
				if(existence_son(titre_chanson(fileDialog.files[0].name),playlist)){
					sentinelle = false;
					alert("Ce fichier existe déjà dans la playlist !");
				}else{
					sentinelle = true;
					url = window.URL.createObjectURL(fileDialog.files[0]);
					audioAlt.src = url
				}				
			}else{
				sentinelle = false;
				alert("Fichier incompatible !");
			}

		},false);
	//On vérifie que le fichier est bien chargé afin d'obtenir son temps de lecture
	audioAlt.addEventListener("loadeddata",()=>{
		
		if(sentinelle){
			let elt = '<div class="item"><nav class="play"><img src="images/play-button.svg"/></nav><span class="artist" data-blob='+url+' data-position='+(compteur-1)+'>'+compteur+' - '+titre_chanson(fileDialog.files[0].name)+'<span class="title">Inconnu</span></span><div class="time">'+format_date(audioAlt.duration)+'</div></div>';
			corps.insertAdjacentHTML("beforeend",elt);
			if(!audio.currentTime){
				audio.dataset.position = compteur-1;
			}
			playlist.push({'id':compteur,'titre':titre_chanson(fileDialog.files[0].name),'url':url,'duree':format_date(audioAlt.duration)});
			//sessionStorage.setItem("playlist",JSON.stringify(playlist));
			sentinelle = false;
			compteur++;
		}
	},false);
	//On lance l'option de recherche window après le click
	source.addEventListener("click",()=>{		
		fileDialog.click();

	},false);
	/*Event click sur la section des options audios*/
	options[0].addEventListener("click",(e)=>{
		if(e.target.id === "first_control"){
			e.stopPropagation();

		}else if(e.target.id === "play"){
			audio.currentTime = marqueurTemps;
			marqueurTemps = 0;
			audio.volume = 0.5;
			timeEnd.innerHTML = playlist[audio.dataset.position].duree;
			audio.src = playlist[audio.dataset.position].url;
			audio.play();

		}else if(e.target.id === "pause"){
			marqueurTemps = audio.currentTime;
			audio.pause();

		}else if(e.target.id === "stop"){
			audio.pause();
			audio.currentTime = 0;
			timeEnd.innerHTML = "00:00:00";

		}else if(e.target.id === "shuffle"){
			if(!random){
				random = true;
				document.getElementById("shuffle").src = "images/expand-arrowsYellow.svg";
			}
    		else{
    			random = false;
    			document.getElementById("shuffle").src = "images/expand-arrows.svg";
    		}
		}else if(e.target.id === "precedent"){
			if(audio.dataset.position>0){
				audio.dataset.position -= 1;
				audio.src = playlist[audio.dataset.position].url;				
				audio.volume = 0.5;
				timeEnd.innerHTML = playlist[audio.dataset.position].duree;
				audio.play();
			}
		}else if(e.target.id === "suivant"){
			let y = playlist.length;
			let x = Number(audio.dataset.position) + 1;
			if(x<y){
				audio.dataset.position = x;
				audio.src = playlist[audio.dataset.position].url;
				audio.volume = 0.5;
				timeEnd.innerHTML = playlist[audio.dataset.position].duree;
				audio.play();
			}
		}

	},false);
	//Event pour lancer la musique en boucle
	audio.addEventListener("ended",()=>{
		if(random){
			let valeurAl = Math.floor(Math.random()*Math.floor(playlist.length-1));
			audio.src = playlist[valeurAl].url;
			audio.dataset.position = valeurAl;
			audio.volume = 0.5;
			timeEnd.innerHTML = playlist[valeurAl].duree;
			audio.play();
		}else{
			if(audio.dataset.position>0){
				audio.dataset.position -= 1;
				audio.src = playlist[audio.dataset.position].url;				
				audio.volume = 0.5;
				timeEnd.innerHTML = playlist[audio.dataset.position].duree;
				audio.play();
			}
		}
    },false);
	//Event pour le controle du volume
	    volume.addEventListener("change",(e)=>{
	      audio.volume = volume.value/100;
	    },false);
	//Event pour le changement de la position de la lecture
	    progress.addEventListener("change",(e)=>{
	      audio.currentTime = progress.value*audio.duration/100;
	    },false);
	//Event pour la gestion de la progress barre
    audio.addEventListener("timeupdate",(e)=>{
      progress.value = audio.currentTime/audio.duration*100;
    },false);
    //Event pour controler le click sur la playlist
    corps.addEventListener("click",(e)=>{
    	if(e.target.id !== "corps" && e.target.className === "titre_chanson"){
    		audio.src = e.target.dataset.blob;
    		audio.dataset.position = e.target.dataset.position;
    		timeEnd.innerHTML = playlist[e.target.dataset.position].duree;
    		audio.play();
    	}else{
    		e.stopPropagation();
    	}
    },false);
    /*Event pour notifier l'éffacement de la plylist
     au chargement de la page */
}
//Fin de la fonction init
//Fonction qui teste la validité du fichier
function validite_fichier(chemin){
	  let format_audio = ["mp3","ogg","webm","flac","mpeg","wave","mp4"];
      let tableau = chemin.split('.');
      let extension = tableau[tableau.length - 1];
      if(format_audio.indexOf(extension) >= 0){return true;}
      else{return false;}
}
/*Fonction pour tester si le titre d'un fichier audio 
existe déjà dans la plyslist avant de l'ajouter*/
function existence_son(nom,playlist){
	let taille = playlist.length;
	let i = 0;
	while(i<taille){
		if(playlist[i].titre.indexOf(nom) === 0){
			return true;
		}
		i++;
	}
	return false;
}
//Fonction qui formate la date
function format_date(duree_seconde){
	let time = parseInt(duree_seconde);
	let minutes = 0;
	minutes = (time - (time%60))/60;
	secondes = time - minutes*60;
	return minutes+" : "+time%60;
}
//Fonction pour afficher le titre de la chanson sans l'extension
function titre_chanson(nom){
	let tableau = nom.split('.');
    return tableau[0];
    
}

