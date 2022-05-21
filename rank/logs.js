async function run(){
    let response = await fetch('/api/scores');
    let data = await response.json();
    
    data.forEach(item => {
        let root = document.createElement('h3');
        root.innerHTML = `${item.name}: ${item.score}`;
        document.getElementById('scores-container').append(root)
        lastscore = item.score;
    });

    document.querySelector('h1').innerHTML = `Top ${data.length}`
};

addEventListener('DOMContentLoaded', run)