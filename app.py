import time
import os
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

data_dir = os.path.join(os.path.dirname(__file__), 'public', 'data')
os.makedirs(data_dir, exist_ok=True)

def write_to_file(filename, content):
    """Write content to file in the data directory"""
    filepath = os.path.join(data_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return filepath

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

try:
    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 10)
    logger.info("Chrome WebDriver initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Chrome WebDriver: {e}")
    exit(1)

xpaths = {
    "Valorant": {
        "views": "//*[@id='game-views-count']",
        "image": "//*[@id='game-thumbnail']"
    },
    "GTA V": {
        "views": "//*[@id='gta-views-count']",
        "image": "//*[@id='gta-thumbnail']"
    },
    "League of Legends": {
        "views": "//*[@id='lol-views-count']",
        "image": "//*[@id='lol-thumbnail']"
    },
    "Mobile Legends": {
        "views": "//*[@id='ml-views-count']",
        "image": "//*[@id='ml-thumbnail']"
    }
}

try:
    while True:
        for game, paths in xpaths.items():
            try:
                driver.get("https://www.youtube.com/gaming")
                logger.info(f"Attempting to retrieve data for {game}")
                
                views_element = wait.until(EC.presence_of_element_located((By.XPATH, paths["views"])))
                views = views_element.text

                image_element = wait.until(EC.presence_of_element_located((By.XPATH, paths["image"])))
                image_url = image_element.get_attribute("src")

                views_filename = f'{game.lower().replace(" ", "_")}_views.txt'
                image_filename = f'{game.lower().replace(" ", "_")}_image_url.txt'

                write_to_file(views_filename, views)
                write_to_file(image_filename, image_url)

                logger.info(f"Updated {game}: Views = {views}, Image URL = {image_url}")

            except TimeoutException:
                logger.warning(f"Timeout while retrieving data for {game}")
            except NoSuchElementException:
                logger.warning(f"Element not found for {game}")
            except Exception as e:
                logger.error(f"Failed to retrieve data for {game}: {e}")

        time.sleep(5)

except KeyboardInterrupt:
    logger.info("Scraper stopped by user")
except Exception as e:
    logger.error(f"An unexpected error occurred: {e}")
finally:
    driver.quit()
    logger.info("Chrome WebDriver closed")
