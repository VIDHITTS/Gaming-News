import requests
from bs4 import BeautifulSoup

def scrape_game_posters(url):
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        images = soup.find_all('img')
        
        image_urls = []
        for img in images:
            src = img.get('src')
            if src:
                image_urls.append(src)
        
        return image_urls
    else:
        print(f"Failed to retrieve content: {response.status_code}")
        return []

url = 'https://www.youtube.com/gaming'
posters = scrape_game_posters(url)

for poster in posters:
    print(poster)