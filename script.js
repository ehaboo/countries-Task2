
/// <reference path="jquery-3.7.0.js"/>

$(() => {

    $("#loadAllCountries").on("click", loadAllCountries );

    async function loadAllCountries(){
        try{
            const countries = await getJson("https://restcountries.com/v3.1/all");
            getResultsInfo(countries);
            getCountryAndPopulation(countries);
            getRegion(countries);
            displayCurrencies( countries );
        }
        catch( err ){
            alert( err.message )
        }
    }  
    
    $("#searchBtn").on("click", loadFoundedCountries );

    async function loadFoundedCountries(){
        const searchValue = $("#searchValue").val();
        try{
            const countries = await getJson(`https://restcountries.com/v3.1/name/${searchValue}`);
            getResultsInfo(countries);
            getCountryAndPopulation(countries);
            getRegion(countries);
            displayCurrencies( countries );

        }
        catch( err ){

            $("#resultsInfo").html(`<span>For Searching ${searchValue} Nothing Founded!</span>`);
            
        }
       
        $("#searchValue").val("");
    }  
   
    function getResultsInfo(countries) {
        
        let totalPopulation = 0; 

        for (const country of countries) {
            totalPopulation += country.population; 
        }

        const populationAverage = Math.floor(totalPopulation / countries.length) ; 

        let results = `
            <span>Total countries result: ${countries.length}</span> <br/>
            <span>Total Countries Population: ${totalPopulation}</span> <br/>
            <span>Average Population: ${populationAverage}</span>
        `;

        $("#resultsInfo").html(results); 
        
    }

    function getCountryAndPopulation(countries) {
        
        let tableStructure = `
            <tr>
                <th>Country Name</th>
                <th>Number of citizens</th>
            </tr>
             `; 
    
        let countryAndPopulation = "";

        for (const country of countries) {
            countryAndPopulation += getCountryHtml(country);
        }

        $("#CountriesStructure").html(tableStructure);
        $("#CountriesInfo").html(countryAndPopulation);
    }

    function getCountryHtml(country) {
        return `
                <tr>
                    <td>${country.name.common}</td>
                    <td>${country.population}</td>
                </tr>
             `;
    }
       function displayCurrencies( countries ) {

        let currenciesStructure = `
            <tr>
                <th>Currencies</th>
                <th>Number of countries</th>
            </tr>
             `; 

        const cur = new Map();

        for (const country of countries) {
            const currencies = country.currencies;
            for( const key in currencies ){
                if( !cur.has(key) ) cur.set(key, 0 );
                cur.set(key, cur.get(key) + 1 );
            }
        }

        let content = ""; 

        for( const entry of cur.entries() ){
            const key = entry[0];
            const value = entry[1];

            content += `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `;
        }

        $("#currenciesStructure").html(currenciesStructure);
        $("#currenciesInfo").html(content);



    }

    function getRegion(countries) {
        
        let regionTableStructure = `
            <tr>
                <th>Region</th>
                <th>Number of countries</th>
            </tr>
            `; 
    
        let regionCount = {};

        for (const country of countries) {
            if(!regionCount[country.region]){
                regionCount[country.region] = 0; 
            }
            regionCount[country.region]++; 
            
        }
        
        let regionStats = getRegionStats(regionCount); 

        $("#regionStructure").html(regionTableStructure);
        $("#regionInfo").html(regionStats);
    }
  
    function getRegionStats(regionCount) {
        let regionStats = ""; 
        for (const region in regionCount) {
            regionStats += `
                <tr>
                    <td>${region}</td>
                    <td>${regionCount[region]}</td>
                </tr>

            `;
        }
        return regionStats;
    }

    function getJson(url){
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                success: data => resolve(data),
                error: err => reject( err.statusText )
            })
        });
    }


});