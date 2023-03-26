from .register import bucket, db
from .collection_ref import models_ref, user_ref
from datetime import datetime
import os
import pickle


def get_datetime():
    return datetime.now().strftime('%Y-%m-%d_%H:%M:%S')


def clear_temp():
    temp_path = os.path.join(os.path.dirname(__file__), 'temp')
    for file in os.listdir(temp_path):
        os.remove(os.path.join(temp_path, file))


def upload_model(file_path: str, provider: str):
    if provider == 'sklearn':
        extension = 'pickle'
    elif provider == 'keras':
        extension = 'h5'
    _dt = get_datetime()
    _file_name = f'models/{_dt}.{extension}'
    blob = bucket.blob(_file_name)
    blob.upload_from_filename(file_path)
    return _file_name


def save_to_local(model, provider: str):
    if provider == 'sklearn':
        extension = 'pickle'
    elif provider == 'keras':
        extension = 'h5'
    _path = os.path.join(os.path.dirname(__file__),
                         'temp', f'model_temp.{extension}')
    if provider == 'sklearn':
        with open(_path, 'wb') as f:
            pickle.dump(model, f)
        f.close()
    elif provider == 'keras':
        model.save(_path)
    return _path


def save_model_to_firebase(model, provider: str, data, user_id: str):
    _path = save_to_local(model, provider)
    _file_name = upload_model(_path, provider)
    # Config model doc
    data['modelPath'] = _file_name
    if provider == 'sklearn':
        model_name = f'sklearn/{get_datetime().split("_")[1]}'
    elif provider == 'keras':
        model_name = f'keras/{get_datetime().split("_")[1]}'
    data['modelName'] = model_name
    # Update model doc
    _, _model_ref = models_ref.add(data)
    _doc_ref = user_ref.document(user_id)
    _prev_path = _doc_ref.get().to_dict()['modelsId']
    _doc_ref.update({
        u'modelsId': [*_prev_path, _model_ref.id]
    })
    clear_temp()
