from .register import bucket
from .collection_ref import data_ref
import os
import pandas as pd


def download_file_to_local(file_path: str):
    blob = bucket.blob(file_path)
    file_extension = file_path.split('.')[-1]
    local_path = os.path.join(os.path.dirname(
        __file__), 'temp', f'temp.{file_extension}')
    blob.download_to_filename(local_path)
    return local_path


def read_as_dataframe(local_path: str):
    file_extension = local_path.split('.')[-1]
    if file_extension == 'csv':
        df = pd.read_csv(local_path)
        clear_temp()
        return df
    elif file_extension == 'xlsx':
        df = pd.read_excel(local_path)
        clear_temp()
        return df
    else:
        clear_temp()
        return None


def clear_temp():
    temp_path = os.path.join(os.path.dirname(__file__), 'temp')
    for file in os.listdir(temp_path):
        os.remove(os.path.join(temp_path, file))


def convert_to_dict(df: pd.DataFrame):
    return df.to_dict(orient='records')


def get_data_by_id(data_id: str):
    _data = data_ref.document(data_id).get().to_dict()
    if len(_data['editedPath']) != 0:
        _local_path = download_file_to_local(_data['editedPath'][-1])
    else:
        _local_path = download_file_to_local(_data['rawPath'])
    return read_as_dataframe(_local_path)


def get_raw_data_by_id(data_id: str):
    _data = data_ref.document(data_id).get().to_dict()
    _local_path = download_file_to_local(_data['rawPath'])
    return read_as_dataframe(_local_path)


def get_data_doc(data_id: str):
    return data_ref.document(data_id).get().to_dict()
