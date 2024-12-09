# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from webdriver_manager.chrome import ChromeDriverManager
# import time

# # Setup the WebDriver
# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(service=service)

# # Open the YouTube Gaming page
# driver.get("https://www.youtube.com/gaming/games")

# # Wait for the page to load
# driver.implicitly_wait(10)

# # XPath for the GTA V views
# gta_xpath = '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]'

# try:
#     while True:
#         # Locate the element and extract the text
#         gta_views = driver.find_element(By.XPATH, gta_xpath).text
        
#         # Write the views to a text file
#         with open('gta_views.txt', 'w') as f:
#             f.write(gta_views)
        
#         print(f"Updated GTA V views: {gta_views}")
        
#         # Wait for 5 seconds before the next update
#         time.sleep(5)

# except Exception as e:
#     print(f"An error occurred: {e}")

# finally:
#     # Close the browser
#     driver.quit()

# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from webdriver_manager.chrome import ChromeDriverManager
# import time

# # Setup the WebDriver
# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(service=service)

# # Open the YouTube Gaming page
# driver.get("https://www.youtube.com/gaming/games")

# # Wait for the page to load
# driver.implicitly_wait(10)

# # XPaths for the game views
# xpaths = {
#     "GTA V": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
#     "PUBG": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[2]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
#     "League of Legends": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[3]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
#     "Mobile Legends": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[4]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]'
# }

# try:
#     while True:
#         for game, xpath in xpaths.items():
#             # Locate the element and extract the text
#             views = driver.find_element(By.XPATH, xpath).text
            
#             # Write the views to a text file
#             with open(f'{game.lower().replace(" ", "_")}_views.txt', 'w') as f:
#                 f.write(views)
            
#             print(f"Updated {game} views: {views}")
        
#         # Wait for 5 seconds before the next update
#         time.sleep(5)

# except Exception as e:
#     print(f"An error occurred: {e}")

# finally:
#     # Close the browser
#     driver.quit()


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

# XPaths for the game views (update these as necessary)
xpaths = {
    "GTA V": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[1]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
    "PUBG": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[2]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
    "League of Legends": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[3]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]',
    "Mobile Legends": '/html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-shelf-renderer/div[1]/div[2]/ytd-grid-renderer/div[1]/ytd-game-card-renderer[4]/div[1]/ytd-game-details-renderer/a/yt-formatted-string[3]/span[1]'
}

try:
    while True:
        for game, xpath in xpaths.items():
            # Wait for the element to be present
            views_element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
            views = views_element.text
            
            # Write the views to a text file
            with open(f'{game.lower().replace(" ", "_")}_views.txt', 'w') as f:
                f.write(views)
            
            print(f"Updated {game} views: {views}")
        
        # Wait for 5 seconds before the next update
        time.sleep(5)

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the browser
    driver.quit()