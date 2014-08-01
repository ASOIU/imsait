//////////////////////////
//All
//////P.S. querySelectorAll faster than getElementsByClassName, getElementsByTagName and getElementById
//////But do not use querySelector! is so slow
"use strict";	//ECMAscript 5


var Logo = (function() {
	var _cLogo;
	var _particles = [];
	var _drawTimeout;
	var _mousePos = {x:0, y:0};
	var _isDrawing = false;
	
	var draw = function() {
		var logoWidth  = _logo_.width;
		var logoHeight = _logo_.height;
		var logoScale = _logo_.dataset.scale;
		
		_cLogo.clearRect(0, 0, logoWidth, logoHeight);
        
		var i, dx, dy, p, scale = 1;
		
		_cLogo.fillStyle   = "#FFF";
		_cLogo.strokeStyle = "#000";
		_cLogo.lineWidth   = 3;
 		
 		for(i=_particles.length; i--;){
			p = _particles[i];
			
			dx = p.x - _mousePos.x*logoScale;
			dy = p.y - _mousePos.y;
			
			scale = (_isDrawing) ? Math.max(Math.min(logoHeight/10 - (Math.sqrt(dx*dx + dy*dy)/(logoHeight/5)),(logoHeight/10/2.4)),1) : 1;

			_cLogo.beginPath();
			_cLogo.arc(p.x, p.y, 2*scale, 0, Math.PI*2, true);
			_cLogo.closePath();
			_cLogo.stroke();
	    	_cLogo.fill();
		}
		
	};
	
	var mouseIn = function(e){
		_drawTimeout = setInterval(function(){
			if(_isDrawing){
				draw();
				_isDrawing = false;
			}
		}, 20);
	};
	
	var mouseMove = function(e){
		_mousePos.x = e.offsetX||(e.layerX - _logo_.offsetLeft);
   		_mousePos.y = e.offsetY||(e.layerY - _logo_.offsetTop);
		_isDrawing = true;
	};
	
	var mouseOut = function(e){
		_isDrawing = false;
		clearInterval(_drawTimeout);
		draw();
	};
	
	var resize = function(){
		_logo_.width  = Math.floor(_logo_.clientWidth*_logo_.dataset.scale);
		_logo_.height = _logo_.clientHeight;

		draw();		
	};
	
	return {
		configure: function() {
			var textRaster = document.createElement('canvas');
			
			_cLogo = _logo_.getContext('2d');
			var cTextRaster = textRaster.getContext('2d');
						
			var logoWidth  = textRaster.width  = _logo_.width  = Math.floor(_logo_.clientWidth*_logo_.dataset.scale);
			var logoHeight = textRaster.height = _logo_.height = _logo_.clientHeight;
			
			///////////////
			cTextRaster.font = window.getComputedStyle(_logo_, null)["font"];
			cTextRaster.fillText(_logo_.dataset.text, (logoWidth/2)-(Math.round(cTextRaster.measureText(_logo_.dataset.text).width/2)), logoHeight-4);
		
			///////////////////
			var imageData = cTextRaster.getImageData(0, 0, logoWidth, logoHeight).data;
			var density=+_logo_.dataset.density;
			var w,h;
			
			_particles = [];
			
			for(w=logoWidth; w--;){
				for(h=logoHeight; h--;){
					if(imageData[((w+(h*logoWidth))*4*density)-1]==255) _particles.push({x:w*density, y:h*density});
				}
			}
			
			draw();
			
			window.addEventListener("resize", resize, false);
			_logo_.addEventListener('mousemove', mouseMove, false);
			_logo_.addEventListener('mouseout',  mouseOut, false);
			_logo_.addEventListener('mouseover', mouseIn, false);
			
			Logo = null;	//:-)
		}
	}
})();

var CatSlider = (function() {
	var _el, _categories, _navcategories, _isAnimating = false, _current = 0;
	
	var showCategory = function(catidx) {
		if(catidx === _current || _isAnimating) {
			return false;
		}
		_isAnimating = true;
		
		// update selected navigation
		_navcategories[_current].classList.remove("mi-selected");
		_navcategories[catidx]  .classList.add("mi-selected");

		// current category
		var currcat      = _categories[_current];
		var currcatchild = currcat.children;
		// new category
		var newcat      = _categories[catidx];
		var newcatchild = newcat.children;

		if(catidx > _current){
			var toClass   = "mi-moveToLeft";
			var fromClass = "mi-moveFromRight";
			var lastEnter = newcatchild.length - 1;
		} else {
			var toClass   = "mi-moveToRight";
			var fromClass = "mi-moveFromLeft";
			var lastEnter = 0;
		}
		var midOut = ~~(currcatchild.length/2) - 1;

		currcat.className = toClass;
		currcatchild[midOut].addEventListener("animationend", function animOut() {
			this.removeEventListener("animationend", animOut, false);
			
			newcat.className = fromClass;
			newcatchild[lastEnter].addEventListener("animationend", function animEnter() {
				this.removeEventListener("animationend", animEnter, false);
				
				newcat.classList.add("mi-current");
				_current = catidx;
				_isAnimating = false;
			}, false);
		}, false);
	}

	return {
		configure: function(element) {
			_el = element;
			_categories = _el.firstElementChild.children;		//(ui)
			_navcategories = _el.querySelectorAll("nav > a");
			
			_categories[0]   .classList.add("mi-current");
			_navcategories[0].classList.add("mi-selected");
			
			// initialize the events
			for(var i=_navcategories.length; i--;){
				_navcategories[i].addEventListener("click", function(i){return function() {
				   showCategory(i);
				}}(i), false);
			}
		}
	}
})();

window.onload = function()
{
	_logo_||(_logo_=document.getElementById("_logo_"));
	_close_||(_logo_=document.getElementById("_close_"));
	
	Logo.configure();
	CatSlider.configure(document.querySelectorAll("#mi-slider")[0]);
	//$("#letter-container").lettering(); //ON only after optimize
	
	
	
	var mw = document.querySelectorAll(".mainlinks_wrap")[0];
	var ddw = document.querySelectorAll(".doc_wrap")[0];
	var ddd = document.querySelectorAll(".doc")[0];
	var pw = document.querySelectorAll(".projects_wrap")[0];
	var first = document.querySelectorAll("#first")[0];
	
	/*  Заметка про событие Hashchange http://y3x.ru/2011/06/hashchange/  */
	
	first.addEventListener("click", function(){
		ddw.style.display = "block";
		ddd.style.minHeight = mw.style.minHeight 
			= (document.documentElement.clientHeight-(pw.clientHeight + ~~window.getComputedStyle(pw, null)["paddingTop"] + ~~window.getComputedStyle(pw, null)["paddingBottom"])+420) + "px";
		
		document.location.hash = "toDocTop";
		
		////document.documentElement.style.marginTop = -document.documentElement.scrollTop + "px";
		document.documentElement.style.overflow = "hidden";
		/*добавить запись нужного хештега*/
	}, false);
	
	_close_.addEventListener("click", function(){
		document.documentElement.style.overflow = "auto";
		document.location.hash = "";
		
		ddd.style.minHeight = mw.style.minHeight = "0px";
		ddw.style.display = "none";
	}, false);
	
	
}