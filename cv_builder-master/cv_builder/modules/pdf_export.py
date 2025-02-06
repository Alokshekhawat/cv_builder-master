import os
import time

from django.http import HttpResponse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json, base64


# Function to use the Chrome DevTools Protocol
def send_devtools(driver, cmd, params={}):
    resource = "/session/%s/chromium/send_command_and_get_result" % driver.session_id
    url = driver.command_executor._url + resource
    body = json.dumps({'cmd': cmd, 'params': params})
    response = driver.command_executor._request('POST', url, body)
    if response.get('status'):
        raise Exception(response.get('value'))
    return response.get('value')


# Function to export the current page as PDF, using the options provided.
def get_pdf_from_html(path, print_options={}):
    webdriver_options = Options()
    webdriver_options.add_argument('--headless')
    webdriver_options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=webdriver_options)

    driver.get(path)

    time.sleep(1)  # timeout to load page, and be sure that all CSS and fonts are loading. (1 sec)

    calculated_print_options = {
        'landscape': False,
        'displayHeaderFooter': False,
        'printBackground': True,
        'preferCSSPageSize': True,
        'pageRanges': '1',
        # 'scale': 0.99,

    }
    calculated_print_options.update(print_options)
    result = send_devtools(driver, "Page.printToPDF", calculated_print_options)
    driver.quit()
    return base64.b64decode(result['data'])


# Function to save the pdf bin data into a file
def save_pdf_to_file(pdf_data, output_filename):
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)  # create directory if not exists
    # Save the file
    with open(output_filename, 'wb') as pdf_file:
        pdf_file.write(pdf_data)


# Function to open the file in the browser
def open_file_in_browser(output_filename):
    # Open file in browser
    # 'rb' (read binary), because the pdf is in binary format
    with open(output_filename, 'rb') as pdf_file:
        response = HttpResponse(pdf_file, content_type='application/pdf')
        # TODO: add filename
        response['Content-Disposition'] = 'filename="home_page.pdf"'
    return response
