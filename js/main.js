/*****
Wait for DOMContentLoaded event
fetch the configuration info for image locations and sizes
Focus on the text field
Listen for click on search button 
Listen for keypress and <enter> or <return>

After the click / <enter>-press run a fetch
result come back from fetch
show the movie results page
loop thourght the results and build <div>s  <- based on our template

make something in the div clickable
-- when they click on the element then we will trigger movie recomendations --
get the id from the clickable element
fetch the recommendations based on the movie id


*****/

let app = {
    URL: 'https://api.themoviedb.org/3/',
    IMAGEBASEURL: 'https://image.tmdb.org/t/p/w185',
    INPUT: null,
    init: function(){
        //fetch config info
        app.INPUT = document.getElementById('search-input');
        app.INPUT.focus();
        //add click listener
        let srchbtn = document.getElementById('search-button');
        srchbtn.addEventListener('click', app.runSearch);
        
        let bckbtn = document.getElementById('back-button');
        bckbtn.addEventListener('click', app.goBack);
        //listen for enter or return
        document.addEventListener('keypress', function(ev){
            let char =ev.char || ev.charCode || ev.which;
             if(char == 10 || char == 13){
                 //if they hit enter or return
                 srchbtn.dispatchEvent(new MouseEvent('click'));
             }
            
        })
    },
    runSearch: function(ev){
        ev.preventDefault();
        
        
        
        
        if(app.INPUT.value ){
            document.querySelector('.search').classList.add('moveButtonTop');
            document.querySelector('.titleImage').classList.add('hide');
            //if they actually typed something other than <enter>
            let url= app.URL + "search/movie?api_key=" + KEY;
            url += "&query=" +app.INPUT.value;
            document.querySelector('.active').classList.remove('active');
            document.getElementById('search-results').classList.add('active');
            
            
            
            //`${app.URL}search/movie?api_key=${KEY}&query=${app.INPUT.value}`
            
            fetch(url)
            .then( response => response.json() )
            .then( data => {
                console.log(data);
                app.showMovies(data.results);
            } )
            .catch( err => {
                console.log(err);
            } );
            
        }
    },
        
    
    
    
    showMovies: function(movies){
        
        
        let section = document.querySelector('#search-results .content');
 
        let topText = document.querySelector('.Searchtitle')
        let titleText = document.querySelector('.titleText');
            titleText.innerHTML = "";
            titleText.innerHTML = "Searched for:  '" + app.INPUT.value + "'" + " - " + movies.length + " results";
            
            topText.appendChild(titleText);
        
        let df = document.createDocumentFragment();
        section.innerHTML = "";
       
        
        movies.forEach(function(movie){
            
            let div = document.createElement('div');
            let title = document.createElement('h2');
            let img = document.createElement('img');
            let movDes = document.createElement('h3');
            
            div.setAttribute("data-movie", movie.id);
            console.log(movie.id);
            div.addEventListener('click', app.getRecommended);
            div.classList.add('movie');
            div.classList.add('movieTitle');

            title.textContent = movie.title;
            title.classList.add('movieTitle');
            
            img.src =''.concat(app.IMAGEBASEURL, movie.poster_path);
            img.setAttribute('alt',movie.title);
            img.setAttribute('title',movie.title);
            div.classList.add('movie');
            
            movDes.classList.add('movie');
            movDes.classList.add('description')
            movDes.textContent = movie.overview;
            
            
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(movDes);
            df.appendChild(div);
            
            
            
            window.scrollTo(0,0);
        });
        section.appendChild(df);
        
    },
    getRecommended: function(ev){
        //part of the url here is the movie id <- included in movie obj
        let movie_id = ev.currentTarget.getAttribute('data-movie');
        console.log("You clicked", movie_id);
        
            document.querySelector('.active').classList.remove('active');
            document.getElementById('recommend-results').classList.add('active');
        
        let recommendedUrl = app.URL + 'movie/' + movie_id + '/recommendations?api_key=' + KEY + '&language=en-US&page=1';
        
        fetch(recommendedUrl)
            .then( response => response.json() ) 
            .then( data => {
                console.log(data);
                app.showMovieRecommendations(data.results);
            } )
            .catch( err => {
                console.log(err);
            } );
        
        
    },
    showMovieRecommendations: function(movies){
        
        let section = document.querySelector('#recommend-results .content');
        
        let topText = document.querySelector('.Recommendtitle')
        let titleText = document.querySelector('.recommendedTitle');
            titleText.innerHTML = "";
            titleText.innerHTML =  movies.length + " recommended results";
            topText.appendChild(titleText);
        
        let df = document.createDocumentFragment();
        section.innerHTML = "";
        movies.forEach(function(movie){
            
            
            
            let div = document.createElement('div');
            let title = document.createElement('h2');
            let img = document.createElement('img');
            let movDes = document.createElement('h3');
            let relDate = document.createElement('p');
            
            div.setAttribute("data-movie", movie.id);
            console.log(movie.id);
            div.addEventListener('click', app.getRecommended);
            div.classList.add('movie');
            div.classList.add('movieTitle');

            title.textContent = movie.title;
            
            img.src =''.concat(app.IMAGEBASEURL, movie.poster_path);
            div.classList.add('movie');
            
            movDes.classList.add('movie');
            movDes.classList.add('description')
            movDes.textContent = movie.overview;
            
            relDate.classList.add('movie');
            relDate.classList.add('releaseDate');
            relDate.textContent = "Release date = " + movie.release_date;
            
            
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(movDes);
            div.appendChild(relDate);
            df.appendChild(div);
            
            window.scrollTo(0,0);
        });
        section.appendChild(df);
        
    },
    goBack: function(ev){
        location.reload(true);
    }
};


document.addEventListener('DOMContentLoaded', app.init);

































