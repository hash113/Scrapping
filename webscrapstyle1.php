<html>
<body>
<?php
    // Defining the basic cURL function
    function curl($url) {
        $ch = curl_init(); // Initialising cURL
        curl_setopt($ch, CURLOPT_URL, $url);    // Setting cURL's URL option with the $url variable passed into the function
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); // Setting cURL's option to return the webpage data
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        curl_close($ch);    // Closing cURL
        return $data;   // Returning the data from the function
  
  }
  
  
  
  
  function scrape_between($data, $start, $end){
        $data = stristr($data, $start); // Stripping all data from before $start
        $data = substr($data, strlen($start));  // Stripping $start
        $stop = stripos($data, $end);   // Getting the position of the $end of the data to scrape
        $data = substr($data, 0, $stop);    // Stripping all data from after and including the $end of the data to scrape
        return $data;   // Returning the scraped data from the function
    }
  

   $scraped_page = curl("http://www.imdb.com");    // Downloading IMDB home page to variable $scraped_page
    $scraped_data = scrape_between($scraped_page, "<title>", "</title>");   // Scraping downloaded dara in $scraped_page for content between <title> and </title> tags
     
    echo $scraped_data; // Echoing $scraped data, should show "The Internet Movie Database (IMDb)"
 
  ?>


</body>
</html>
endoboy:1245