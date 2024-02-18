function navDropDownClick() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function toolVisibilityClick(e, sectionName) {
    const clickedElement = e.target;
    if(e.target) {
        const visibilityIcon = clickedElement.getElementsByTagName('img')[0];
        const sectionElement = document.getElementById(sectionName);
        if(visibilityIcon?.style.display == 'none') {
            visibilityIcon.style.display = 'block';
            sectionElement.style.display = 'inline-block';
        }
        else {
            visibilityIcon.style.display = 'none';
            sectionElement.style.display = 'none';
        }
    }
}

function changeView(event) {
    const {value} = event.target;
    event.preventDefault();
    if(value === "sounds") {
        document.getElementById("gameView").style.display = "none";
        document.getElementById("soundView").style.display = "block";
    }
    else {
        document.getElementById("gameView").style.display = "block";
        document.getElementById("soundView").style.display = "none";
    }
}

// Close the dropdown if the user clicks outside of it
/*window.onclick = function (e) {
    if (!e.target.matches('.dropbtn') && !e.target.matches('.dropdown-nav-item')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}*/