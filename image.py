import requests
from bs4 import BeautifulSoup

def scrape_game_posters(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all image tags (you may need to adjust the selector based on the page structure)
        images = soup.find_all('img')
        
        # Extract the source URLs of the images
        image_urls = []
        for img in images:
            src = img.get('src')
            if src:
                image_urls.append(src)
        
        return image_urls
    else:
        print(f"Failed to retrieve content: {response.status_code}")
        return []

# Example usage
url = 'https://www.youtube.com/gaming'  # Replace with the actual URL
posters = scrape_game_posters(url)

# Print the scraped image URLs
for poster in posters:
    print(poster)