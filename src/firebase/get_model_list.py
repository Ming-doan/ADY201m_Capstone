from .collection_ref import user_ref, models_ref


def get_models_list(user_id: str):
    _return = []
    _user = user_ref.document(user_id)
    _data_id = _user.get().to_dict()['modelsId']
    for models_id in _data_id:
        _data = models_ref.document(models_id)
        _dict = _data.get().to_dict()
        _return.append({**_dict, '_id': models_id})
    return _return
