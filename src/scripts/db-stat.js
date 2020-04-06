document.addEventListener('DOMContentLoaded', evt => {
    firebase.database().ref('graphs/').once('value').then(function (data) {
        data.forEach(function (child) {
            console.log(child.key)
        })
    });
});