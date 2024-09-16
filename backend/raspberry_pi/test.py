import requests
import time

# URL of your local server
url = 'http://localhost:8080/sensor-data'

# Sample data to send
data = {
    'temperature': 22.5,
    'humidity': 55,
    'moisture': 32
}

# Function to send data
def send_data():
    try:
        # Send POST request with JSON data
        response = requests.post(url, json=data)
        
        # Print the response from the server
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")

        # Increment data values
        data['temperature'] += 1
        data['humidity'] += 1
        data['moisture'] += 1

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Mimic sending data periodically
if __name__ == "__main__":
    while True:
        send_data()
        time.sleep(10)  # Wait for 10 seconds before sending the next request