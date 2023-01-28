// Example query:
// GET https://api.openbrewerydb.org/breweries?by_state=ohio&sort=type,name:asc&per_page=3
// GET https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=${resultsCount}

let resultsDiv = document.querySelector(".js-results");
let form = document.querySelector("form");
let stateField = document.querySelector("[name=state]");
let typeField = document.querySelector("[name=type]");
let resultsCountField = 100;

resultsDiv.innerHTML = `<div>
  <h5>BREWERY TYPES</h5>
  <ul>
    <li>Micro - Most craft breweries.For example, Samual Adams is still considered a micro brewery.</li>
    <li>Nano - An extremely small brewery which typically only distributes locally.</li>
    <li>Regional - A regional location of an expanded brewery. Ex.Sierra Nevada&#39s Asheville, NC location.</li>
    <li>Brewpub - A beer - focused restaurant or restaurant / bar with a brewery on - premise.</li>
    <li>Large - A very large brewery.Likely not for visitors. Ex.Miller - Coors.(deprecated)</li>
    <li>Planning - A brewery in planning or not yet opened to the public.</li>
    <li>Bar - A bar. No brewery equipment on premise.(deprecated)</li>
    <li>Contract - A brewery that uses another brewery&#39s equipment.</li>
    <li>Proprietor - Similar to contract brewing but refers more to a brewery incubator.</li>
    <li>Closed - A location which has been closed.</li>
  </ul>
</div>`

function getUrl(state) {
    return `https://api.openbrewerydb.org/breweries/search?query=${state}`;
}

function breweryToHtmlString(brewery) {
    let fullName = `${brewery.name}`;
    let breweryType = `${brewery.brewery_type}`;

    let brewStreet = "Unknown";
    if (brewery.street !== null) {
        brewStreet = `${brewery.street}`;
    }
    let phone = "Unknown";
    if (brewery.phone !== null) {
        phone = `${brewery.phone}`;
        phone = phone.replace(/\D+/g, '')
        phone = phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
        phone = ('(' + (phone));
    }

    let webSite = "Unknown";
    if (brewery.website_url !== null) {
        webSite = `<a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a>`;
    }

    if ((typeField.value == `${brewery.brewery_type}`)) {
        return `
        <div class="brewery-container">
          <h4>${breweryType}</h4>
          <h4>${fullName}</h4>
          <table>
            <tbody>
              <tr>
                <td>🍺</td>
                <td>
                  <p class="address">
                    ${brewStreet} <br />
                    ${brewery.city}, ${brewery.state}, ${brewery.postal_code} <br />
                    ${brewery.country}
                  </p>            
                </td>
              </tr>
              <tr>
                <td>🌐</td>
                <td>${webSite}</td>
              </tr>
              <tr>
                <td>☎</td>
                <td>${phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
}

function displayRandomBrewery(response) {
    let results = response;
    let html = results.map(breweryToHtmlString).join("");
    if (html == "") {
        resultsDiv.innerHTML = `No ${typeField.value} Breweries Found in ${stateField.value}`;
    } else {
        resultsDiv.innerHTML = html;
    }
}

function submitCallback(eventObject) {
    eventObject.preventDefault();

    let state = stateField.value;
    let url = getUrl(state);

    fetch(url)
        .then((data) => data.json())
        .then(displayRandomBrewery)
        .catch((error) => {
            console.error(error.message);
            alert("There was an error fetching the data");
        });
}

form.addEventListener("submit", submitCallback);