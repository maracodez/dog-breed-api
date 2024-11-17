document.addEventListener("DOMContentLoaded", () => {
    const breedsList = document.getElementById("main-js");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    let breedsData = {};


    // Fetch the list of dog breeds from the API
    fetch("https://dog.ceo/api/breeds/list/all")
        .then(response => response.json())
        .then(data => {
            breedsData = data.message;
            displayBreeds(Object.keys(breedsData)); // Display all breeds initially
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            breedsList.innerHTML = "<div style='color: red;  font-size: 2rem;'>Failed to load breeds</div>";
        });

    // Function to display breeds in the list
    function displayBreeds(breeds) {
        breedsList.innerHTML = ""; // Clear the list
        breeds.forEach(breed => {
            const listItem = document.createElement("p");
            listItem.textContent = breed;
            

            const dogImage = document.createElement("img");
            


            // Add event listener to fetch image on click
            listItem.addEventListener("click", () => {
                let breedurl = breed;
                if (breedsData[breed].length > 0) {
                    breedurl = `${breed}/${breedsData[breed][0]}`;
                }
                fetch(`https://dog.ceo/api/breed/${breedurl}/images/random`)
                .then(response => response.json())
                .then(imageData => {
                    dogImage.src = imageData.message;
                    dogImage.style.display = "block";
                })
                .catch(error => {
                    console.error("Error fetching dog image:", error);
                    dogImage.style.display = "none";
                });
            });

            breedsList.appendChild(listItem);
            listItem.appendChild(dogImage)
        });

       
    }

    // Event listener for input typing (dynamic search)
    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase();
        const filteredBreeds = Object.keys(breedsData).filter(breed =>
            breed.toLowerCase().includes(searchQuery)
        );
        displayBreeds(filteredBreeds); // Update the displayed list based on the search
    });

    // Event listener for search button click (finalize search results)
    searchButton.addEventListener("click", () => {
        const searchQuery = searchInput.value.toLowerCase();
        const filteredBreeds = Object.keys(breedsData).filter(breed =>
            breed.toLowerCase().includes(searchQuery)
        );
        displayBreeds(filteredBreeds); // Display filtered results
    });
});