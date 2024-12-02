document.addEventListener("DOMContentLoaded", () => {
    const breedsList = document.getElementById("main-js");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    const breedOption = document.getElementById("breed-select");
    const hamburger = document.getElementById("hamburger-js");
    const dropdown = document.getElementById("dropdown-js")
    let breedsData = {};
    let currentInterval;
   
    // Fetch the list of dog breeds from the API
    fetch("https://dog.ceo/api/breeds/list/all")
    .then(response => response.json())
    .then(data => {
        breedsData = data.message;
        //populate dropdown
        populateBreedDropdown(Object.keys(breedsData));

        // Display all breeds initially
        displayBreeds(Object.keys(breedsData)); 
        
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        breedsList.innerHTML = "<div style='color: red;  font-size: 2rem;'>Failed to load breeds</div>";
    });

    function populateBreedDropdown(breeds) {
        breedOption.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a breed";

        breedOption.appendChild(defaultOption);

        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            option.textContent = breed;
            

            breedOption.appendChild(option)
        });
    }

    //function to display breeds in the list
    function displayBreeds(breeds) {
        breedsList.innerHTML = ""; // Clear the list
        breeds.forEach(breed => {
            const listItem = document.createElement("p");
            listItem.textContent = breed;
            
            const dogImage = document.createElement("img");
            dogImage.style.display = "none";
            dogImage.style.maxWidth = "300px";
            dogImage.style.height = "300px"
            dogImage.style.marginTop = "10px";



            breedsList.appendChild(listItem);
            listItem.appendChild(dogImage);


    
            let breedurl = breed;
            if(breedsData[breed].length > 0) {
                breedurl = `${breed}/${breedsData[breed][0]}`
            }
            startSlideshow(breedurl, dogImage)       
        })
    }


    function startSlideshow(breedurl, imageElement) {
        function fetchDisplayImage() {
            fetch(`https://dog.ceo/api/breed/${breedurl}/images/random`)
            .then(response => response.json())
            .then(imageData => {
                imageElement.src = imageData.message;
                imageElement.style.display = "block"
            })
            .catch(error => {
                console.error("Error fetching dog image:", error);
                imageElement.style.display = "none"
            });
        }

        fetchDisplayImage();

        //set interval to change the image every 3 seconds
        setInterval(fetchDisplayImage, 2000);
    }

    //event for dropdown 
    breedOption.addEventListener("change", () => {
        const selectedBreed = breedOption.value;

        if (selectedBreed) {
            displaySingleBreeds(selectedBreed)
        }
    });

    //display only selected breed 
    function displaySingleBreeds(breed) {
        clearInterval(currentInterval);

        breedsList.innerHTML = "";
        const listItem = document.createElement("p");
        listItem.textContent = breed;

        const dogImage = document.createElement("img");
        dogImage.style.display = "block";
        dogImage.style.maxWidth = "300px";
        dogImage.style.height = "300px"
        dogImage.style.marginTop = "10px";

        breedsList.appendChild(listItem);
        listItem.appendChild(dogImage);



        let breedurl = breed;
        if(breedsData[breed].length > 0) {
            breedurl = `${breed}/${breedsData[breed][0]}`
        }

        currentInterval = setInterval(() => {
            fetch(`https://dog.ceo/api/breed/${breedurl}/images/random`)
            .then(response => response.json())
            .then(imageData => {
                dogImage.src = imageData.message;
            })
            .catch(error => {
                console.error("Error fetching dog image:", error);
            });
        }, 3000)
    }

    // Event listener for input typing (dynamic search)
    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase();
        const filteredBreeds = Object.keys(breedsData).filter(breed =>
            breed.toLowerCase().includes(searchQuery)
        );
        displayBreeds(filteredBreeds); 
        // Update the displayed list based on the search
    });

    // Event listener for search button click (finalize search results)
    searchButton.addEventListener("click", () => {
        const searchQuery = searchInput.value.toLowerCase();
        const filteredBreeds = Object.keys(breedsData).filter(breed =>
            breed.toLowerCase().includes(searchQuery)
        );
        displayBreeds(filteredBreeds); 
        // Display filtered results
    });

    //event listener for hamburger 
    hamburger.addEventListener("click", () => {
        dropdown.style.display = "block"
        hamburger.classList.toggle('active');

        if (hamburger.classList.contains('active')) {
            console.log('menu opened')
        } else {
            window.location.href = "index.html";
            dropdown.style.display = "none"
        }
    })
})