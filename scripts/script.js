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
	const lecteur = document.getElementById("lecteur");
	const source = document.getElementById("source");
	const corps = document.getElementById("corps");	
	const timeEnd = document.getElementById("timeEnd");
	const volume = document.getElementById("volume");
	const options = document.getElementById("section_option1");
	const shuffle = document.getElementById("shuffle");
	//On teste le fichier au changement d'état de input:file
	source.addEventListener("change",()=>{
			if(validite_fichier(source.files[0].name)){
				if(existence_son(titre_chanson(source.files[0].name),playlist)){
					sentinelle = false;
					alert("Ce fichier existe déjà dans la playlist !");
				}else{
					sentinelle = true;
					url = window.URL.createObjectURL(source.files[0]);
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
			let elt = '<div class="elt_liste"><span data-blob='+url+' data-position='+(compteur-1)+' class="titre_chanson">'+compteur+' - '+titre_chanson(source.files[0].name)+'</span><br/><span class="sous_titre_chanson">Artiste</span><br/><span class="sous_titre_chanson">Album</span><span class="time">'+format_date(audioAlt.duration)+'</span>';
			corps.insertAdjacentHTML("beforeend",elt);
			if(!audio.currentTime){
				audio.dataset.position = compteur-1;
			}
			playlist.push({'id':compteur,'titre':titre_chanson(source.files[0].name),'url':url,'duree':format_date(audioAlt.duration)});
			//sessionStorage.setItem("playlist",JSON.stringify(playlist));
			sentinelle = false;
			compteur++;
		}
	},false);
	/*Event click sur la section des options audios*/
	options.addEventListener("click",(e)=>{
		if(e.target.id === "section_option1"){
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
			timeEnd.innerHTML = "0:0";

		}else if(e.target.id === "shuffle"){

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
    //Event pour la lecture aléatoire
    shuffle.addEventListener("click",(e)=>{
    	if(!random){random = true;}
    	else{random = false;}
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
	return Math.round(duree_seconde/60*10)/10;
}
//Fonction pour afficher le titre de la chanson sans l'extension
function titre_chanson(nom){
	let tableau = nom.split('.');
    return tableau[0];
    
}

