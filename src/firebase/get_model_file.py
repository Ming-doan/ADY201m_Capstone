from .register import bucket
from .collection_ref import models_ref
import os
# Models
import pickle
from tensorflow.keras.models import load_model


def download_file_to_local(file_path: str):
    blob = bucket.blob(file_path)
    file_extension = file_path.split('.')[-1]
    local_path = os.path.join(os.path.dirname(
        __file__), 'temp', f'file_temp.{file_extension}')
    blob.download_to_filename(local_path)
    return local_path


def read_model(local_path: str):
    file_extension = local_path.split('.')[-1]
    if file_extension == 'pickle':
        with open(local_path, 'rb') as f:
            model = pickle.load(f)
            clear_temp()
            f.close()
            return model
    elif file_extension == 'h5':
        model = load_model(local_path)
        clear_temp()
        return model
    else:
        clear_temp()
        return None


def clear_temp():
    temp_path = os.path.join(os.path.dirname(__file__), 'temp')
    for file in os.listdir(temp_path):
        os.remove(os.path.join(temp_path, file))


def get_model_file(model):
    _local_path = download_file_to_local(model['modelPath'])
    return read_model(_local_path)


def get_model_doc(model_id: str):
    return models_ref.document(model_id).get().to_dict()
