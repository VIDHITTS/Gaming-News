from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Setup the WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Open the YouTube Gaming page
driver.get("https://www.youtube.com/gaming/games")

# Wait for the page to load
wait = WebDriverWait(driver, 10)

# Define game names and their relative XPaths
xpaths = {
     "GTA V": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
     "PUBG": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[2]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
     "Dragon Quest III HD-2D Remake": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[3]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
     "Mobile Legends": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[4]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]'
 }


try:
    while True:
        for game, xpath in xpaths.items():
            try:
                # Locate the element and get the text
                views_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
                views = views_element.text
                
                # Prepare file name
                filename = f'{game.lower().replace(" ", "_")}_views.txt'
                
                # Update the views in the file (overwrite content, no newline)
                with open(filename, 'w') as f:
                    f.write(views)
                
                print(f"Updated {game} views: {views}")
            except Exception as e:
                print(f"Failed to retrieve views for {game}: {e}")
        
        # Wait for 5 seconds before the next update
        time.sleep(5)

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the browser
    driver.quit()
