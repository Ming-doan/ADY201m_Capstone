import os
from firebase_admin import credentials, initialize_app, firestore, storage

key_path = os.path.join(os.path.dirname(
    __file__), 'keys', 'ady201m-machine-learning-firebase-adminsdk-uiaa9-3487093f8e.json')
cred = credentials.Certificate(key_path)
app = initialize_app(cred, {
    'projectId': 'ady201m-machine-learning',
    'databaseURL': 'https://ady201m-machine-learning.firebaseio.com',
    'storageBucket': 'ady201m-machine-learning.appspot.com'
})

db = firestore.client(app)
bucket = storage.bucket()
