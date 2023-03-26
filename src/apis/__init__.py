from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import pandas as pd
from ..firebase.get_data_list import get_data_list
from ..firebase.get_model_list import get_models_list
from ..firebase.create_model import save_model_to_firebase
from ..firebase.get_data_file import get_data_by_id, convert_to_dict, get_raw_data_by_id
from ..firebase.get_model_file import get_model_file, get_model_doc
from ..utils.table_operation import drop_column
from ..firebase.save_data import save_data
from .wrangling import wrangling
from .summary import summary
from .training import training_model
from .predict import prediction_model

apis_bp = Blueprint('apis', __name__, url_prefix='/apis')

# Temp global constants for processing data
# Change to local variable later
DF: pd.DataFrame = None
WORKING_DF: pd.DataFrame = None
WORKDING_DATA_ID = None
NUM_OF_ROWS = 20
CURRENT_MODEL = None


# Data apis

# Get Data List
@apis_bp.route('/getdatalist/<string:user_id>', methods=['GET'])
def get_data_list_by_user_id(user_id: str):
    if request.method == 'GET':
        return get_data_list(user_id)


# Get Data By Id
@apis_bp.route('/getdatafile/<string:data_id>', methods=['GET'])
def get_data_file(data_id: str):
    global WORKING_DF, WORKDING_DATA_ID
    if request.method == 'GET':
        DF = get_data_by_id(data_id)
        WORKING_DF = DF
        WORKDING_DATA_ID = data_id
        _response = {
            'pages': len(WORKING_DF) // NUM_OF_ROWS + 1,
            'current': 1,
            'data': convert_to_dict(WORKING_DF.head(NUM_OF_ROWS)),
        }
        return jsonify(_response)


# Update Data By Id
@apis_bp.route('/savedata/<string:data_id>', methods=['POST'])
@cross_origin()
def save_data_by_id(data_id: str):
    if request.method == 'POST':
        _extension = request.get_json()['extension']
        DF = WORKING_DF
        save_data(data_id, DF, _extension)
        _response = {
            'success': True
        }
        return jsonify(_response)


# Table Processing apis

# Drop Table Column and return new table
@apis_bp.route('/dropcolumn/<string:data_id>', methods=['POST'])
@cross_origin()
def drop_column_by_id(data_id: str):
    global WORKING_DF, WORKDING_DATA_ID
    if request.method == 'POST':
        column_name = request.get_json()['columnName']
        if data_id == WORKDING_DATA_ID:
            WORKING_DF = drop_column(WORKING_DF, column_name)
        _response = {
            'pages': len(WORKING_DF) // NUM_OF_ROWS + 1,
            'current': 1,
            'data': convert_to_dict(WORKING_DF.head(NUM_OF_ROWS)),
        }
        return jsonify(_response)


# Wrangling Table and return new table
@apis_bp.route('/wrangling/<string:data_id>', methods=['POST'])
@cross_origin()
def wrangling_data_by_id(data_id: str):
    global WORKING_DF, WORKDING_DATA_ID
    if request.method == 'POST':
        _fillingna_numeric = request.get_json()['fillingNaNumeric']
        _fillingna_categorical = request.get_json()['fillingNaCategorical']
        _normalization_numeric = request.get_json()['normalizationNumeric']
        _normalization_categorical = request.get_json()[
            'normalizationCategorical']
        # Wrangling
        if data_id == WORKDING_DATA_ID:
            working_df_keys = list(WORKING_DF.columns)
            WORKING_DF = wrangling(data_id, WORKING_DF, working_df_keys, _fillingna_numeric, _fillingna_categorical,
                                   _normalization_numeric, _normalization_categorical)
        _response = {
            'pages': len(WORKING_DF) // NUM_OF_ROWS + 1,
            'current': 1,
            'data': convert_to_dict(WORKING_DF.head(NUM_OF_ROWS)),
        }
        return jsonify(_response)


# Get Table Summary
@apis_bp.route('/tablesummary/<string:data_id>', methods=['POST'])
def get_summary_by_id(data_id: str):
    if request.method == 'POST':
        column_name = request.get_json()['columnName']
        _raw_df = get_raw_data_by_id(data_id)
        # Summary
        _summary = summary(data_id, _raw_df, column_name)
        _response = {
            'columnName': column_name,
            'data': _summary,
        }
        return jsonify(_response)


# Training apis

# Training Model
@apis_bp.route('/trainingmodel/<string:data_id>', methods=['POST'])
def training(data_id: str):
    global CURRENT_MODEL
    if request.method == 'POST':
        _model_name = request.get_json()['modelName']
        _lib_name = request.get_json()['libName']
        _inputs = request.get_json()['inputs']
        _outputs = request.get_json()['outputs']
        _train_test_split = request.get_json()['trainTestSplit']
        # _model_config = request.get_json()['modelConfig']
        # Training
        _model = training_model(data_id, WORKING_DF, _model_name, _lib_name,
                                _inputs, _outputs, _train_test_split)
        CURRENT_MODEL = _model['model']
        _response = {
            'success': True,
            'metrics': _model['metrics'],
        }
        return jsonify(_response)


# Model apis

# Save model
@apis_bp.route('/savemodel/<string:user_id>', methods=['POST'])
def save_model(user_id: str):
    global CURRENT_MODEL
    if request.method == 'POST':
        _provider = request.get_json()['provider']
        _data = request.get_json()['data']
        # Save model
        save_model_to_firebase(CURRENT_MODEL, _provider, _data, user_id)
        _response = {
            'success': True,
        }
        return jsonify(_response)


# Get model list
@apis_bp.route('/getmodelslist/<string:user_id>', methods=['GET'])
def get_models_list_by_user_id(user_id: str):
    if request.method == 'GET':
        return get_models_list(user_id)


# Get model by id
@apis_bp.route('/getmodel/<string:model_id>', methods=['GET'])
def get_model_by_id(model_id: str):
    global CURRENT_MODEL
    if request.method == 'GET':
        _model_doc = get_model_doc(model_id)
        CURRENT_MODEL = get_model_file(_model_doc)
        _response = {**_model_doc, '_id': model_id}
        return jsonify(_response)


# Prediction
@apis_bp.route('/prediction/<string:model_id>', methods=['POST'])
def prediction(model_id: str):
    global CURRENT_MODEL
    if request.method == 'POST':
        _data = request.get_json()['data']
        _model_doc = get_model_doc(model_id)
        _root_data = get_raw_data_by_id(_model_doc['trainedData'])
        # Prediction
        _result = prediction_model(_model_doc, CURRENT_MODEL, _root_data,
                                   _model_doc['inputsKey'], _model_doc['outputsKey'], _data)
        _response = {
            'success': True,
            'result': _result,
        }
        return jsonify(_response)
