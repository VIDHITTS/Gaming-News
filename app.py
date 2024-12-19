from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Setup ChromeOptions for headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")

# Setup the WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open the YouTube Gaming page
driver.get("https://www.youtube.com/gaming/games")

# Wait for the page to load
wait = WebDriverWait(driver, 10)

# Define game names and their relative XPaths
xpaths = {
    "1st": {
        "views": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
        "image": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-img-shadow/img'
    },
    "2nd": {
        "views": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[2]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
        "image": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[2]/div[1]/ytd-game-details-renderer/a/yt-img-shadow/img'
    },
    "3rd": {
        "views": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[3]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
        "image": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[3]/div[1]/ytd-game-details-renderer/a/yt-img-shadow/img'
    },
    "4th": {
        "views": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[4]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
        "image": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[4]/div[1]/ytd-game-details-renderer/a/yt-img-shadow/img'
    }
}

try:
    while True:
        for game, paths in xpaths.items():
            try:
                # Retrieve views
                views_element = wait.until(EC.presence_of_element_located((By.XPATH, paths["views"])))
                views = views_element.text

                # Retrieve image URL
                image_element = wait.until(EC.presence_of_element_located((By.XPATH, paths["image"])))
                image_url = image_element.get_attribute("src")

                # Save to files
                views_filename = f'{game.lower().replace(" ", "_")}_views.txt'
                image_filename = f'{game.lower().replace(" ", "_")}_image_url.txt'

                with open(views_filename, 'w') as vf:
                    vf.write(views)

                with open(image_filename, 'w') as imf:
                    imf.write(image_url)

                print(f"Updated {game}: Views = {views}, Image URL = {image_url}")

            except Exception as e:
                print(f"Failed to retrieve data for {game}: {e}")

        time.sleep(5)

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the browser
    driver.quit()
