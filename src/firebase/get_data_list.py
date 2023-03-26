from .collection_ref import user_ref, data_ref


def get_data_list(user_id: str):
    _return = []
    _user = user_ref.document(user_id)
    _data_id = _user.get().to_dict()['dataId']
    for doc_id in _data_id:
        _data = data_ref.document(doc_id)
        _dict = _data.get().to_dict()
        _return.append({**_dict, '_id': doc_id})
    return _return
