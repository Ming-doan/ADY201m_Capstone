from .register import bucket
from .collection_ref import data_ref
import pandas as pd
from datetime import datetime
import os


def get_datetime():
    return datetime.now().strftime('%Y-%m-%d_%H:%M:%S')


def clear_temp():
    temp_path = os.path.join(os.path.dirname(__file__), 'temp')
    for file in os.listdir(temp_path):
        os.remove(os.path.join(temp_path, file))


def upload_data(file_path: str, extension: str):
    _dt = get_datetime()
    _file_name = f'data/edited/{_dt}.{extension}'
    blob = bucket.blob(_file_name)
    blob.upload_from_filename(file_path)
    return _file_name


def save_to_local(df: pd.DataFrame, extension: str):
    _path = os.path.join(os.path.dirname(__file__),
                         'temp', f'temp.{extension}')
    df.to_csv(_path, index=False)
    return _path


def save_data(data_id: str, df: pd.DataFrame, extension: str):
    _path = save_to_local(df, extension)
    _file_name = upload_data(_path, extension)
    _doc_ref = data_ref.document(data_id)
    _prev_path = _doc_ref.get().to_dict()['editedPath']
    _doc_ref.update({
        u'editedPath': [*_prev_path, _file_name]
    })
    clear_temp()
