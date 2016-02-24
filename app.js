(function(){
  "use strict";


  var Moosipurk = function(){

    // SINGLETON PATTERN (4 rida)
    if(Moosipurk.instance){
      return Moosipurk.instance;
    }
    Moosipurk.instance = this; // this viitab moosipurgile

    this.routes = Moosipurk.routes;

    console.log(this);
    //console.log('moosipurgi sees');

    // KÕIK MUUTUJAD, mis on üldised ja muudetavad
    this.currentRoute = null; // hoian meeles mis lehel olen (home-view, ...)
    //Purgid
    this.jars = [];



    //panen rakenduse tööle
    this.init();
  };

  window.Moosipurk = Moosipurk;

  // kirjeldatud kõik lehed
  Moosipurk.routes = {
    "home-view": {
      'render': function(){
        // käivitan siis kui jõuan lehele
        console.log('JS avalehel');

        // kui olemas, teen nulliks
        if(this.interval){ clearInterval(this.interval); }

        // kui jõuan avalehele siis käivitub timer, mis hakkab trükkima kulunud sekundeid
        // divi sisse #counter
        // hakkab 0st
        var seconds = 0;
        this.interval = window.setInterval(function(){
          seconds++;
          document.querySelector('#counter').innerHTML = seconds;
        }, 1000); //iga 1000ms tagant käivitub

      }
    },
    "list-view": {
      'render': function(){
        console.log('JS loendi lehel');

      }
    },
    "manage-view": {
      'render': function(){
        console.log('JS halduse lehel');

      }
    }
  };

  //kõik moosipurgi funktsioonid tulevad siia sisse
  Moosipurk.prototype = {
    init: function(){
      console.log('rakendus käivitus');
      // Siia tuleb esialgne loogika

      window.addEventListener('hashchange', this.routeChange.bind(this));

      //vaatan mis lehel olen, kui ei ole hashi lisan avalehe
      console.log(window.location.hash);
      if(!window.location.hash){
        window.location.hash = "home-view";
      }else{
        //hash oli olemas, käivitan routeChange fn
        this.routeChange();

      }

      //Saan kätte kraami Local Storage'st
      if(localStorage.jars){
        //Võtan stringi ja teen objektideks
        this.jars = JSON.parse(localStorage.jars);

        //tekitan loendi
        this.jars.forEach(function(jar){

          var new_jar = new Jar(jar.title, jar. ingredients, jar.date);

          var li = new_jar.createHtmlElement();
          document.querySelector('.list-of-jars').appendChild(li);

        });


      }

      // hakka kuulama hiireklõpse
      this.bindEvents();
    },
    bindEvents: function(){
      document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

      //Kuulan trükkimist
      document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
    },

    search: function(event){
      //Mis on otsikastis
      var needle = document.querySelector('#search').value.toLowerCase();
      console.log(needle);
      var list = document.querySelectorAll('ul.list-of-jars li');
      console.log(list);
      for(var i = 0; i < list.length; i++){
        var li = list[i];
        var stack = li.querySelector('.content').innerHTML.toLowerCase();

        if(stack.indexOf(needle) !== -1){
          //Olemas
          li.style.display = 'list-item';
        }else{
          //Ei ole

          li.style.display = 'none';

        }

      }

    },
    addNewClick: function(event){
      // lisa uus purk
      var title = document.querySelector('.title').value;
      var ingredients = document.querySelector('.ingredients').value;
      var date = document.querySelector('.date').value;



      console.log(title + ' ' + ingredients + ' ' + date);

      var new_jar = new Jar(title, ingredients, date);

      //Lisan massiivi
      this.jars.push(new_jar);
      console.log(JSON.stringify(this.jars));
      //Stringina salvestan LocalStoragisse
      localStorage.setItem('jars', JSON.stringify(this.jars));

      var li = new_jar.createHtmlElement();
      document.querySelector('.list-of-jars').appendChild(li);
      console.log("salvestatud");
    },



    routeChange: function(event){

      // slice võtab võtab # ära #home-view >> home-view
      this.currentRoute = location.hash.slice(1);

      // kas leht on olemas
      if(this.routes[this.currentRoute]){
        //jah

        this.updateMenu();

        console.log('>>> ' + this.currentRoute);
        //käivitan selle lehe jaoks ettenähtud js
        this.routes[this.currentRoute].render();
      }else{
        // 404?
        console.log('404');
        window.location.hash = 'home-view';
      }

    },

    updateMenu: function(){

      //kui on mingil menüül klass active-menu siis võtame ära
      document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace(' active-menu', '');

      //käesolevale lehele lisan juurde
      document.querySelector('.' + this.currentRoute).className += ' active-menu';

    }

  };


  var Jar = function(new_title, new_ingredients, new_date){
    this.title = new_title;
    this.ingredients = new_ingredients;
    this.date = new_date;
  };

  Jar.prototype = {
    createHtmlElement: function(){
      // anda tagasi ilus html

      // li
      //   span.letter
      //     M
      //   span.content
      //     Maasikamoos | maasikas, õun

      var li = document.createElement('li');

      var span = document.createElement('span');
      span.className = 'letter';

      var letter = document.createTextNode(this.title.charAt(0));
      span.appendChild(letter);

      li.appendChild(span);

      var content_span = document.createElement('span');
      content_span.className = 'content';

      var content = document.createTextNode(this.title + ' | ' + this.ingredients + ' | ' + this.date);
      content_span.appendChild(content);

      li.appendChild(content_span);

      console.log(li);

      return li;
    }
  };


  window.onload = function(){
    var app = new Moosipurk();
  };

})();
