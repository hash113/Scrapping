<html>
<body>
<p><div id="center"><br>
						Search Resources on web

		<script>
		function change(){
			var el1 = document.getElementById("tagline");
			var el2 = document.getElementById("text");
			el1.innerHTML = el2.value;
				}
		</script>



		<input type="text" id="text" onkeypress="change()">
		<div id="tagline"> </div><br>
		<div id="w3results">
		<?php
			// Defining the basic cURL function
			function curl($url) {
				// Assigning cURL options to an array
				$options = Array(
					CURLOPT_RETURNTRANSFER => TRUE,  // Setting cURL's option to return the webpage data
					CURLOPT_FOLLOWLOCATION => TRUE,  // Setting cURL to follow 'location' HTTP headers
					CURLOPT_AUTOREFERER => TRUE, // Automatically set the referer where following 'location' HTTP headers
					CURLOPT_CONNECTTIMEOUT => 120,   // Setting the amount of time (in seconds) before the request times out
					CURLOPT_TIMEOUT => 120,  // Setting the maximum amount of time for cURL to execute queries
					CURLOPT_MAXREDIRS => 10, // Setting the maximum number of redirections to follow
					CURLOPT_USERAGENT => "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1a2pre) Gecko/2008073000 Shredder/3.0a2pre ThunderBrowse/3.2.1.8",  // Setting the useragent
					CURLOPT_URL => $url, // Setting cURL's URL option with the $url variable passed into the function
				);
				 
				$ch = curl_init();  // Initialising cURL 
				curl_setopt_array($ch, $options);   // Setting cURL's options using the previously assigned array data in $options
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
		  
		  ///$answer=scrape_between($data1,$start,$end);
		   
		 
			$tag="style";
			$w3add="http://www.google.com/search?sitesearch=www.w3schools.com&as_q=";
			$url=$w3add.$tag;
			
			 // Assigning the URL we want to scrape to the variable $url
		 
			$results_page = curl($url); // Downloading the results page using our curl() funtion
			 
			$results_page = scrape_between($results_page, "<div id=\"center_col\">", "<div id=\"foot\">"); // Scraping out only the middle section of the results page that contains our results
			 
			//$separate_results = explode("<td class=\"image\">", $results_page);   // Expploding the results into separate parts into an array
				 
		   
			echo "W3 Schools";
			print_r($results_page); // Printing out our array of URLs we've just scraped
		  
		  ?>

		<div id="phpnetresults">
		<?php
			
		  //	php website search
		  
		  
		 
			$phpadd="http://in2.php.net/manual-lookup.php?pattern=";
			
			$url2=$phpadd.$tag."&lang=en&scope=quickref";
			 
			 $results_page2 = curl($url2); // Downloading the results page using our curl() funtion
		  
			$results_page2 = scrape_between($results_page2, "<ul id=\"quickref_functions\">", "</ul>"); // Scraping out only the middle section of the results page that contains our results
			
			echo "PHP.NET WEBSITE";
			print_r($results_page2); // Printing out our array of URLs we've just scraped
		  
		  
		  
		  ?>

		</div>


		<div id="tjssresults">
		<?php
			$jssadd="http://www.javascriptsource.com/search?q=";
			$url3=$jssadd.$tag;
			
			 // Assigning the URL we want to scrape to the variable $url
		 
			$results_page3 = curl($url3); // Downloading the results page using our curl() funtion
			 
			$results_page3 = scrape_between($results_page3, "<div id=\"search_result_body\">", "<div id=\"search_pagination\">"); // Scraping out only the middle section of the results page that contains our results
			 
			
				 
		   
			echo "The Javascript Source";
			print_r($results_page3); // Printing out our array of URLs we've just scraped
		  
		  ?>

		</p>
			</div>
			</div>
<style>			
#tjssresults
{
position:relative;

width:33%;
float:left;
height:500px;
overflow:scroll;

}
#w3results{width:33%;
border:1px;
float:left;
height:500px;
overflow:scroll;
}

#phpnetresults
{
position:relative;

width:33%;
float:left;
height:500px;
overflow:scroll;

}


#h{
font-size:24;
}

#center
{
height:600px;
width:100%
font-size:14;
background-color:white;

}

</style>
</body>
</html>
