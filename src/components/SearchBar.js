import "../styles/SearchBar.css"

import search from "../images/search.png"

function SearchBar () {
    return (
        <div className="search_container">
            <div className="search">
                <input type="text" placeholder="Search for a user" />
                <img src={search} alt="search" />
            </div>
        </div>
    );
}

export default SearchBar;